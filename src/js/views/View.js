import icons from 'url:../../img/icons.svg'

export default class View {
  _data;
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Mo Mo
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError()

    this._data = data;
    const markup = this._generateMarkup()

    if (!render) return markup
    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup()

    // create new DOM same from markup
    const newDOM = document.createRange().createContextualFragment(newMarkup)
    // convert object to an array
    const newEls = Array.from(newDOM.querySelectorAll('*'))
    const curEls = Array.from(this._parentEl.querySelectorAll('*'))

    newEls.forEach((newEl, curI) => {
      const curEl = curEls[curI]

      // update change text
      // compare this newEL to old el 
      if (!newEl.isEqualNode(curEl) &&
        // check (take) that only element that contain text can execute
        newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent
      }
      // update change attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes)
          .forEach(attr =>
            curEl.setAttribute(attr.name, attr.value))
      }
    })
  }

  _clear() {
    this._parentEl.innerHTML = ''
  }

  renderSpinner() {
    const markup = `
                <div class="spinner">
                  <svg>
                    <use href="${icons}#icon-loader"></use>
                  </svg>
                </div>
          `;
    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  };

  renderError(message = this._errMsg) {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
          `
    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._Msg) {
    const markup = `
          <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
          `
    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }
}