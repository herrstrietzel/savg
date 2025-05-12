/**
 * create cache object to avoid
 * unnecessary recurring requests
 */
const assetCache = { fonts: {}, images: {}, css: {}, svg: {} };

const icons = {
    download: `<svg viewBox="0 0 100 100" class="icn-svg icn-download"><path stroke="currentColor" d="M49.4 67.3v-62.3m-40 80h80m-0.4 -53.7l-39.6 36l-39.6 -36"/></svg>`,


    copy: `<svg viewBox="0 0 86 100" class="icn-svg icn-copy "><path stroke="currentColor" d="M75.7 85h-47v-62.5h25l22 22zm-66 -5v-75h40"></path><path stroke="currentColor" stroke-linejoin="round" stroke-miterlimit="3" d="M75.7 44.5h-22v-22z"/></svg>`,

    file: `<svg viewBox="0 0 71 100" class="icn-svg icn-file"><path stroke="currentColor" d="M60.4 85h-50.8v-70h28.7l22 22z" /><path stroke="currentColor" stroke-linejoin="round" stroke-miterlimit="3" d="M60.4 37h-22v-22z" /></svg>`,

    spinner: `<svg class="icn-svg icn-spinner" viewBox="0 0 100 100">
            <path stroke="currentColor" stroke-linejoin="round" fill="none" d="M 50 10 a 40 40 0  1 1 -40 40">
            <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 50 50;360 50 50" repeatCount="indefinite"></animateTransform>
            </path>
        </svg>`,

    checkbox_filled: `<svg viewBox="0 0 105 100" class="icn-svg icn-checkbox-filled"><path d="M18.3 9h62.2c4.9 0 8.9 4 8.9 8.9v62.2c0 4.9 -4 8.9 -8.9 8.9h-62.2c-4.9 0 -8.9 -4 -8.9 -8.9v-62.2c0 -4.9 4 -8.9 8.9 -8.9z" stroke="none" style="fill:var(--icon-bg, white)" /> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M36.1 44.6l13.3 13.3l44.4 -44.4m-4.4 35.5v31.1c0 4.9 -4 8.9 -8.9 8.9h-62.2c-4.9 0 -8.9 -4 -8.9 -8.9v-62.2c0 -4.9 4 -8.9 8.9 -8.9h48.9" /></svg>`,

    checkbox: `<svg viewBox="0 0 100 100" class="icn-svg icn-checkbox"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M18.5 9h62.2c4.9 0 8.9 4 8.9 8.9v62.2c0 4.9 -4 8.9 -8.9 8.9h-62.2c-4.9 0 -8.9 -4 -8.9 -8.9v-62.2c0.1 -4.9 4 -8.9 8.9 -8.9z" style="fill:var(--icon-bg, white)"></path></svg>`,

    chevron_down: `<svg viewBox="0 0 95 100" class="icn-svg icn-chevron-down"><path stroke="currentColor" d="M84.4 32l-37.5 37.5l-37.5 -37.5" /></svg>`,

    close: `<svg viewBox="0 0 100 100" class="icn-svg icn-close"><path stroke="currentColor" d="M89.1 10l-80 80m80 0l-80 -80" /></svg>`

};

