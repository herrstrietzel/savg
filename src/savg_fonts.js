import {dataURLToBlob, blobToBase64} from './savg_blob.js';

/**
 * convert all external font references to
 * inlined base64 encoded dataURLs
 */

export async function externalFontsToBase64(css, assetCache = {}) {
    // Initialize fonts cache if not exists
    if (!assetCache.fonts) {
        assetCache.fonts = {};
    }

    let stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(css);

    let fontFaceRules = [...stylesheet.cssRules].filter((item) => item.type === 5);

    let urlArr = fontFaceRules.map(rule => {
        let src = rule.style.getPropertyValue('src');
        return src ? src.split(',').map(val => val.trim()) : [];
    });

    let urls = [];

    urlArr.forEach(fontSrc => {
        if (!fontSrc || !fontSrc.length) return;

        let fontArr = [];
        let fontSrcStr = [];
        let ruleStr = fontSrc.join(', ');

        fontSrc.forEach(url => {
            if (!url || url === 'undefined') return;

            let ext = url.split('/').slice(-1)[0].split('?')[0].split('.').slice(-1)[0];
            if (ext === 'eot' || ext === 'svg') {
                css = css.replaceAll(url, '');
            } else {
                fontSrcStr.push(url);
                let cleanUrl = url.replace(/url\(|\)|'|"/gi, '').split(' ')[0];
                if (cleanUrl && cleanUrl !== 'undefined') {
                    fontArr.push(cleanUrl);
                }
            }
        });

        if (fontSrcStr.length) {
            let ruleStrNew = fontSrcStr.join(', ');
            css = css.replace(ruleStr, ruleStrNew);
        }

        if (fontArr[0]) {
            urls.push(fontArr[0]);
        }
    });

    if (!urls.length) {
        return css;
    }

    const replacements = await Promise.all(urls.map(async (url) => {
        if (!url || url.startsWith('data:')) {
            return { url, base64: url };
        }

        try {
            if (assetCache.fonts[url]) {
                return { url, base64: assetCache.fonts[url] };
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

            const blob = await res.blob();
            const base64 = await blobToBase64(blob);
            assetCache.fonts[url] = base64;

            return { url, base64 };
        } catch (error) {
            console.error(`Error processing font ${url}:`, error);
            return { url, base64: url };
        }
    }));

    let processedCss = css;
    for (const { url, base64 } of replacements) {
        if (url) {
            processedCss = processedCss.replaceAll(url, base64);
        }
    }

    return processedCss;
}


export async function externalFontsToBase64_0(css, assetCache = {}) {
    // create new CSS object for parsing
    let stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(css);

    let fontFaceRules = [...stylesheet.cssRules].filter((item) => item.type === 5);

    /**
     *  find external urls in css via regex
     *  ignore legacy src (woff, t)
     */
    let urlArr = fontFaceRules.map(rule => { return rule.style.getPropertyValue('src').split(',').map(val => val.trim()) })
    let urls = [];

    /**
     * remove deprecated formats like
     * .eot or svg
     */
    urlArr.forEach(fontSrc => {
        let fontArr = [];
        let fontSrcStr = [];

        // original src property string - containing alternative formats
        let ruleStr = fontSrc.join(', ');

        fontSrc.forEach(url => {
            let ext = url.split('/').slice(-1)[0].split('?')[0].split('.').slice(-1)[0];
            if (ext === 'eot' || ext === 'svg') {
                css.replaceAll(url, '')
            } else {
                if(url) fontSrcStr.push(url);
                url = url ? url.replace(/url\(|\)|'|"/gi, '').split(' ')[0] : '';
                //if(url && url!=='undefined') fontArr.push(url);
                if(url) fontArr.push(url);
            }
        })

        // remove depricated formats from CSS
        let ruleStrNew = fontSrcStr[0];
        css = css.replace(ruleStr, ruleStrNew)


        // add only first for embedding
        if(fontArr[0]) urls.push(fontArr[0])
    })

    if(!urls.length){
        return css;
    }

    // Process all URLs in parallel
    const replacements = await Promise.all(urls.map(async (url) => {

        let base64;

        try {
            // is already cached
            if (assetCache.fonts[url]) {
                //console.log('!!!is cached', url);
                base64 = assetCache.fonts[url];
                return { url, base64: base64 };
            }

            // is already base64
            if (url.startsWith('data:')) {
                //add to cache
                //assetCache[url] = url;
                return { url, base64: url };
            }


            // fetch font files
            url = url || '';
            let res = url ? await fetch(url) : {ok:false};

            if (res.ok) {
                // fetch font file
                const blob = await res.blob();

                // create base64 string
                base64 = await blobToBase64(blob);

                //add to cache
                assetCache.fonts[url] = base64;

                return { url, base64 };
            } else {
                console.log(`Font data couldn't be fetched for ${url} – check CORS headers or file access permissions`);
                return { url, base64: url }; // Return original URL if fetch fails
            }
        } catch (error) {
            console.error(`Error processing font ${url}:`, error);
            return { url, base64: url }; // Return original URL if there's an error
        }
    }));

    // Apply all replacements
    let processedCss = css;
    for (const { url, base64 } of replacements) {
        processedCss = processedCss.replaceAll(url, base64);
    }

    return processedCss;
}



/**
 * collect all fonts and characters
 * required for SVG rendering
 * used to remove unnecessary font-face rules
 * and apply google font API subsetting if possible
 */

export function analizeSVGText(svg) {

    // collect used fonts
    let usedFonts = {}

    // collect subset strings for families
    let familyStrings = {};


    // query text elements
    let textEls = svg.querySelectorAll('text, tspan, textPath, foreignObject *')

    let allText = [... new Set([...[...textEls].map(el => el.textContent).join('').split('')])].join('')

    // if no text elements are present
    if (!textEls.length) return usedFonts;


    for (let i = 0, len = textEls.length; len && i < len; i++) {
        let text = textEls[i];

        //check if element has any text nodes
        let textNodes = [...text.childNodes].filter(node => node.nodeType === 3 && node.textContent.trim())
        if (!textNodes.length) continue;

        let style = window.getComputedStyle(text);
        let [fontFamily, fontWeight, fontStyle, fontStretch] = [style.getPropertyValue('font-family'), style.getPropertyValue('font-weight'), style.getPropertyValue('font-style'), style.getPropertyValue('font-stretch')||'100']

        fontFamily = fontFamily.replace(/"|'| |%/g, '');

        // subset string
        let subsetChars = textNodes.map(node => node.textContent).join('').trim();
        let charsUnique = [...new Set([...subsetChars.split('')])].join('').replaceAll('\n', '')

        // check unicode range/language
        let language = detectLanguageSet(unicodeRangeFromString(charsUnique))
        // change PUA to latin for icon fonts
        if (language === 'PUA') language = 'latin'

        // create unique key for font style
        let key = [fontFamily, fontWeight, fontStyle, fontStretch, language].join('_').replace(/"|'| |%/g, '');

        if (!usedFonts[key]) {
            usedFonts[key] = []
        }

        if (!familyStrings[fontFamily]) {
            familyStrings[fontFamily] = []
        }
        familyStrings[fontFamily].push(charsUnique);

    }

    //flatten substring array
    for (let family in usedFonts) {
        let familyName = family.split('_')[0];
        usedFonts[family] = [...new Set(familyStrings[familyName].join('').split(''))].join('')
    }

    usedFonts.allText = allText;
    return usedFonts;

}


/**
 * detect unnecessary 
 * font face rules
 */
export function checkFontCoverage(sheet, svgFontInfo = {}, isGoogleFont = false, subsets = [], subset = '', hasMulti = false, availableFonts={}) {
    let fontsToSubset = [];
    let exclude = [];

    // compare fonts with required
    for (let i = 0, len = sheet.cssRules.length; len && i < len; i++) {
        let rule = sheet.cssRules[i];
        let type = rule.type;

        // is fontface
        if (type === 5) {
            let [fontFamily, fontWeight, fontStyle, fontStretch] = [
                rule.style.getPropertyValue('font-family').replace(/"|'| /g, ''),
                rule.style.getPropertyValue('font-weight') || '400',
                rule.style.getPropertyValue('font-style') || 'normal',
                rule.style.getPropertyValue('font-stretch')||'100',
            ];
            let subsetCurrent = subset ? subset : (subsets[i] ? subsets[i] : 'latin');
            fontWeight = fontWeight.split(' ').map(val => convertFontValues(val, 'weight'));
            fontStretch = fontStretch.split(' ').map(val => convertFontValues(val, 'stretch'));


            let font_key = [fontFamily, fontWeight[0], fontStyle, fontStretch[0], subsetCurrent].join('_').replace(/"|'| /g, '').trim()
            let isVF = fontWeight.length > 1 || fontStretch.length > 1 ? true : false;


            if (isVF) {
                for (let key in svgFontInfo) {
                    if (key !== 'allText') {
                        let [family, weight, style, stretch, subset] = key.split('_')
                        if (family === fontFamily &&
                            style === fontStyle &&
                            (+weight >= fontWeight[0]) &&
                            (+stretch >= fontStretch[0]) &&
                            (subset === subsetCurrent)
                        ) {
                            if (isGoogleFont) fontsToSubset.push(font_key)
                        }
                    }
                }
            }

            // exact static match
            else if (svgFontInfo[font_key]) {
                //console.log('has font subset', font_key);
                if (isGoogleFont) fontsToSubset.push(font_key)
            }

            // no match try to adjust non existent weights or widths
            else {
                exclude.push(i)
            }
        }
    }
    return { fontsToSubset, exclude }
}


/**
 * colllect all style info from 
 * current stylesheet
 */
export function checkAvailableFonts(sheet, subsets = [], subset = '') {

    let fontDataLoaded = {}

    // compare fonts with required
    for (let i = 0, len = sheet.cssRules.length; len && i < len; i++) {
        let rule = sheet.cssRules[i];
        let type = rule.type;

        // is fontface
        if (type === 5) {
            let [fontFamily, fontWeight, fontStyle, fontStretch] = [
                rule.style.getPropertyValue('font-family').replace(/"|'| /g, ''),
                rule.style.getPropertyValue('font-weight') || '400',
                rule.style.getPropertyValue('font-style') || 'normal',
                rule.style.getPropertyValue('font-stretch') || '100',
            ];
            let subsetCurrent = subset ? subset : (subsets[i] ? subsets[i] : 'latin');

            // collect all available weights and styles
            if (!fontDataLoaded[fontFamily]) {
                fontDataLoaded[fontFamily] = { weights: new Set([]), widths: new Set([]), styles: new Set([]), isVF: false, subsets: new Set([]), keys: new Set() }
            }

            // normalize weights and widths string literals            
            fontWeight = fontWeight.split(' ').map(val => convertFontValues(val, 'weight'));
            fontStretch = fontStretch.split(' ').map(val => convertFontValues(val, 'stretch')).filter(Boolean);

            let isVF = fontWeight.length > 1 || fontStretch.length > 1 ? true : false;

            // add weights
            fontWeight.forEach(wght => fontDataLoaded[fontFamily].weights.add(wght))
            fontStretch.forEach(wdth => fontDataLoaded[fontFamily].widths.add(wdth))
            fontDataLoaded[fontFamily].isVF = isVF;
            fontDataLoaded[fontFamily].subsets.add(subsetCurrent);
            fontDataLoaded[fontFamily].styles.add(fontStyle);

        }
    }

    return fontDataLoaded
}


/**
 * adjust font info to available 
 * weights and styles
 */

export function updateFontInfo(availableFonts, svgFontInfo) {

    for (let key in svgFontInfo) {
        if (key !== 'allText') {
            let [family, weight, style, stretch, subset] = key.split('_');
            [weight, stretch] = [weight, stretch].map(Number);
            let fontItem = availableFonts[family];

            if (!fontItem) {
                continue;
            }

            if (
                fontItem.styles.has(style) &&
                fontItem.subsets.has(subset)
            ) {

                let stretchNew = stretch, weightNew = weight;

                // 1. check weights
                if (!fontItem.weights.has(weight)) {

                    let weights = [...fontItem.weights]
                    let weightMin = Math.min(...weights)
                    let weightMax = Math.max(...weights)
                    //console.log('fontItem match:', family, weight, weightMin, weightMax, fontItem);

                    // too bold
                    if (weight > weightMax) {
                        //console.log('too bold', family, weight);
                        weightNew = weightMax
                    }

                    // too light
                    if (weight < weightMin) {
                        //console.log('too light', family, weight);
                        weightNew = weightMin
                    }
                }


                // 2. check stretch
                if (!fontItem.widths.has(stretch)) {

                    let widths = [...fontItem.widths]
                    let widthMin = Math.min(...widths)
                    let widthMax = Math.max(...widths)

                    // too condensed
                    if (stretch < widthMin) {
                        //console.log('too condensed', family, weight);
                        stretchNew = widthMin
                    }

                    // too expanded
                    if (stretch > widthMax) {
                        //console.log('too expanded', family, weight);
                        stretchNew = widthMax
                    }
                }

                //update
                if(weightNew!=weight || stretchNew!==stretch){
                    let keyNew = [family, weightNew, style, stretchNew, subset].join('_')
                    svgFontInfo[keyNew] = svgFontInfo[key]

                    delete svgFontInfo[key];
                }
            }
        }
    }

    //console.log('svgFontInfo new', svgFontInfo);
    return svgFontInfo

}



/**
 * convert string literal font values 
 * to numeric
 */
export function convertFontValues(value, type = 'weight') {
    if (!isNaN(value)) return parseFloat(value);
    value = value.trim().toLowerCase();

    if (type === 'stretch') {
        if (value.includes('%')) return parseFloat(value);

        const fontWidths = {
            'ultra-condensed': 50,
            'extra-condensed': 62.5,
            'condensed': 75,
            'semi-condensed': 87.5,
            'normal': 100,
            'semi-expanded': 112.5,
            'expanded': 125,
            'extra-expanded': 150,
            'ultra-expanded': 200,
        };
        return fontWidths[value] || 100; // default to normal if unknown
    }

    if (type === 'weight') {
        const fontWeights = {
            'thin': 100,
            'extra-light': 200,
            'ultra-light': 200,
            'light': 300,
            'normal': 400,
            'regular': 400,
            'medium': 500,
            'semi-bold': 600,
            'demi-bold': 600,
            'bold': 700,
            'extra-bold': 800,
            'ultra-bold': 800,
            'black': 900,
            'heavy': 900,
        };
        return fontWeights[value] || 400; // default to normal if unknown
    }

};





/**
 * detect unicode range
 */

export function detectLanguageSet(unicodeRangeStr) {
    // Define known ranges (based on Unicode standards)
    let knownRanges = {
        'latin': [
            [0x0020, 0x007f], // Basic Latin
        ],

        'latin-ext': [
            [0x00a0, 0x00ff], // Latin-1 Supplement
            [0x0100, 0x017f], // Latin Extended-A
            //[0x0180, 0x024f] // Latin Extended-B
        ],

        'cyrillic': [
            [0x0400, 0x04ff], // Cyrillic
            //[0x0500, 0x052f], // Cyrillic Supplement
            //[0x2de0, 0x2dff], // Cyrillic Extended-A
            //[0xa640, 0xa69f] // Cyrillic Extended-B
        ],

        'cyrillic-ext': [
            [0x0500, 0x052f], // Cyrillic Supplement
            [0x2de0, 0x2dff], // Cyrillic Extended-A
            [0xa640, 0xa69f] // Cyrillic Extended-B
        ],

        'greek': [
            [0x0370, 0x03ff], // Greek and Coptic
            //[0x1f00, 0x1fff] // Greek Extended
        ],

        'greek-ext': [
            [0x0370, 0x03ff], // Greek and Coptic
            [0x1f00, 0x1fff] // Greek Extended
        ],

        'vietnamese': [
            [0x0102, 0x0103], // Vietnamese letters (Latin Extended-A subset)
            //[0x0110, 0x0111],
            //[0x0128, 0x0129],
            //[0x0168, 0x0169],
            //[0x01a0, 0x01a1],
            //[0x01af, 0x01b0],
            //[0x1ea0, 0x1ef9] // Vietnamese-specific Latin range
        ],


        'arabic': [
            [0x0600, 0x06ff], // Arabic
            //[0x0750, 0x077f], // Arabic Supplement
            //[0x08a0, 0x08ff], // Arabic Extended-A
            //[0xfb50, 0xfdff], // Arabic Presentation Forms-A
            //[0xfe70, 0xfeff] // Arabic Presentation Forms-B
        ],

        'hebrew': [
            [0x0590, 0x05ff], // Hebrew
            //[0xfb1d, 0xfb4f] // Hebrew Presentation Forms
        ],

        'PUA': [
            [0xE000, 0xF8FF],
            [0xF0000, 0xFFFFD],
            [0x100000, 0x10FFFD],
        ],

        /*
        'math': [
            [0x0020, 0x007f], // Basic Latin
            [0x0393, 0x25CA],
        ]
        */

        // Define more language ranges as needed
    };

    const parseUnicodeRange = (range) => {
        return range.split(",").map((part) => {
            const [start, end] = part.trim().replace("U+", "").split("-");
            const startCode = parseInt(start, 16);
            const endCode = end ? parseInt(end, 16) : startCode;
            return [startCode, endCode];
        });
    };

    const calculateAbsoluteOverlap = (userRanges, knownRange) => {
        let overlapCount = 0;

        knownRange.forEach(([knownStart, knownEnd]) => {
            userRanges.forEach(([userStart, userEnd]) => {
                const start = Math.max(knownStart, userStart);
                const end = Math.min(knownEnd, userEnd);
                if (start <= end) overlapCount += end - start + 1;
            });
        });

        return overlapCount;
    };

    // Parse user-specified unicode ranges
    const userRanges = parseUnicodeRange(unicodeRangeStr);

    // Calculate absolute overlaps for each language set
    const detectedSets = [];
    for (const [lang, ranges] of Object.entries(knownRanges)) {
        const overlapCount = calculateAbsoluteOverlap(userRanges, ranges);
        if (overlapCount > 0) {
            detectedSets.push({ language: lang, overlap: overlapCount });
        }
    }

    let bestMatch = detectedSets.sort((a, b) => b.overlap - a.overlap);
    bestMatch = bestMatch.length ? bestMatch[0].language : '';
    //console.log('bestMatch', bestMatch);
    // Return the best-matching language(s), sorted by overlap percentage
    return bestMatch;
}



export function gfontRangeToString(rangesStr) {
    // collect all characters
    let allChars = [];
    //sanitize
    rangesStr = rangesStr
        .replaceAll("unicode-range:", "")
        .replaceAll(";", "")
        .trim();
    ranges = rangesStr.split(", ");
    ranges.forEach((range) => {
        range = range.replaceAll("U+", "").split("-");
        let ch0 = range[0];
        //console.log(ch0)
        let ind0 = hex2Dec(ch0);
        allChars.push(ind0);
        if (range.length > 1) {
            let ch1 = range[1];
            let ind1 = hex2Dec(ch1);
            allChars.push(ind1);
            // get intermediate codepoints in range
            let diff = ind1 - ind0;
            for (let i = 0; i < diff; i++) {
                let indI = ind0 + i;
                allChars.push(indI);
            }
        }
    });
    //deduplicate
    //allChars = [...new Set(allChars)];
    let charArr = allChars
        .map((val) => {
            let char = String.fromCharCode(val);
            let invisible = containsInvisibleCharacters(char)
            return !invisible ? char : '';
        }).filter(Boolean);


    return charArr;
}

export function toUnicodeRange(codePoints) {
    //alert('oi')
    // Sort code points in ascending order
    codePoints.sort((a, b) => a - b);

    // Helper to format a single code point as U+XXXX
    let formatCodePoint = (point, addPrefix = true) => {
        let prefix = addPrefix ? 'U+' : ''
        return prefix + point.toString(16).toUpperCase().padStart(4, '0');
    }

    // Array to store ranges
    let ranges = [];
    let start = codePoints[0];
    let end = start;

    for (let i = 1; i < codePoints.length; i++) {
        if (codePoints[i] === end + 1) {
            // Continue the range if the next code point is consecutive
            end = codePoints[i];
        } else {
            // Add the current range to the list
            ranges.push(start === end ? formatCodePoint(start) : `${formatCodePoint(start)}-${formatCodePoint(end, false)}`);
            // Start a new range
            start = codePoints[i];
            end = start;
        }
    }

    // Add the final range
    ranges.push(start === end ? formatCodePoint(start) : `${formatCodePoint(start)}-${formatCodePoint(end, false)}`);

    // Join all ranges with commas
    return ranges.join(", ");
}

export function toHexaDecimal(codePoint) {
    return "U+" + codePoint.toString(16).toUpperCase().padStart(4, '0');
}

export function hex2Dec(hex) {
    return parseInt(hex, 16);
}

export function charToHex(str) {
    // Get the Unicode code point of the character and convert it to hexadecimal
    const codePoint = str.charCodeAt(0);
    // Convert the code point to a hexadecimal string and pad with zeros if necessary
    return "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");
}


export function unicodeRangeFromString(str) {
    let chars = [... new Set(str.split('').filter(Boolean))]
    let codePoints = chars.map(char => { return char.charCodeAt(0) })
    let range = toUnicodeRange(codePoints);
    return range
}


export function containsInvisibleCharacters(str) {
    // Regular expression to match most invisible characters
    let invisibleCharsRegex = /[\x00-\x1F\u00A0\u200B\u200C\u200D\u2060\uFEFF]/;

    // Test if the string contains any invisible character
    return invisibleCharsRegex.test(str);
}
