import { API_URL, RES_PER_PAGE } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE
    },
    bookmarks: []
}

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        // if there is no key, nothing happen
        // if there are, second part of operator (object) will execute and return
        // spread object and put value like: key: recipe.key
        ...(recipe.key && { key: recipe.key })
    };
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${process.env.API_KEY}`)
        state.recipe = createRecipeObject(data)

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true
        else
            state.recipe.bookmarked = false
    } catch (err) {
        throw err
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query
        const data = await AJAX(`${API_URL}?search=${query}&key=${process.env.API_KEY}`)

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })
            }
        })
        // reset page when get new search
        state.search.page = 1
    } catch (err) {
        throw err
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page

    const start = (page - 1) * state.search.resultsPerPage //0
    const end = page * state.search.resultsPerPage //9

    return state.search.results.slice(start, end) //slice dont take last value
}

export const updateServing = function (newServing) {
    state.recipe.ingredients.forEach(ing => {
        // new quantity = oldQuantity * newServing / oldServing
        //                  2 * 8/4 = 4
        ing.quantity = ing.quantity * newServing / state.recipe.servings
    });
    state.recipe.servings = newServing
}

const storageBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
    // add bookmark
    state.bookmarks.push(recipe)

    // mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
    storageBookmarks()
}
export const deleteBookmark = function (id) {
    // delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index, 1)

    // mark current recipe as not bookmark
    if (id === state.recipe.id) state.recipe.bookmarked = false
    storageBookmarks()
}

const init = function () {
    const storage = localStorage.getItem('bookmarks')
    if (storage) state.bookmarks = JSON.parse(storage)
}
init()

const clearBookmarks = function () {
    localStorage.clear('bookmarks')
}
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient')
                && entry[1] !== '')
            .map(ing => {
                // const ingArr = ing[1].replaceAll(' ', '').split(',')
                const ingArr = ing[1].split(',').map(el => el.trim())
                if (ingArr.length !== 3) throw new Error('Wrong ingredient format. Please use correct format!')
                const [quantity, unit, description] = ingArr
                return { quantity: quantity ? +quantity : null, unit, description }
            })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }
        const data = await AJAX(`${API_URL}?key=${process.env.API_KEY}`, recipe)
        state.recipe = createRecipeObject(data)
        addBookmark(state.recipe)

    } catch (error) {
        throw error
    }


}
