let svgEl = document.getElementById("svg");
let svgStr = new XMLSerializer().serializeToString(svgEl);
//console.log(svgStr)
let svgInp = svgEl;


(async () => {
    let options = {
        addGlobalStyles: true,
        format: 'webp',
        scaleImages: false,
        quality: 0.8,
        addToolbar: true
    }


    /*
    let savgEls = new savgy(svgEl);
    console.log('savg', savg);
    */

    // self contained img
    let savg2 = new savgy(imgSelfContained);
})();
