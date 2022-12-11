import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultView from './views/resultView.js'
import paginationView from './views/paginationView.js'
import bookmarkView from './views/bookmarkView.js'
import addRecipeView from './views/addRecipeView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept()
}


const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    // update results view to mark selected search result
    resultView.update(model.getSearchResultsPage())

    // update bm view
    bookmarkView.update(model.state.bookmarks)

    // Loading recipe
    await model.loadRecipe(id)

    // render recipe
    recipeView.render(model.state.recipe)
  } catch (error) {
    recipeView.renderError()
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner()
    // get search query
    const query = searchView.getQuery()
    if (!query) return


    // load search results
    await model.loadSearchResults(query)

    // render results
    resultView.render(model.getSearchResultsPage())

    // render pagination button
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err);
  }
}

const controlPagination = function (goToPage) {
  // render new result
  resultView.render(model.getSearchResultsPage(goToPage))

  // render new pagination button
  paginationView.render(model.state.search)
}

const controlServing = function (newServing) {
  // update recipe serving (in state)
  model.updateServing(newServing)
  // update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // add/remove bm
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // update recipe view
  recipeView.update(model.state.recipe)

  // render bm
  bookmarkView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // upload new recipe data
    await model.uploadRecipe(newRecipe)

    // render recipe
    recipeView.render(model.state.recipe)

    // success message
    addRecipeView.renderMessage()

    // render bookmark view
    bookmarkView.render(model.state.bookmarks)

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // close form 
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (error) {
    addRecipeView.renderError(error.message)
  }
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe)
  recipeView.addHandlerUpdateServing(controlServing)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()
