import { icons } from './savgy_icons';


export function getToolbar(icons) {

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

    let toolbar = new DOMParser().parseFromString(toolbarMarkup, 'text/html').querySelector('div')

    let inpW = toolbar.querySelector('.savgy__toolbar__input--w')
    let inpH = toolbar.querySelector('.savgy__toolbar__input--h')
    let inpQ = toolbar.querySelector('.savgy__toolbar__input--quality')
    let inpF = toolbar.querySelector('.savgy__toolbar__select--format')
    let inpPreview = toolbar.querySelector('.savgy__toolbar__check--preview')
    //preferred format for images in SVG
    let inpFSVG = toolbar.querySelector('.savgy__toolbar__select--format--img')

    let btnCopy = toolbar.querySelector('.savgy__toolbar__button--copy')
    let btnSave = toolbar.querySelector('.savgy__toolbar__button--save')
    let linkFile = toolbar.querySelector('.savgy__toolbar__button--a')
    let inputToggleLabel = toolbar.querySelector('.savgy__toolbar__toggle__label')
    let inputToggle = toolbar.querySelector('.savgy__toolbar__toggle__input')
    let inputIntrinsic = toolbar.querySelector('.savgy__toolbar__check--intrinsic')
    let inputCrop = toolbar.querySelector('.savgy__toolbar__check--crop')
    let inputFlatten = toolbar.querySelector('.savgy__toolbar__check--flatten')
    let inputScaleImages = toolbar.querySelector('.savgy__toolbar__check--scaleImg')

    let selectSVGIMGFormat = toolbar.querySelector('.savgy__toolbar__select--format--img')
    let pFilesize = toolbar.querySelector('.saveg__filesize')


    return { toolbar, inpW, inpH, inpQ, inpF, inpFSVG, btnCopy, btnSave, linkFile, inpPreview, inputToggleLabel, inputToggle, inputIntrinsic, inputCrop, selectSVGIMGFormat, pFilesize, inputFlatten, inputScaleImages }

}