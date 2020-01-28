const express = require('express')
const routes = express.Router()
const PageController = require('./app/controllers/PageController')
const AdminRecipeController = require('./app/controllers/AdminRecipeController')
const AdminChefController = require('./app/controllers/AdminChefController')

// Page
routes.get('/', PageController.index)
routes.get('/about', PageController.about)
routes.get('/recipes', PageController.recipes)
routes.get('/recipes/:id', PageController.recipe)
routes.get('/chefs', PageController.chefs)
routes.get('/search', PageController.search)

// Admin Recipes
routes.get('/admin/recipes', AdminRecipeController.index)
routes.get('/admin/recipes/create', AdminRecipeController.create)
routes.get('/admin/recipes/:id', AdminRecipeController.show)
routes.get('/admin/recipes/:id/edit', AdminRecipeController.edit)
routes.post('/admin/recipes', AdminRecipeController.post)
routes.put('/admin/recipes', AdminRecipeController.put)
routes.delete('/admin/recipes', AdminRecipeController.delete)

// Admin Chefs
routes.get('/admin/chefs', AdminChefController.index)
routes.get('/admin/chefs/create', AdminChefController.create)
routes.get('/admin/chefs/:id', AdminChefController.show)
routes.get('/admin/chefs/:id/edit', AdminChefController.edit)
routes.post('/admin/chefs', AdminChefController.post)
routes.put('/admin/chefs', AdminChefController.put)
routes.delete('/admin/chefs', AdminChefController.delete)


module.exports = routes