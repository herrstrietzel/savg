import {dataURLToBlob, blobToBase64} from './savgy_blob.js';


export async function optimizeSVGImgs(svgClone, assetCache = {}, addGlobalStyles = true, width = null, height = null, format = 'original', quality = 1, scaleImages = true, bgColor='transparent') {


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
            if (scaleImages) [width, height] = [w, h]


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

export async function inlineImages(svg, assetCache = {}) {

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




export async function svg2Canvas2DataUrl(svg, width = null, height = null, format = 'png', quality = '1', bgColor='transparent', flattenTransparency=false, canvas = null) {

    let isString = typeof svg === 'string';
    let noDimensions = !width || !height;
    let nsAtt = 'xmlns="http://www.w3.org/2000/svg"'
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
    format = format.replace(/image\//g, '').replace(/jpg/g, 'jpeg')

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