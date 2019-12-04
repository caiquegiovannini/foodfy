const fs = require('fs')
const data = require('../data.json')

exports.index = function(req, res) {

    return res.render('admin/index', { recipes: data.recipes })
}

exports.create = function(req, res) {
    
    return res.render('admin/create')
}

exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (key != 'information' && req.body[key] == "") {
            return res.send('Os campos com * são obrigatórios!')
        }
    }

    const { image, title, author, ingredients, preparation, information } = req.body

    let id = Number(data.recipes.length + 1)
    const checkId = data.recipes.find(function(recipe) {
        if (recipe.id == id) {
            id += 1
        }
    })

    data.recipes.push({
        id,
        image,
        title,
        author,
        ingredients,
        preparation,
        information
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Erro! \n Não foi possível salvar a receita!')

        return res.redirect('/admin/recipes')
    })
}

exports.show = function(req, res) {
    // const recipeIndex = req.params.index
    // const recipe = data.recipes[recipeIndex]
    
    // if (recipeIndex > data.length - 1) {
    //     return res.send('Recipe not found!')
    // }

    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe) {
        return id == recipe.id
    })

    if (!foundRecipe) return res.send('Receita não encontrada!')

    const recipe = { ...foundRecipe }

    return res.render('admin/show', { recipe })
}

exports.edit = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe) {
        return id == recipe.id
    })

    if (!foundRecipe) return res.send('Receita não encontrada!')

    const recipe = { ...foundRecipe }

    return res.render('admin/edit', { recipe })
}

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0
    
    const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
        if (id == recipe.id) {
            index = foundIndex
            return true
        }
    })

    const recipe = {
        ...foundRecipe,
        ...req.body,
        id: Number(req.body.id)
    }
    
    data.recipes[index] = recipe

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Erro na atualização dos dados!')

        return res.redirect(`/admin/recipes/${id}`)
    })
}

exports.delete = function(req, res) {
    const { id } = req.body

    const filteredRecipes = data.recipes.filter(function(recipe) {
        return recipe.id != id
    })

    data.recipes = filteredRecipes

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Erro ao deletar a receita!')

        return res.redirect('/admin/recipes')
    })
}