function getToolbar(icons) {

    let toolbarMarkup =
        `<div class="savgy__toolbar">
    <div class="savgy__toolbar__inner">
        <div class="savgy__toolbar__inputwrap  --savgy__toolbar__grd">
            <div class="savgy__toolbar__row savgy__toolbar__row--2">
                <div class="savgy__toolbar__col savgy__grd-label">
                    <label class="savgy__toolbar__label savgy__toolbar__label--w">W:</label>   
                    <input class="savgy__toolbar__input savgy__toolbar__input--w" type="number" value="640">
                </div>

                <div class="savgy__toolbar__col savgy__grd-label">
                    <label class="savgy__toolbar__label savgy__toolbar__label--h">H:</label>   
                    <input class="savgy__toolbar__input savgy__toolbar__input--h" type="number" value="480">
                </div>
            </div>


            <div class="savgy__toolbar__row">
                <div class="savgy__toolbar__col savgy__grd-label">
                    <label class="savgy__toolbar__label">Quality:</label>  
                    <input class="savgy__toolbar__input savgy__toolbar__input--quality" type="number" value="0.9" min="0.1" max="1" step="0.1">
                </div>
            </div>


        </div>
        <div class="savgy__toolbar__inputwrap">
            <div class="savgy__toolbar__row">
                <div class="savgy__toolbar__col">
                    <select class="savgy__toolbar__select savgy__toolbar__select--format">
                        <option class="savgy__toolbar__option" value="png">PNG </option>
                        <option class="savgy__toolbar__option" value="webp">WebP </option>
                        <option class="savgy__toolbar__option" value="jpg">Jpeg </option>
                        <option class="savgy__toolbar__option" value="svg">SVG (original)</option>
                        <option class="savgy__toolbar__option" value="svg_self">SVG (self-contained)</option>
                    </select>
                </div>
            </div>

            <div class="savgy__toolbar__row">
                <div class="savgy__toolbar__col">
                    <select class="savgy__toolbar__select savgy__toolbar__select--format--img">
                        <option class="savgy__toolbar__option" value="original">SVG img format </option>
                        <option class="savgy__toolbar__option" value="png">PNG </option>
                        <option class="savgy__toolbar__option" value="webp">WebP </option>
                        <option class="savgy__toolbar__option" value="jpg">Jpeg </option>
                    </select>
                </div>
            </div>


            <div class="savgy__toolbar__row">
                <div class="savgy__toolbar__col">
                    <label class="savgy__toolbar__label savgy__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savgy__toolbar__check savgy__toolbar__check--preview">
                        Show Preview
                    </label>
                    <label class="savgy__toolbar__label savgy__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savgy__toolbar__check savgy__toolbar__check--intrinsic">
                        Intrinsic width/height
                    </label>
                    <label class="savgy__toolbar__label savgy__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savgy__toolbar__check savgy__toolbar__check--crop">
                        Crop to content
                    </label>
                    <label class="savgy__toolbar__label savgy__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savgy__toolbar__check savgy__toolbar__check--flatten">
                        Flatten transparency
                    </label>
                    <label class="savgy__toolbar__label savgy__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savgy__toolbar__check savgy__toolbar__check--scaleImg">
                        Scale SVG images
                    </label>


                </div>
            </div>


        </div>

        <div class="savgy__toolbar__row savgy__toolbar__row--2">
            <div class="savgy__toolbar__col">
                <button type="button" class="savgy__button savgy__toolbar__button savgy__toolbar__button--copy"><span class="savgy__toolbar__button--save--download icn-svg savgy__icon">${icons.copy} </span> Copy</button>
            </div>
            <div class="savgy__toolbar__col">
                <button type="button" class="savgy__button--ready    savgy__button  savgy__toolbar__button savgy__toolbar__button--save"><span class="savgy__toolbar__button--save--download icn-svg savgy__icon savgy__icon--download">${icons.download} </span> <span class="savgy__toolbar__button--save--download icn-svg savgy__icon savgy__icon--spinner">${icons.spinner} </span> Save file</button>
                <a class="savgy__toolbar__a savgy__toolbar__button--a savgy__hidden" href="" download=""></a>
            </div>
        </div>
        <div class="saveg__filesize__wrp">
            <p class="saveg__filesize">Filesize: 0 KB</p>
        </div>


    </div>

    <div class="savgy__toolbar__toggle">
        <label class="savgy__toolbar__toggle__label">
            <span class="savgy__toolbar__toggle__icon savgy__toolbar__toggle__icon--download  savgy__icon savgy__icon--download">${icons.download}</span>
            <span class=" savgy__toolbar__toggle__icon savgy__toolbar__toggle__icon--close savgy__icon savgy__icon--close">${icons.close}</span>
            <input class="savgy__toolbar__toggle__input savgy__hidden" type="checkbox" value="1">
        </label>
    </div>
</div>
`;

    let toolbar = new DOMParser().parseFromString(toolbarMarkup, 'text/html').querySelector('div');

    let inpW = toolbar.querySelector('.savgy__toolbar__input--w');
    let inpH = toolbar.querySelector('.savgy__toolbar__input--h');
    let inpQ = toolbar.querySelector('.savgy__toolbar__input--quality');
    let inpF = toolbar.querySelector('.savgy__toolbar__select--format');
    let inpPreview = toolbar.querySelector('.savgy__toolbar__check--preview');
    //preferred format for images in SVG
    let inpFSVG = toolbar.querySelector('.savgy__toolbar__select--format--img');

    let btnCopy = toolbar.querySelector('.savgy__toolbar__button--copy');
    let btnSave = toolbar.querySelector('.savgy__toolbar__button--save');
    let linkFile = toolbar.querySelector('.savgy__toolbar__button--a');
    let inputToggleLabel = toolbar.querySelector('.savgy__toolbar__toggle__label');
    let inputToggle = toolbar.querySelector('.savgy__toolbar__toggle__input');
    let inputIntrinsic = toolbar.querySelector('.savgy__toolbar__check--intrinsic');
    let inputCrop = toolbar.querySelector('.savgy__toolbar__check--crop');
    let inputFlatten = toolbar.querySelector('.savgy__toolbar__check--flatten');
    let inputScaleImages = toolbar.querySelector('.savgy__toolbar__check--scaleImg');

    let selectSVGIMGFormat = toolbar.querySelector('.savgy__toolbar__select--format--img');
    let pFilesize = toolbar.querySelector('.saveg__filesize');


    return { toolbar, inpW, inpH, inpQ, inpF, inpFSVG, btnCopy, btnSave, linkFile, inpPreview, inputToggleLabel, inputToggle, inputIntrinsic, inputCrop, selectSVGIMGFormat, pFilesize, inputFlatten, inputScaleImages }

}

/**
 * create blob from
 * data URL
 */
function dataURLToBlob(dataUrl) {
    // Check if the data URL is valid
    if (!dataUrl.startsWith('data:')) {
        throw new Error('Invalid data URL format');
    }

    // Split into metadata and data parts
    const [metaPart, dataPart] = dataUrl.split(',');
    if (!metaPart || !dataPart) {
        throw new Error('Invalid data URL format');
    }

    // Extract MIME type (handle cases like `charset=utf8`)
    const mimeMatch = metaPart.match(/^data:([^;]+)/);
    const mimeString = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

    let byteString;
    if (metaPart.includes('base64')) {
        // Handle base64-encoded data
        byteString = atob(dataPart);
    } else {
        // Handle URL-encoded data (e.g., SVG with %3C, %20, etc.)
        byteString = decodeURIComponent(dataPart);
    }

    // Convert to ArrayBuffer → Blob
    const buffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([buffer], { type: mimeString });
}


/**
 * convert blob to 
 * base64 data URL
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(blob);
    });
}

/**
 * inline references for patterns, masks, 
 * clipaths etc
 */

