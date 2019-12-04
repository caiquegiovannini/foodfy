const data = require('../data.json')

exports.index = function(req, res) {
    let mostViewed = []
    for (let i = 0; i < 6; i++) {
        mostViewed.push(data.recipes[i])
    }

    return res.render('page/index', { mostViewed })
}

exports.about = function(req, res) {
    return res.render('page/about')
}

exports.recipes = function(req, res) {
    return res.render('page/recipes', { data })
}

exports.recipe = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe) {
        return id == recipe.id
    })

    if (!foundRecipe) return res.send('Receita não encontrada!')

    const recipe = { ...foundRecipe }

    return res.render('page/full_recipe', { recipe })
}