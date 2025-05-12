import { assetCache } from './savgy_constants.js';
import { icons } from './savgy_icons.js';
import { getToolbar } from './savgy_toolbar.js';
import { svg2bitmap } from './savgy_convert.js';


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

    let options = { addGlobalStyles, format, formatSVG, quality, scaleImages, addToolbar, showPreview, crop, useIntrinsic, flattenTransparency, bgColor }


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
        let isSelector = isString ? document.querySelectorAll(input).length : false;
        if(isSelector){
        }
    

        let isSVGMarkup = isString ? input.trim().startsWith('<svg ') : false;
        let isElement = !isString ? input instanceof HTMLElement || input instanceof SVGElement : false;
        let isImg = isElement ? input.nodeName.toLowerCase() === 'img' : false;

        let svg = isElement ? input : (isSVGMarkup ? new DOMParser().parseFromString(svg, "text/html").querySelector("svg") : '' )

        if(svg) svgs.push(svg)

        //console.log(input, isString, isSVGMarkup, isSelector, isElement, isImg);

        // convert
        svg2bitmap(svg, options)

    }



    this.svgs = svgs;

    return this;

}



export { savgy_core as savgy };


// Self-executing function for IIFE
if (typeof window !== 'undefined') {
    window.savgy = savgy_core;
}
