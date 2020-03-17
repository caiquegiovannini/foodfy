const express = require('express')
const routes = express.Router()

const PageController = require('../app/controllers/PageController')

// Page
routes.get('/', PageController.index)
routes.get('/about', PageController.about)
routes.get('/recipes', PageController.recipes)
routes.get('/recipes/:id', PageController.recipe)
routes.get('/chefs', PageController.chefs)
routes.get('/search', PageController.search)

module.exports = routes