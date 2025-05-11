
/**
 * inline references for patterns, masks, 
 * clipaths etc
 */

export function inlineRefs(svg, assetCache={}) {
    let els = svg.querySelectorAll('path, polyline, polygon, rect, circle, ellipse, line, text, tspan');
    //attributes that may reference an external asset e.g a gradient, pattern, mask etc
    let props = ['fill', 'stroke', 'clip-path', 'mask', 'href', 'xlink:href'];

    // create defs elements
    let defs = svg.querySelector('defs')
    if (!defs) {
        defs = document.createElementNS(ns, 'defs');
        svg.insertBefore(defs, svg.children[0])
    }


    for (let i = 0; i < els.length; i++) {
        let el = els[i];

        let styles = window.getComputedStyle(el);
        let refID, refID_clone, refEl, refEl_clone;

        for (let p = 0; p < props.length; p++) {
            let prop = props[p];
            let att = el.getAttribute(prop)
            let value = att ? att : styles.getPropertyValue(prop);
            let isHref = prop === 'href' || prop === 'xlink:href' ? true : false;

            /**
             * check props to find
             * patterns, gradients, masks etc
             */
            if (value.includes('url') || isHref) {

                //url = getUrls(value)
                refID = isHref ? value.substring(1) : getUrls(value).substring(1)
                //console.log('has ref', prop, url, refID);

                refEl = refID ? svg.getElementById(refID) : null
                // already present in svg
                if (refEl) {
                    //console.log('exists');
                    continue;
                }

                // not in parent SVG - copy
                refEl = refID ? document.getElementById(refID) : null
                if (refEl) {
                    refEl_clone = refEl.cloneNode(true);
                    //svg.insertBefore(refEl_clone, svg.children[0]);
                    defs.append(refEl_clone)
                }
            }
        }
    }

    function getUrls(str) {
        let regex = /url\((['"]?)([^'"()]+)\1\)/gi;
        let match = str.match(regex) ? str.match(regex)[0].split(/\(|\)/)[1].replace(/"|'/g, '') : ''
        return match
    }

}



export async function inlineUseRefs(svg, assetCache = {}) {

    let useEls = svg.querySelectorAll('use');
    if (!useEls.length) return;

    const ns = "http://www.w3.org/2000/svg";
    const nsXlink = "http://www.w3.org/1999/xlink";

    // create defs elements
    let defs = svg.querySelector('defs')
    if (!defs) {
        defs = document.createElementNS(ns, 'defs');
        svg.insertBefore(defs, svg.children[0])
    }


    for (let i = 0; i < useEls.length; i++) {
        let use = useEls[i];
        let href = use.getAttributeNS(nsXlink, 'href') ? use.getAttributeNS(nsXlink, 'href') : use.getAttribute('href');

        // xlink sucks - we normalize it to href
        use.removeAttribute('xlink:href')


        // find external use references
        let hrefArr = href.split('#').filter(Boolean);
        let [url, id] = hrefArr;

        let isExternal = hrefArr.length > 1;
        let inlineRef, inlineDef, defId;

        // use definition is in document
        let inlinedSymbol = document.getElementById(hrefArr[0]);
        if (inlinedSymbol) {
            inlineDef = inlinedSymbol.cloneNode(true)
            //svg.insertBefore(inlineDef, svg.children[0]);
            defs.append(inlineDef);
            inlineRef = `#${hrefArr[0]}`
            use.setAttribute('href', inlineRef)
        }

        // fetch external ref
        else if (isExternal) {
            let spriteName = url.replace(/\./g, '_')

            // is cached
            if (assetCache[url] && assetCache[url][id]) {
                //console.log('is cached', id);
                inlineDef = assetCache[url][id].cloneNode(true)
            } else {

                // fetch and cache
                let res = await fetch(url);
                if (res.ok) {

                    let spriteMarkup = await res.text();
                    let sprite = new DOMParser().parseFromString(spriteMarkup, 'text/html').querySelector('svg')
                    let symbol = sprite.getElementById(id)

                    // cache
                    assetCache[url] = {}
                    assetCache[url][id] = symbol;
                    inlineDef = symbol.cloneNode(true)
                }
            }

            defId = `${spriteName}_${id}`;
            inlineDef.id = defId

            // add to svg if not already done
            if (!svg.getElementById(defId)) {
                //svg.insertBefore(inlineDef, svg.children[0]);
                defs.append(inlineDef);
            }

            // new reference
            use.setAttribute('href', `#${defId}`)
        }
        //console.log(assetCache);
    }

}