import { icons } from './savg_icons';


export function getToolbar(icons) {

    let toolbarMarkup =
        `<div class="savg__toolbar">
    <div class="savg__toolbar__inner">
        <div class="savg__toolbar__inputwrap  --savg__toolbar__grd">
            <div class="savg__toolbar__row savg__toolbar__row--2">
                <div class="savg__toolbar__col savg__grd-label">
                    <label class="savg__toolbar__label savg__toolbar__label--w">W:</label>   
                    <input class="savg__toolbar__input savg__toolbar__input--w" type="number" value="640">
                </div>

                <div class="savg__toolbar__col savg__grd-label">
                    <label class="savg__toolbar__label savg__toolbar__label--h">H:</label>   
                    <input class="savg__toolbar__input savg__toolbar__input--h" type="number" value="480">
                </div>
            </div>


            <div class="savg__toolbar__row">
                <div class="savg__toolbar__col savg__grd-label">
                    <label class="savg__toolbar__label">Quality:</label>  
                    <input class="savg__toolbar__input savg__toolbar__input--quality" type="number" value="0.9" min="0.1" max="1" step="0.1">
                </div>
            </div>


        </div>
        <div class="savg__toolbar__inputwrap">
            <div class="savg__toolbar__row">
                <div class="savg__toolbar__col">
                    <select class="savg__toolbar__select savg__toolbar__select--format">
                        <option class="savg__toolbar__option" value="png">PNG </option>
                        <option class="savg__toolbar__option" value="webp">WebP </option>
                        <option class="savg__toolbar__option" value="jpg">Jpeg </option>
                        <option class="savg__toolbar__option" value="svg">SVG (original)</option>
                        <option class="savg__toolbar__option" value="svg_self">SVG (self-contained)</option>
                    </select>
                </div>
            </div>

            <div class="savg__toolbar__row">
                <div class="savg__toolbar__col">
                    <select class="savg__toolbar__select savg__toolbar__select--format--img">
                        <option class="savg__toolbar__option" value="original">SVG img format </option>
                        <option class="savg__toolbar__option" value="png">PNG </option>
                        <option class="savg__toolbar__option" value="webp">WebP </option>
                        <option class="savg__toolbar__option" value="jpg">Jpeg </option>
                    </select>
                </div>
            </div>


            <div class="savg__toolbar__row">
                <div class="savg__toolbar__col">
                    <label class="savg__toolbar__label savg__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savg__toolbar__check savg__toolbar__check--preview">
                        Show Preview
                    </label>
                    <label class="savg__toolbar__label savg__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savg__toolbar__check savg__toolbar__check--intrinsic">
                        Intrinsic width/height
                    </label>
                    <label class="savg__toolbar__label savg__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savg__toolbar__check savg__toolbar__check--crop">
                        Crop to content
                    </label>
                    <label class="savg__toolbar__label savg__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savg__toolbar__check savg__toolbar__check--flatten">
                        Flatten transparency
                    </label>
                    <label class="savg__toolbar__label savg__toolbar__label--inline">
                        <input type="checkbox" value="1" class="savg__toolbar__check savg__toolbar__check--scaleImg">
                        Scale SVG images
                    </label>


                </div>
            </div>


        </div>

        <div class="savg__toolbar__row savg__toolbar__row--2">
            <div class="savg__toolbar__col">
                <button type="button" class="savg__button savg__toolbar__button savg__toolbar__button--copy"><span class="savg__toolbar__button--save--download icn-svg savg__icon">${icons.copy} </span> Copy</button>
            </div>
            <div class="savg__toolbar__col">
                <button type="button" class="savg__button--ready    savg__button  savg__toolbar__button savg__toolbar__button--save"><span class="savg__toolbar__button--save--download icn-svg savg__icon savg__icon--download">${icons.download} </span> <span class="savg__toolbar__button--save--download icn-svg savg__icon savg__icon--spinner">${icons.spinner} </span> Save file</button>
                <a class="savg__toolbar__a savg__toolbar__button--a savg__hidden" href="" download=""></a>
            </div>
        </div>
        <div class="saveg__filesize__wrp">
            <p class="saveg__filesize">Filesize: 0 KB</p>
        </div>


    </div>

    <div class="savg__toolbar__toggle">
        <label class="savg__toolbar__toggle__label">
            <span class="savg__toolbar__toggle__icon savg__toolbar__toggle__icon--download  savg__icon savg__icon--download">${icons.download}</span>
            <span class=" savg__toolbar__toggle__icon savg__toolbar__toggle__icon--close savg__icon savg__icon--close">${icons.close}</span>
            <input class="savg__toolbar__toggle__input savg__hidden" type="checkbox" value="1">
        </label>
    </div>
</div>
`;

    let toolbar = new DOMParser().parseFromString(toolbarMarkup, 'text/html').querySelector('div')

    let inpW = toolbar.querySelector('.savg__toolbar__input--w')
    let inpH = toolbar.querySelector('.savg__toolbar__input--h')
    let inpQ = toolbar.querySelector('.savg__toolbar__input--quality')
    let inpF = toolbar.querySelector('.savg__toolbar__select--format')
    let inpPreview = toolbar.querySelector('.savg__toolbar__check--preview')
    //preferred format for images in SVG
    let inpFSVG = toolbar.querySelector('.savg__toolbar__select--format--img')

    let btnCopy = toolbar.querySelector('.savg__toolbar__button--copy')
    let btnSave = toolbar.querySelector('.savg__toolbar__button--save')
    let linkFile = toolbar.querySelector('.savg__toolbar__button--a')
    let inputToggleLabel = toolbar.querySelector('.savg__toolbar__toggle__label')
    let inputToggle = toolbar.querySelector('.savg__toolbar__toggle__input')
    let inputIntrinsic = toolbar.querySelector('.savg__toolbar__check--intrinsic')
    let inputCrop = toolbar.querySelector('.savg__toolbar__check--crop')
    let inputFlatten = toolbar.querySelector('.savg__toolbar__check--flatten')
    let inputScaleImages = toolbar.querySelector('.savg__toolbar__check--scaleImg')

    let selectSVGIMGFormat = toolbar.querySelector('.savg__toolbar__select--format--img')
    let pFilesize = toolbar.querySelector('.saveg__filesize')


    return { toolbar, inpW, inpH, inpQ, inpF, inpFSVG, btnCopy, btnSave, linkFile, inpPreview, inputToggleLabel, inputToggle, inputIntrinsic, inputCrop, selectSVGIMGFormat, pFilesize, inputFlatten, inputScaleImages }

}