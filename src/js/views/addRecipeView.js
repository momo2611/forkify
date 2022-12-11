import View from './View.js';
import icons from 'url:../../img/icons.svg'

class AddRecipeView extends View {
    _parentEl = document.querySelector('.upload');
    _Msg = 'Your recipe was successfully uploaded!'

    _windowEl = document.querySelector('.add-recipe-window')
    _overlayEl = document.querySelector('.overlay')
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor() {
        super()
        this._addHandlerOpen()
        this._addHandlerHide()
    }

    toggleWindow() {
        this._overlayEl.classList.toggle('hidden')
        this._windowEl.classList.toggle('hidden')
    }

    _addHandlerOpen() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
    }

    _addHandlerHide() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overlayEl.addEventListener('click', this.toggleWindow.bind(this))
    }

    addHandlerUpload(handler) {
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault()
            const dataArr = [...new FormData(this)] //point to parent el means upload form
            const data = Object.fromEntries(dataArr)
            handler(data)
        })
    }

    _generateMarkup() {

    }
}
export default new AddRecipeView