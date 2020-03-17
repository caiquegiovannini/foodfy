const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const AdminRecipeController = require('../app/controllers/AdminRecipeController')

const Validator = require('../app/validators/adminRecipe')

// Admin Recipes
routes.get('/', AdminRecipeController.index)
routes.get('/create', AdminRecipeController.create)
routes.get('/:id', AdminRecipeController.show)
routes.get('/:id/edit', AdminRecipeController.edit)

routes.post('/create', multer.array("photos", 5), Validator.post, AdminRecipeController.post)
routes.put('/', multer.array("photos", 5) , AdminRecipeController.put)
routes.delete('/', AdminRecipeController.delete)

module.exports = routes