import {analizeSVGText, checkAvailableFonts, updateFontInfo, checkFontCoverage, externalFontsToBase64   } from './savgy_fonts.js';

/**
 * inline global stylesheets for 
 * self-contained SVG
 */

export async function inlineGlobalStyles(svg, svgFontInfo = {}, assetCache = {}) {
    // Initialize CSS cache if not exists
    if (!assetCache.css) {
        assetCache.css = {};
    }

    let globalCSS = '';
    let styleSheets = document.styleSheets;

    for (let sheet of styleSheets) {
        // skip inline SVG styles
        const ownerNode = sheet.ownerNode;
        if (ownerNode && ownerNode.closest('svg')) continue;

        // Process external stylesheets
        if (sheet.href) {
            let url = sheet.href;
            let isGoogleFont = url.includes('fonts.google');
            let css, subsets = [];
            let hasMulti = false;

            // Check cache first
            if (assetCache.css[url]) {
                css = assetCache.css[url].css;
                subsets = assetCache.css[url].subsets || [];
                hasMulti = assetCache.css[url].hasMulti || false;
            } else {
                // Fetch if not in cache
                try {
                    let res = await fetch(url);
                    if (res.ok) {
                        css = await res.text();
                        
                        // Remove imports
                        let reg = /@import\s+(?:url\()?["']?([^"')]+)["']?\)?[^;]*;?/gi;
                        let imports = css.match(reg) || [];
                        imports.forEach(imp => {
                            css = css.replace(imp, '');
                        });

                        // Fix relative URLs
                        css = relativeToAbsoluteUrls(css, url);

                        if (isGoogleFont) {
                            // Retrieve subsets from comments
                            let comments = [...css.matchAll(/\/\*\s*(.*?)\s*\*\//g)];
                            subsets = comments ? comments.map(match => match[1]) : [];
                            let families = url.split('family=').slice(1);
                            hasMulti = families.length > 1;
                        }

                        // Cache the response
                        assetCache.css[url] = {
                            css,
                            subsets,
                            hasMulti,
                            isGoogleFont
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching stylesheet ${url}:`, error);
                    continue;
                }
            }

            if (!css) continue;

            let sheetInline = new CSSStyleSheet();
            sheetInline.replaceSync(css);

            // Check all available fonts
            let availableFonts = checkAvailableFonts(sheetInline, subsets);

            // Update fontinfo
            updateFontInfo(availableFonts, svgFontInfo);

            let { exclude, fontsToSubset } = checkFontCoverage(
                sheetInline, svgFontInfo, isGoogleFont, subsets, '', hasMulti, availableFonts
            );

            // Handle Google Font subsetting
            if (fontsToSubset.length && isGoogleFont) {
                let key = fontsToSubset[0];
                let subsetStr = hasMulti ? svgFontInfo.allText : svgFontInfo[key];
                let subsetQuery = url + '&text=' + encodeURIComponent(subsetStr);

                // Check cache for subset
                if (!assetCache.css[subsetQuery]) {
                    try {
                        let res = await fetch(subsetQuery);
                        if (res.ok) {
                            let subsetCss = await res.text();
                            assetCache.css[subsetQuery] = {
                                css: subsetCss,
                                isSubset: true
                            };
                            css = subsetCss;
                            sheetInline = new CSSStyleSheet();
                            sheetInline.replaceSync(css);

                            let subset = 'latin';
                            ({ exclude, fontsToSubset } = checkFontCoverage(
                                sheetInline, svgFontInfo, isGoogleFont, subsets, subset, hasMulti, availableFonts
                            ));
                        }
                    } catch (error) {
                        console.error(`Error fetching font subset ${subsetQuery}:`, error);
                    }
                } else {
                    // Use cached subset
                    css = assetCache.css[subsetQuery].css;
                    sheetInline = new CSSStyleSheet();
                    sheetInline.replaceSync(css);
                }
            }

            // Remove unused rules
            for (let len = exclude.length, i = len - 1; len && i >= 0; i--) {
                let indx = exclude[i];
                if (sheetInline.cssRules[indx]) {
                    sheetInline.deleteRule(indx);
                }
            }

            sheet = sheetInline;
        }

        if (sheet.cssRules.length) {
            // Check if SVG is affected by rules
            for (let i = 0, len = sheet.cssRules.length; len && i < len; i++) {
                let rule = sheet.cssRules[i];
                let type = rule.type;

                if (type === 1) {
                    let selector = rule.selectorText;
                    if (!svg.querySelector(selector)) continue;
                }

                globalCSS += rule.cssText + '\n\n';
            }
        }
    }

    return globalCSS;
}


/**
 * inline external stylesheets 
 * for parsing
 */
export async function inlineExternalStyleSheets() {

    // find external stylesheets
    let externalStylesheets = getExternalStylesheets();

    // no external stylesheets - nothing to do
    if(!externalStylesheets.length) return;

    let styleLocal = document.createElement('style');
    let css='';
    let externalLinks = [];

    for(let i=0,l=externalStylesheets.length; l&& i<l; i++){
        let {href, linkEl} = externalStylesheets[i];
        let res = await fetch(href);

        if(linkEl) externalLinks.push(linkEl);

        if(res.ok){
            css += await res.text();
        }
    }
    styleLocal.textContent=css;
    styleLocal.classList.add('cssInternal');
    document.head.append(styleLocal);

    //remove link elements
    //externalLinks.forEach(link=>link.remove());
    //externalLinks.forEach(link=>link.classList.add('external'));

}




/**
 * get all stylesheets from
 * external domains
 */

export function getExternalStylesheets() {
    let externalSheets = [];
    let currentOrigin = window.location.origin;

    // Check document.styleSheets (includes <link>, <style>, and adoptedStyleSheets)
    for (let sheet of document.styleSheets) {
        try {
            // Skip inline <style> (no href)
            if (!sheet.href) continue;

            // Check if stylesheet is from a different origin
            let sheetOrigin = new URL(sheet.href).origin;
            let linkEl;
            if (sheetOrigin !== currentOrigin) {
                //let linkEl = document.querySelector(`link[href=${sheet.href}]`);
                linkEl = document.querySelector(`link[href="${sheet.href}"]`);
                linkEl.classList.add('externalCSS');
                //console.log('linkEl', linkEl, sheet.href, sheetOrigin);

                externalSheets.push({
                    href: sheet.href,
                    linkEl: linkEl,
                    type: sheet.ownerNode?.tagName || 'adoptedStylesheet' // "LINK", "STYLE", or "adoptedStylesheet"
                });
            }
        } catch (err) {
            console.warn(`Could not parse URL for stylesheet:`, sheet.href);
        }
    }

    return externalSheets;
}


/**
 * find all imports
 * "hidden" in external stylesheets or
 * defined in style elements
 */

export function getAllImportRules() {
    let importRules = [];
    let styleSheets = document.styleSheets;
    let currentOrigin = window.location.origin;
    //console.log('styleSheets', styleSheets);

    // Loop through all stylesheets in the document
    for (const sheet of styleSheets) {

        let sheetOrigin = sheet.href ? new URL(sheet.href).origin : currentOrigin;
        //console.log('sheet.href', sheet.href);

        // ignore external stylesheets
        if (sheetOrigin !== currentOrigin) continue;

        // ignore previously tagged as external stylesheets
        //if(sheet.ownerNode.classList.contains('externalCSS') ) continue;

        try {
            // Loop through all rules in the stylesheet
            for (const rule of sheet.cssRules) {
                if (rule instanceof CSSImportRule) {
                    importRules.push(rule.href);
                }
            }
        } catch (err) {
            // CORS error: Cannot access rules from cross-origin sheets
            console.warn(`Cannot read rules from stylesheet: ${sheet.href || 'inline <style>'}`, sheetOrigin);
        }
    }

    // deduplicate
    importRules = [...new Set([...importRules])];

    return importRules;
}



/**
 * convert imports to links
 * to facilitate CSS rule parsing
 */
export async function importRulesToLink(importRules=[]) {

    for(let i=0,l=importRules.length; l&& i<l; i++){
        //let imp = importRules[i];
        let href = importRules[i];

        let link = document.createElement('link');
        link.href = href;
        link.rel = "stylesheet";
        link.classList.add('internalCSS')

        document.head.append(link);

        // Wait for the link to load before removing the @import
        await new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve; // Handle errors gracefully
        });

    }


}

/**
 * convert relative URLs to absolute
 * to enable correct fetching
 */

export function relativeToAbsoluteUrls(css, url) {

    const urlRegex = /url\(\s*['"]?(.*?)['"]?\s*\)/g;
    let urls = css.match(urlRegex)

    if (!urls) return css;

    // exclude ie crap fonts
    urls = urls.filter(url => !url.includes('.eot'))

    let baseUrl = url;
    let pathArr = url.split('/')

    urls.forEach(url => {

        url = url.split(/\(|\)/)[1].replace(/"|'/g, '')
        let urlAbs = url;

        /**
         * Absolute URLs: 
         * find relative paths or 
         * parent directory traversal
         */
        let dirs = url.split('../');
        let parentDirs = url.match(/\.\.\//g);
        let relativeDir = url.match(/\.\//g);
        let traverse = parentDirs ? parentDirs.length : 0;

        // traverse to parent directory
        if (traverse) {
            let index = -1 - traverse
            let fontPath = dirs.slice(-1)[0];
            baseUrl = pathArr.slice(0, index).join('/') + '/'
            urlAbs = baseUrl + fontPath;
        }
        else if (relativeDir) {
            urlAbs = url.replaceAll('./', baseUrl)
        }

        css = css.replaceAll(url, urlAbs)
    })

    //console.log(css);
    return css;
}