function inlineRefs(svg, assetCache={}) {
    let els = svg.querySelectorAll('path, polyline, polygon, rect, circle, ellipse, line, text, tspan');
    //attributes that may reference an external asset e.g a gradient, pattern, mask etc
    let props = ['fill', 'stroke', 'clip-path', 'mask', 'href', 'xlink:href'];

    // create defs elements
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(ns, 'defs');
        svg.insertBefore(defs, svg.children[0]);
    }


    for (let i = 0; i < els.length; i++) {
        let el = els[i];

        let styles = window.getComputedStyle(el);
        let refID, refEl, refEl_clone;

        for (let p = 0; p < props.length; p++) {
            let prop = props[p];
            let att = el.getAttribute(prop);
            let value = att ? att : styles.getPropertyValue(prop);
            let isHref = prop === 'href' || prop === 'xlink:href' ? true : false;

            /**
             * check props to find
             * patterns, gradients, masks etc
             */
            if (value.includes('url') || isHref) {

                //url = getUrls(value)
                refID = isHref ? value.substring(1) : getUrls(value).substring(1);
                //console.log('has ref', prop, url, refID);

                refEl = refID ? svg.getElementById(refID) : null;
                // already present in svg
                if (refEl) {
                    //console.log('exists');
                    continue;
                }

                // not in parent SVG - copy
                refEl = refID ? document.getElementById(refID) : null;
                if (refEl) {
                    refEl_clone = refEl.cloneNode(true);
                    //svg.insertBefore(refEl_clone, svg.children[0]);
                    defs.append(refEl_clone);
                }
            }
        }
    }

    function getUrls(str) {
        let regex = /url\((['"]?)([^'"()]+)\1\)/gi;
        let match = str.match(regex) ? str.match(regex)[0].split(/\(|\)/)[1].replace(/"|'/g, '') : '';
        return match
    }

}



async function inlineUseRefs(svg, assetCache = {}) {

    let useEls = svg.querySelectorAll('use');
    if (!useEls.length) return;

    const ns = "http://www.w3.org/2000/svg";
    const nsXlink = "http://www.w3.org/1999/xlink";

    // create defs elements
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(ns, 'defs');
        svg.insertBefore(defs, svg.children[0]);
    }


    for (let i = 0; i < useEls.length; i++) {
        let use = useEls[i];
        let href = use.getAttributeNS(nsXlink, 'href') ? use.getAttributeNS(nsXlink, 'href') : use.getAttribute('href');

        // xlink sucks - we normalize it to href
        use.removeAttribute('xlink:href');


        // find external use references
        let hrefArr = href.split('#').filter(Boolean);
        let [url, id] = hrefArr;

        let isExternal = hrefArr.length > 1;
        let inlineRef, inlineDef, defId;

        // use definition is in document
        let inlinedSymbol = document.getElementById(hrefArr[0]);
        if (inlinedSymbol) {
            inlineDef = inlinedSymbol.cloneNode(true);
            //svg.insertBefore(inlineDef, svg.children[0]);
            defs.append(inlineDef);
            inlineRef = `#${hrefArr[0]}`;
            use.setAttribute('href', inlineRef);
        }

        // fetch external ref
        else if (isExternal) {
            let spriteName = url.replace(/\./g, '_');

            // is cached
            if (assetCache[url] && assetCache[url][id]) {
                //console.log('is cached', id);
                inlineDef = assetCache[url][id].cloneNode(true);
            } else {

                // fetch and cache
                let res = await fetch(url);
                if (res.ok) {

                    let spriteMarkup = await res.text();
                    let sprite = new DOMParser().parseFromString(spriteMarkup, 'text/html').querySelector('svg');
                    let symbol = sprite.getElementById(id);

                    // cache
                    assetCache[url] = {};
                    assetCache[url][id] = symbol;
                    inlineDef = symbol.cloneNode(true);
                }
            }

            defId = `${spriteName}_${id}`;
            inlineDef.id = defId;

            // add to svg if not already done
            if (!svg.getElementById(defId)) {
                //svg.insertBefore(inlineDef, svg.children[0]);
                defs.append(inlineDef);
            }

            // new reference
            use.setAttribute('href', `#${defId}`);
        }
        //console.log(assetCache);
    }

}

async function optimizeSVGImgs(svgClone, assetCache = {}, addGlobalStyles = true, width = null, height = null, format = 'original', quality = 1, scaleImages = true, bgColor='transparent') {


    let svgOpt = svgClone.cloneNode(true);
    let images = svgOpt.querySelectorAll("image, img");
    let nsXlink = "http://www.w3.org/1999/xlink";

    if (!images.length || format === 'original') return svgOpt;

    // normalize format identifiers
    //console.log('format', format, assetCache);
    format = format ? format.replace(/image\//g, '').replace(/jpg/g, 'jpeg') : 'original';


    await Promise.all([...images].map(async (img) => {
        let type = img.nodeName.toLowerCase();
        let src = img.getAttributeNS(nsXlink, "href")
            ? img.getAttributeNS(nsXlink, "href")
            : (type === 'image' ? img.getAttribute("href") : img.getAttribute("src"));

        // all image src are already base64
        let base64 = src;

        /**
         * convert to other format
         * helps to optimize size for 
         * self-contained SVGs
         */
        if (format !== 'original') {

            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            let imgTmp = new Image();
            imgTmp.crossOrigin = "anonymous";
            imgTmp.src = base64;

            // wait for image decoding
            await imgTmp.decode();

            // intrinsic dimensions
            let [width, height] = [imgTmp.naturalWidth, imgTmp.naturalHeight];

            // element dimension
            let [w, h] = [+img.getAttribute('width') || width, +img.getAttribute('height') || height];

            // scale down to layout size
            if (scaleImages) [width, height] = [w, h];


            imgTmp.width = width;
            imgTmp.height = height;
            canvas.width = width;
            canvas.height = height;

            // add white background for jpegs to flatten transparency
            if (format === 'jpeg') {
                let svgBG = window.getComputedStyle(svgOpt).backgroundColor;
                if ((svgBG === 'rgba(0, 0, 0, 0)' || svgBG !== 'transparent')) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);
                }
            }

            await ctx.drawImage(imgTmp, 0, 0, width, height);

            base64 = canvas.toDataURL(`image/${format}`, quality);
            canvas.remove();
        }


        if (type === 'image') {
            img.setAttribute("href", base64);
        } else {
            img.setAttribute("src", base64);
        }

    }));


    //console.log('svgOpt', svgOpt);

    return svgOpt;

}



/**
 * inline external
 * image sources
 */

async function inlineImages(svg, assetCache = {}) {

    let images = svg.querySelectorAll("image, img");
    let nsXlink = "http://www.w3.org/1999/xlink";


    await Promise.all([...images].map(async (img) => {
        let type = img.nodeName.toLowerCase();
        let src = img.getAttributeNS(nsXlink, "href")
            ? img.getAttributeNS(nsXlink, "href")
            : (type === 'image' ? img.getAttribute("href") : img.getAttribute("src"));

        let base64;

        // use cache
        if (assetCache.images[src]) {
            //console.log('is cached!', src);
            base64 = assetCache.images[src];
        } else {

            // check if src is already data URL
            if (src.startsWith('data:')) {
                //cache_key = `${src}_original_1`;
                base64 = src;
            } else {
                let blob = await (await fetch(src)).blob();
                base64 = await blobToBase64(blob);

                // add to cache
                assetCache.images[src] = base64;
            }
        }

        if (type === 'image') {
            img.setAttribute("href", base64);
        } else {
            img.setAttribute("src", base64);
        }
    }));

}




async function svg2Canvas2DataUrl(svg, width = null, height = null, format = 'png', quality = '1', bgColor='transparent', flattenTransparency=false, canvas = null) {

    let isString = typeof svg === 'string';
    let noDimensions = !width || !height;
    let nsAtt = 'xmlns="http://www.w3.org/2000/svg"';
    let hasNS = isString ? svg.includes(nsAtt) : svg.getAttribute('xmlns');

    if (!hasNS && isString) {
        svg = svg.replace('<svg ', `<svg ${nsAtt} `);
    }

    // Detect dimensions if not specified
    if (noDimensions) {

        // parse to retrieve width/height and viewBox
        if (isString) {
            svg = new DOMParser().parseFromString(svg, 'text/html').querySelector('svg');

            let viewBox = svg.getAttribute('viewBox') || '0 0 300 150';
            let [, , w, h] = viewBox.split(/,| /);

            [width, height] = +svg.getAttribute("width") && +svg.getAttribute("height") ?
                [svg.width, svg.height]
                : [w, h];

            // force serializing to add missing namespace
            isString = false;

        }

        // set explicit svg dimensions for better compatibility
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);

    }



    let svgMarkup = isString ? svg : new XMLSerializer().serializeToString(svg);
    let dataUrl = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgMarkup);

    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUrl;
    img.width = width;
    img.height = height;

    /**
     * create canvas
     * if not existent
     */
    if (!canvas) {
        canvas = document.createElement("canvas");
    }
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");

    // normalize format identifiers
    format = format.replace(/image\//g, '').replace(/jpg/g, 'jpeg');

    // add white background for jpegs to flatten transparency
    if (format === 'jpeg' || flattenTransparency) {

        //console.log('flatten', flattenTransparency);
        bgColor = bgColor!=='transparent' ? bgColor : '#fff';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    }

    //wait for image to decode
    await img.decode();
    await ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL(`image/${format}`, quality);

}

