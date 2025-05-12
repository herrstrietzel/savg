import { assetCache } from './savgy_constants.js';
import { icons } from './savgy_icons.js';
import { getToolbar } from './savgy_toolbar.js';
import { dataURLToBlob, blobToBase64 } from './savgy_blob.js';
import { inlineUseRefs, inlineRefs } from './savgy_refs.js';
import { svg2Canvas2DataUrl, inlineImages, optimizeSVGImgs } from './savgy_img.js';
import { inlineGlobalStyles, getAllImportRules, importRulesToLink } from './savgy_css.js'
import { analizeSVGText, externalFontsToBase64 } from './savgy_fonts.js';




export async function svg2bitmap(svg, {
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
        await addStyles('savgy', true)


        savgyWrap.classList.add('savgy__wrap');
        //document.body.insertBefore(savgyWrap, svg);
        document.body.insertBefore(savgyWrap, imgEl);

        // preview img
        previewImg = document.createElement('img')
        previewImg.classList.add('savgy__preview', 'savgy__preview--hidden');


        // toolbar
        ({ toolbar, inpW, inpH, inpQ, inpF, btnCopy, btnSave, linkFile, inpFSVG, inpPreview, inputToggle, inputIntrinsic, inputCrop, selectSVGIMGFormat, pFilesize, inputFlatten, inputScaleImages } = getToolbar(icons));

        //console.log(toolbar);
        //savgyWrap.append(svg, svgClone, previewImg, toolbar);
        savgyWrap.append(imgEl, svgClone, previewImg, toolbar);

    } else {
        savgyWrap.style = 'position:relative; height:0px; overflow:hidden; opacity:0';
        savgyWrap.append(svgClone);
        document.body.append(savgyWrap)
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
    let viewBoxAtt = svgClone.getAttribute('viewBox')
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

    let svgBB = svgClone.getBBox()
    let [x, y, widthCrop, heightCrop] = [svgBB.x, svgBB.y, svgBB.width, svgBB.height];


    /**
     * toolbar inputs
     */

    let aspect = width / height;

    // round to integers
    [width, height] = [width, height].map(val => +(val).toFixed(0))


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
        })


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

            navigator.clipboard.writeText(copyText)
            btnCopy.classList.remove('savgy--copying');

        })

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

        })


        /**
         * check if toolbar is hidden
         * switch to bottom alignment
         */

        let toolbarTop = 0;

        window.addEventListener('resize', e => {
            toolbarTop = toolbar.getBoundingClientRect().top;
            console.log('toolbarTop', toolbarTop);

            if (toolbarTop < 0) {
                toolbar.classList.add('savgy__toolbar--bottom')

            } else {
                toolbar.classList.remove('savgy__toolbar--bottom')
            }
        });

        window.addEventListener('DOMContentLoaded', e => {
            toolbarTop = toolbar.getBoundingClientRect().top;
            console.log('toolbarTop', toolbar, toolbarTop, toolbar.getBoundingClientRect());
            if (toolbarTop < 0) toolbar.classList.add('savgy__toolbar--bottom')
        })


    }

    // generate image directly
    else {
        if (!hasSelfContainedSVG) svgClone = await getSelfcontainedSVG(svgClone, assetCache, addGlobalStyles);
        hasSelfContainedSVG = true;

        ({ dataUrl, dataUrlSVG } = await updateOutput(svg, svgClone, assetCache, addGlobalStyles, formatSVG, width, height, format, quality, scaleImages, bgColor, flattenTransparency));
    }

    return { bmp: dataUrl, svg: dataUrlSVG }

}



export async function updateOutput(svg, svgClone, assetCache, addGlobalStyles, formatSVG, width, height, format, quality, scaleImages, bgColor = '#fff', flattenTransparency = false) {

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





export async function getSelfcontainedSVG(svg, assetCache = {}, addGlobalStyles = true, format = 'original', quality = 1, scaleImages = false) {


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
    let css = ''


    /**
     * inline use refs
     */
    await inlineUseRefs(svg, assetCache);


    /**
     * search for masks, 
     * clip-paths, gradients, patterns etc.
     */
    inlineRefs(svg, assetCache)


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
    let svgFontInfo = analizeSVGText(svg)
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
            css += await inlineGlobalStyles(svg, svgFontInfo, assetCache)
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
export function getVisualBackgroundColor(element) {
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




export async function addStyles(styleName = 'styles', addDist = false) {

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
    }


    let scriptPath = getCurrentScriptUrl();

    // dist path is excluded in modules
    if (!scriptPath.includes('dist') && addDist) scriptPath += '/dist';

    let url = scriptPath + `/${styleName}.css`;
    //console.log('CSSurl', url);

    let linkEl = document.getElementById(`${styleName}_style`);
    if (!linkEl) {
        linkEl = document.createElement('link')
        linkEl.setAttribute('href', url)
        linkEl.setAttribute('rel', 'stylesheet')
        linkEl.id = `${styleName}_style`;
        document.head.append(linkEl)
    }
}

