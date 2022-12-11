import View from './View.js';
import previewView from './previewView.js';

class BookmarkView extends View {
    _parentEl = document.querySelector('.bookmarks__list');
    _errMsg = 'No bookmarks yet. Look for yours!'
    _Msg = ''

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false))
            .join('')
    }

}

export default new BookmarkView