/**
 * convert all external font references to
 * inlined base64 encoded dataURLs
 */

async function externalFontsToBase64(css, assetCache = {}) {
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



/**
 * collect all fonts and characters
 * required for SVG rendering
 * used to remove unnecessary font-face rules
 * and apply google font API subsetting if possible
 */

function analizeSVGText(svg) {

    // collect used fonts
    let usedFonts = {};

    // collect subset strings for families
    let familyStrings = {};


    // query text elements
    let textEls = svg.querySelectorAll('text, tspan, textPath, foreignObject *');

    let allText = [... new Set([...[...textEls].map(el => el.textContent).join('').split('')])].join('');

    // if no text elements are present
    if (!textEls.length) return usedFonts;


    for (let i = 0, len = textEls.length; len && i < len; i++) {
        let text = textEls[i];

        //check if element has any text nodes
        let textNodes = [...text.childNodes].filter(node => node.nodeType === 3 && node.textContent.trim());
        if (!textNodes.length) continue;

        let style = window.getComputedStyle(text);
        let [fontFamily, fontWeight, fontStyle, fontStretch] = [style.getPropertyValue('font-family'), style.getPropertyValue('font-weight'), style.getPropertyValue('font-style'), style.getPropertyValue('font-stretch')||'100'];

        fontFamily = fontFamily.replace(/"|'| |%/g, '');

        // subset string
        let subsetChars = textNodes.map(node => node.textContent).join('').trim();
        let charsUnique = [...new Set([...subsetChars.split('')])].join('').replaceAll('\n', '');

        // check unicode range/language
        let language = detectLanguageSet(unicodeRangeFromString(charsUnique));
        // change PUA to latin for icon fonts
        if (language === 'PUA') language = 'latin';

        // create unique key for font style
        let key = [fontFamily, fontWeight, fontStyle, fontStretch, language].join('_').replace(/"|'| |%/g, '');

        if (!usedFonts[key]) {
            usedFonts[key] = [];
        }

        if (!familyStrings[fontFamily]) {
            familyStrings[fontFamily] = [];
        }
        familyStrings[fontFamily].push(charsUnique);

    }

    //flatten substring array
    for (let family in usedFonts) {
        let familyName = family.split('_')[0];
        usedFonts[family] = [...new Set(familyStrings[familyName].join('').split(''))].join('');
    }

    usedFonts.allText = allText;
    return usedFonts;

}


/**
 * detect unnecessary 
 * font face rules
 */
function checkFontCoverage(sheet, svgFontInfo = {}, isGoogleFont = false, subsets = [], subset = '', hasMulti = false, availableFonts={}) {
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


            let font_key = [fontFamily, fontWeight[0], fontStyle, fontStretch[0], subsetCurrent].join('_').replace(/"|'| /g, '').trim();
            let isVF = fontWeight.length > 1 || fontStretch.length > 1 ? true : false;


            if (isVF) {
                for (let key in svgFontInfo) {
                    if (key !== 'allText') {
                        let [family, weight, style, stretch, subset] = key.split('_');
                        if (family === fontFamily &&
                            style === fontStyle &&
                            (+weight >= fontWeight[0]) &&
                            (+stretch >= fontStretch[0]) &&
                            (subset === subsetCurrent)
                        ) {
                            if (isGoogleFont) fontsToSubset.push(font_key);
                        }
                    }
                }
            }

            // exact static match
            else if (svgFontInfo[font_key]) {
                //console.log('has font subset', font_key);
                if (isGoogleFont) fontsToSubset.push(font_key);
            }

            // no match try to adjust non existent weights or widths
            else {
                exclude.push(i);
            }
        }
    }
    return { fontsToSubset, exclude }
}


/**
 * colllect all style info from 
 * current stylesheet
 */
function checkAvailableFonts(sheet, subsets = [], subset = '') {

    let fontDataLoaded = {};

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
                fontDataLoaded[fontFamily] = { weights: new Set([]), widths: new Set([]), styles: new Set([]), isVF: false, subsets: new Set([]), keys: new Set() };
            }

            // normalize weights and widths string literals            
            fontWeight = fontWeight.split(' ').map(val => convertFontValues(val, 'weight'));
            fontStretch = fontStretch.split(' ').map(val => convertFontValues(val, 'stretch')).filter(Boolean);

            let isVF = fontWeight.length > 1 || fontStretch.length > 1 ? true : false;

            // add weights
            fontWeight.forEach(wght => fontDataLoaded[fontFamily].weights.add(wght));
            fontStretch.forEach(wdth => fontDataLoaded[fontFamily].widths.add(wdth));
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

function updateFontInfo(availableFonts, svgFontInfo) {

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

                    let weights = [...fontItem.weights];
                    let weightMin = Math.min(...weights);
                    let weightMax = Math.max(...weights);
                    //console.log('fontItem match:', family, weight, weightMin, weightMax, fontItem);

                    // too bold
                    if (weight > weightMax) {
                        //console.log('too bold', family, weight);
                        weightNew = weightMax;
                    }

                    // too light
                    if (weight < weightMin) {
                        //console.log('too light', family, weight);
                        weightNew = weightMin;
                    }
                }


                // 2. check stretch
                if (!fontItem.widths.has(stretch)) {

                    let widths = [...fontItem.widths];
                    let widthMin = Math.min(...widths);
                    let widthMax = Math.max(...widths);

                    // too condensed
                    if (stretch < widthMin) {
                        //console.log('too condensed', family, weight);
                        stretchNew = widthMin;
                    }

                    // too expanded
                    if (stretch > widthMax) {
                        //console.log('too expanded', family, weight);
                        stretchNew = widthMax;
                    }
                }

                //update
                if(weightNew!=weight || stretchNew!==stretch){
                    let keyNew = [family, weightNew, style, stretchNew, subset].join('_');
                    svgFontInfo[keyNew] = svgFontInfo[key];

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
function convertFontValues(value, type = 'weight') {
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

}




/**
 * detect unicode range
 */

function detectLanguageSet(unicodeRangeStr) {
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

function toUnicodeRange(codePoints) {
    //alert('oi')
    // Sort code points in ascending order
    codePoints.sort((a, b) => a - b);

    // Helper to format a single code point as U+XXXX
    let formatCodePoint = (point, addPrefix = true) => {
        let prefix = addPrefix ? 'U+' : '';
        return prefix + point.toString(16).toUpperCase().padStart(4, '0');
    };

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


function unicodeRangeFromString(str) {
    let chars = [... new Set(str.split('').filter(Boolean))];
    let codePoints = chars.map(char => { return char.charCodeAt(0) });
    let range = toUnicodeRange(codePoints);
    return range
}

/**
 * inline global stylesheets for 
 * self-contained SVG
 */

async function inlineGlobalStyles(svg, svgFontInfo = {}, assetCache = {}) {
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
 * find all imports
 * "hidden" in external stylesheets or
 * defined in style elements
 */

function getAllImportRules() {
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
async function importRulesToLink(importRules=[]) {

    for(let i=0,l=importRules.length; l&& i<l; i++){
        //let imp = importRules[i];
        let href = importRules[i];

        let link = document.createElement('link');
        link.href = href;
        link.rel = "stylesheet";
        link.classList.add('internalCSS');

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

function relativeToAbsoluteUrls(css, url) {

    const urlRegex = /url\(\s*['"]?(.*?)['"]?\s*\)/g;
    let urls = css.match(urlRegex);

    if (!urls) return css;

    // exclude ie crap fonts
    urls = urls.filter(url => !url.includes('.eot'));

    let baseUrl = url;
    let pathArr = url.split('/');

    urls.forEach(url => {

        url = url.split(/\(|\)/)[1].replace(/"|'/g, '');
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
            let index = -1 - traverse;
            let fontPath = dirs.slice(-1)[0];
            baseUrl = pathArr.slice(0, index).join('/') + '/';
            urlAbs = baseUrl + fontPath;
        }
        else if (relativeDir) {
            urlAbs = url.replaceAll('./', baseUrl);
        }

        css = css.replaceAll(url, urlAbs);
    });

    //console.log(css);
    return css;
}

async function svg2bitmap(svg, {
    addGlobalStyles = true,
    format = 'original',
    formatSVG = 'original',
    quality = 0.9,
    scaleImages = false,
    addToolbar = true,
    showPreview = false,
    crop = false,
    useIntrinsic = false,
    flattenTransparency = false,
    bgColor = 'transparent'

} = {}) {


    let dataUrl, dataUrlSVG, width, height, toolbar, inpW, inpH, inpQ, inpF, btnCopy, btnSave, linkFile, inpPreview, inpFSVG, inputToggle, inputIntrinsic, inputCrop, selectSVGIMGFormat, pFilesize, inputFlatten, inputScaleImages;

    let hasSelfContainedSVG = false;

    /**
     * if is image
     */
    let isString = typeof svg === 'string';
    let isElement = !isString ? svg instanceof HTMLElement || svg instanceof SVGElement : false;
    let isImg = isElement ? svg.nodeName.toLowerCase() === 'img' : false;
    let imgEl = isImg ? svg : svg;

    if(isImg){
        //imgEl.classList.add('savgy__hidden');
        let res = await fetch(svg.src);
        if(res.ok){
            svg = await res.text() ;
            addGlobalStyles = false;
            hasSelfContainedSVG = true;
        }
    }


    /**
     * if input is SVG markup parse
     * if element continue processing
     */
    let isSVGString = svg.nodeType ? false : true;

    // take only styles in SVG
    if (isSVGString) addGlobalStyles = false;

    // normalize string or node input
    svg = !isSVGString ? svg : new DOMParser().parseFromString(svg, "text/html").querySelector("svg");
    //console.log('isElement', isElement, isImg, addGlobalStyles, hasSelfContainedSVG);



    let savgyWrap = document.createElement('div');

    // clone and append
    let svgClone = svg.cloneNode(true);
    //console.log('svgClone', svgClone);

    //svgClone.id='';
    svgClone.classList.add('savgy_clone', 'savgy__hidden');
    let previewImg;


    /**
     * add toolbar UI
     */
    if (addToolbar) {


        // add toolbar stylesheet
        await addStyles('savgy', true);


        savgyWrap.classList.add('savgy__wrap');
        //document.body.insertBefore(savgyWrap, svg);
        document.body.insertBefore(savgyWrap, imgEl);

        // preview img
        previewImg = document.createElement('img');
        previewImg.classList.add('savgy__preview', 'savgy__preview--hidden');


        // toolbar
        ({ toolbar, inpW, inpH, inpQ, inpF, btnCopy, btnSave, linkFile, inpFSVG, inpPreview, inputToggle, inputIntrinsic, inputCrop, selectSVGIMGFormat, pFilesize, inputFlatten, inputScaleImages } = getToolbar(icons));

        //console.log(toolbar);
        //savgyWrap.append(svg, svgClone, previewImg, toolbar);
        savgyWrap.append(imgEl, svgClone, previewImg, toolbar);

    } else {
        savgyWrap.style = 'position:relative; height:0px; overflow:hidden; opacity:0';
        savgyWrap.append(svgClone);
        document.body.append(savgyWrap);
    }

    /**
     * get  rendered background color
     * for JPG transparency flattening
     */
    bgColor = bgColor !== 'transparent' ? bgColor : getVisualBackgroundColor(svgClone);


    /**
     * get dimensions of svg
     * either from viewBox or
     * width/height attributes
     */
    let viewBoxAtt = svgClone.getAttribute('viewBox');
    let viewBox = viewBoxAtt ? viewBoxAtt.split(/,| /).filter(Boolean).map(Number) : [0, 0, 300, 150];

    [width, height] = svgClone.getAttribute("width") && svgClone.getAttribute("height") ?
        [+svgClone.width, +svgClone.height] :
        [viewBox[2], viewBox[3]];


    let [widthInt, heightInt] = [width, height];

    let scale = 1;
    let bb;

    // get size from DOM element
    if (!isSVGString) {
        bb = svgClone.getBoundingClientRect();
        scale = bb.width / width;
        //let [width, height] = [bb.width, bb.height];
    }

    [width, height] = [width * scale, height * scale];
    let [widthCavnvas, heightCanvas] = [width, height];

    let svgBB = svgClone.getBBox();
    let [x, y, widthCrop, heightCrop] = [svgBB.x, svgBB.y, svgBB.width, svgBB.height];


    /**
     * toolbar inputs
     */

    let aspect = width / height;

    // round to integers
    [width, height] = [width, height].map(val => +(val).toFixed(0));


    if (toolbar) {


        // set default widths
        inpW.value = width;
        inpH.value = height;
        inpQ.value = quality;
        inpF.value = format ? format : 'png';

        let inputs = [inpW, inpH, inpQ, inpF, inpFSVG, inputCrop, inputIntrinsic, inpPreview, inputFlatten, inputScaleImages];


        inputToggle.addEventListener('click', async (e) => {

            // set open class
            toolbar.classList.toggle('savgy__toolbar--open');

            // get selfcontained svg on menu open
            //if (!hasSelfContainedSVG) svgClone = await getSelfcontainedSVG(svgClone, assetCache, addGlobalStyles);
            hasSelfContainedSVG = true;
        });


        // Store references to relevant inputs
        const dimensionInputs = [inpW, inpH];
        const checkboxInputs = [inputCrop, inputIntrinsic];

        // Combined event listener for both input fields and checkboxes
        [...inputs, ...checkboxInputs].forEach(inp => {
            inp.addEventListener('input', async (e) => {
                //console.log('Event triggered by:', e.currentTarget.id || e.currentTarget.name);

                const current = e.currentTarget;
                let newWidth = +inpW.value;
                let newHeight = +inpH.value;

                // Handle dimension inputs (width/height)
                if (dimensionInputs.includes(current)) {
                    if (current === inpW) {
                        newHeight = Math.round(newWidth / aspect);
                    }
                    else if (current === inpH) {
                        newWidth = Math.round(newHeight * aspect);
                    }
                    //console.log('Dimension input changed', newWidth, newHeight);
                }
                // Handle checkbox changes (crop/intrinsic)
                else if (checkboxInputs.includes(current)) {
                    //console.log('Checkbox changed:', current.id || current.name);
                    // When crop/intrinsic changes, use those dimensions
                    const scaleCanvas = inputIntrinsic.checked ? 1 : scale;

                    if (inputCrop.checked) {
                        [newWidth, newHeight] = [widthCrop * scaleCanvas, heightCrop * scaleCanvas];
                    } else if (inputIntrinsic.checked) {
                        [newWidth, newHeight] = [widthInt * scaleCanvas, heightInt * scaleCanvas];
                    }
                }

                // Update input fields if values changed
                //console.log('dim', newWidth, +inpW.value);

                if (newWidth !== +inpW.value) {
                    inpW.value = newWidth;
                }
                if (newHeight !== +inpH.value) {
                    inpH.value = newHeight;
                }

                // disable intrinsic
                if (newWidth != widthInt || newHeight != heightInt) {
                    useIntrinsic = false;
                    inputIntrinsic.checked = false;
                }


                // Update state variables
                width = +inpW.value;
                height = +inpH.value;
                quality = +inpQ.value;
                format = inpF.value;
                formatSVG = inpFSVG.value;
                crop = inputCrop.checked;
                useIntrinsic = inputIntrinsic.checked;
                showPreview = inpPreview.checked;
                flattenTransparency = inputFlatten.checked;
                scaleImages = inputScaleImages.checked;


                let scaleCanvas = useIntrinsic ? 1 : scale;
                let [widthCanvas, heightCanvas] = useIntrinsic
                    ? [widthInt * scaleCanvas, heightInt * scaleCanvas]
                    : [width, height];


                // Toggle SVG format UI
                selectSVGIMGFormat.classList.toggle(
                    'savgy__toolbar__select--format--img--active',
                    format === 'svg_self'
                );



                // adjust viewBox for cropped images
                if (crop) {
                    [widthCanvas, heightCanvas] = [widthCrop * scaleCanvas, heightCrop * scaleCanvas];
                    svgClone.setAttribute('viewBox', [x, y, widthCrop, heightCrop].join(' '));
                }
                // revert viewBox
                else {
                    svgClone.setAttribute('viewBox', viewBox.join(' '));
                }


                // Round to integers
                [widthCanvas, heightCanvas] = [widthCanvas, heightCanvas].map(val => Math.ceil(val));

                // Update preview if needed
                if (showPreview) {
                    if(isImg) imgEl.style.visibility = 'hidden';
                    previewImg.classList.replace('savgy__preview--hidden', 'savgy__preview--visible');

                    ({ dataUrl, dataUrlSVG } = await updateOutput(
                        svg, svgClone, assetCache, addGlobalStyles,
                        formatSVG, widthCanvas, heightCanvas,
                        format, quality, scaleImages, bgColor, flattenTransparency
                    ));

                    previewImg.src = dataUrl;

                    if (dataUrl) {
                        let blob = dataURLToBlob(dataUrl);
                        pFilesize.textContent = 'Filesize: ~' + (+(blob.size / 1024).toFixed(2)) + ' KB';
                    }
                } else {
                    if(isImg) imgEl.style.visibility = 'visible';
                    previewImg.classList.replace('savgy__preview--visible', 'savgy__preview--hidden');
                }
            });
        });

        /**
         * copy
         */
        btnCopy.addEventListener('click', async (e) => {

            let copyText;
            btnCopy.classList.add('savgy--copying');

            if (format === 'svg') {
                copyText = new XMLSerializer().serializeToString(svg);
            }
            else if (format === 'svg_self') {
                copyText = new XMLSerializer().serializeToString(svgClone);
            }

            // bitmap format
            else {
                if (!dataUrl) {
                    dataUrl = await svg2Canvas2DataUrl(svgClone, width, height, format, quality, bgColor, flattenTransparency);
                }
                copyText = dataUrl;
            }

            navigator.clipboard.writeText(copyText);
            btnCopy.classList.remove('savgy--copying');

        });

        /**
         * save to file
         */
        btnSave.addEventListener('click', async (e) => {

            btnSave.classList.replace('savgy__button--ready', 'savgy__button--loading');

            // generate dataURL if not already done due to active preview
            if (!showPreview) {
                ({ dataUrl, dataUrlSVG } = await updateOutput(svg, svgClone, assetCache, addGlobalStyles, formatSVG, widthCavnvas, heightCanvas, format, quality, scaleImages, bgColor, flattenTransparency));
            }


            // get filename from svg id
            let fileName = svgClone.id ? svgClone.id : 'savgy';
            let ext = format.replace('image/', '').replace('jpeg', 'jpg').replace('svg_self', 'svg');


            // set download link
            linkFile.download = `${fileName}.${ext}`;
            linkFile.href = dataUrl;
            linkFile.click();

            btnSave.classList.replace('savgy__button--loading', 'savgy__button--ready');

        });


        /**
         * check if toolbar is hidden
         * switch to bottom alignment
         */

        let toolbarTop = 0;

        window.addEventListener('resize', e => {
            toolbarTop = toolbar.getBoundingClientRect().top;
            console.log('toolbarTop', toolbarTop);

            if (toolbarTop < 0) {
                toolbar.classList.add('savgy__toolbar--bottom');

            } else {
                toolbar.classList.remove('savgy__toolbar--bottom');
            }
        });

        window.addEventListener('DOMContentLoaded', e => {
            toolbarTop = toolbar.getBoundingClientRect().top;
            console.log('toolbarTop', toolbar, toolbarTop, toolbar.getBoundingClientRect());
            if (toolbarTop < 0) toolbar.classList.add('savgy__toolbar--bottom');
        });


    }

    // generate image directly
    else {
        if (!hasSelfContainedSVG) svgClone = await getSelfcontainedSVG(svgClone, assetCache, addGlobalStyles);
        hasSelfContainedSVG = true;

        ({ dataUrl, dataUrlSVG } = await updateOutput(svg, svgClone, assetCache, addGlobalStyles, formatSVG, width, height, format, quality, scaleImages, bgColor, flattenTransparency));
    }

    return { bmp: dataUrl, svg: dataUrlSVG }

}



async function updateOutput(svg, svgClone, assetCache, addGlobalStyles, formatSVG, width, height, format, quality, scaleImages, bgColor = '#fff', flattenTransparency = false) {

    //console.log('formatSVG', formatSVG, width, height, 'format', format, quality, scaleImages);

    let dataUrl, dataUrlSVG;

    /**
     * minify SVG
     */

    // original SVG
    if (format === 'svg') {
        dataUrl = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
        dataUrlSVG = dataUrl;
    }
    else if (format === 'svg_self') {
        let svgOpt = await optimizeSVGImgs(svgClone, assetCache, addGlobalStyles, width, height, formatSVG, quality, scaleImages);
        dataUrl = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(new XMLSerializer().serializeToString(svgOpt));
        dataUrlSVG = dataUrl;
    }


    // bitmap format
    else {

        dataUrl = await svg2Canvas2DataUrl(svgClone, width, height, format, quality, bgColor, flattenTransparency);
    }

    return { dataUrl, dataUrlSVG }
}





async function getSelfcontainedSVG(svg, assetCache = {}, addGlobalStyles = true, format = 'original', quality = 1, scaleImages = false) {


    // Helper function to generate checksum
    async function generateChecksum(str) {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    let cache_key = await generateChecksum(svg);

    // is cached
    if (assetCache.svg[cache_key]) return assetCache.svg[cache_key];

    // final inlined CSS
    let css = '';


    /**
     * inline use refs
     */
    await inlineUseRefs(svg, assetCache);


    /**
     * search for masks, 
     * clip-paths, gradients, patterns etc.
     */
    inlineRefs(svg, assetCache);


    /**
     * inline external
     * image sources
     */
    format = 'original';
    quality = 1;
    scaleImages = false;
    await inlineImages(svg, assetCache);

    /**
     * check required font ranges
     */
    let svgFontInfo = analizeSVGText(svg);
    //console.log('svgFontInfo', svgFontInfo);


    /**
     * global CSS
     * inline external stylesheets
     * an import rules
     */

    if (addGlobalStyles) {

        let importRules = getAllImportRules();
        //console.log('importRules', importRules);

        /**
         * normalize imports
         * convert to link elements
         */
        await importRulesToLink(importRules);
        //await document.fonts.ready;

        if (addGlobalStyles) {
            css += await inlineGlobalStyles(svg, svgFontInfo, assetCache);
        }
    }


    /**
     * inline css
     */
    let cssEl = svg.querySelector('style');
    css += cssEl.textContent;


    /**
     * replace external font 
     * references with base64
     */
    css = await externalFontsToBase64(css, assetCache);
    //console.log('css', css);

    // update self-contained css
    cssEl.textContent = css;

    // add to cache
    //assetCache.svg[cache_key] = new XMLSerializer().serializeToString(svg);
    assetCache.svg[cache_key] = svg;

    //console.log('assetCache', assetCache);
    return svg;

}


/**
 * Gets the visual background color of an element by checking its own background
 * and traversing parent elements until a defined background is found.
 */
function getVisualBackgroundColor(element) {
    // Check if element is valid


    if (!element instanceof HTMLElement && !element instanceof SVGElement) {
        return 'white';
    }

    // Function to parse color values
    function parseColor(color) {
        // Check for transparent/undefined colors
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
            return null;
        }
        return color;
    }

    // Traverse up the DOM tree
    let currentElement = element;
    while (currentElement) {
        // Get computed style
        const computedStyle = window.getComputedStyle(currentElement);
        const bgColor = computedStyle.backgroundColor;

        // Check if background color is defined and not transparent
        const parsedColor = parseColor(bgColor);
        if (parsedColor) {
            return parsedColor;
        }

        // Move to parent element, stop at body
        if (currentElement === document.body) {
            break;
        }
        currentElement = currentElement.parentElement;
    }

    // Default to white if no background color found
    return '#fff';
}




async function addStyles(styleName = 'styles', addDist = false) {

    const getCurrentScriptUrl = () => {
        try {

            /** 1. try performance API */
            let urlPerf = performance.getEntries()
                .slice(1)[0].name.split('/')
                .slice(0, -1)
                .join('/');

            //if(urlPerf) return urlPerf;

            /** 2. try error API */
            let stackLines = new Error().stack.split('\n');
            let relevantLine = stackLines[1] || stackLines[2];
            if (!relevantLine) return null;

            // Extract URL using a more comprehensive regex
            let urlError = relevantLine.match(/(https?:\/\/[^\s]+)/)[1]
                .split('/')
                .slice(0, -1)
                .join('/');

            return urlError;

        } catch (e) {
            console.warn("Could not retrieve script path", e);
            return null;
        }
    };


    let scriptPath = getCurrentScriptUrl();

    // dist path is excluded in modules
    if (!scriptPath.includes('dist') && addDist) scriptPath += '/dist';

    let url = scriptPath + `/${styleName}.css`;
    //console.log('CSSurl', url);

    let linkEl = document.getElementById(`${styleName}_style`);
    if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.setAttribute('href', url);
        linkEl.setAttribute('rel', 'stylesheet');
        linkEl.id = `${styleName}_style`;
        document.head.append(linkEl);
    }
}

function savgy_core(
    input = '',
    {
        addGlobalStyles = true,
        format = 'webp',
        formatSVG = 'original',
        quality = 0.9,
        scaleImages = false,
        addToolbar = true,
        showPreview = false,
        crop = false,
        useIntrinsic = false,
        flattenTransparency = false,
        bgColor = 'transparent'
    } = {}
) {

    let options = { addGlobalStyles, format, formatSVG, quality, scaleImages, addToolbar, showPreview, crop, useIntrinsic, flattenTransparency, bgColor };


    /**
     * check input type
     * selector
     * element array
     * single element
     * markup
     * img
     */


    let isArray = Array.isArray(input);

    // normalize to array
    let inputArr = !isArray ? [input] : input;
    let svgs = [];



    for (let i = 0, l = inputArr.length; l && i < l; i++) {
        let input = inputArr[i];
        let isString = typeof input === 'string';
        isString ? document.querySelectorAll(input).length : false;
    

        let isSVGMarkup = isString ? input.trim().startsWith('<svg ') : false;
        let isElement = !isString ? input instanceof HTMLElement || input instanceof SVGElement : false;
        isElement ? input.nodeName.toLowerCase() === 'img' : false;

        let svg = isElement ? input : (isSVGMarkup ? new DOMParser().parseFromString(svg, "text/html").querySelector("svg") : '' );

        if(svg) svgs.push(svg);

        //console.log(input, isString, isSVGMarkup, isSelector, isElement, isImg);

        // convert
        svg2bitmap(svg, options);

    }



    this.svgs = svgs;

    return this;

}


// Self-executing function for IIFE
if (typeof window !== 'undefined') {
    window.savgy = savgy_core;
}

export { savgy_core as savgy };
