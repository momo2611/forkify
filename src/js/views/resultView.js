import View from './View.js';
import previewView from './previewView.js';

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errMsg = 'No recipe found for your query. Please try again!'
  _Msg = ''

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false))
      .join('')
  }
}

export default new ResultView