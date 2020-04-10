const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipeController = require('../app/controllers/RecipeController')

const Validator = require('../app/validators/recipe')
const  { onlyUsers, onlyWhoCreatedOrAdmin } = require('../app/middlewares/session')

// Admin Recipes
routes.get('/', onlyUsers, RecipeController.index)
routes.get('/create', onlyUsers , RecipeController.create)
routes.get('/:id', onlyUsers, Validator.show, RecipeController.show)
routes.get('/:id/edit', Validator.edit, onlyWhoCreatedOrAdmin, RecipeController.edit)

routes.post('/create', multer.array("photos", 5), Validator.post, RecipeController.post)
routes.put('/', multer.array("photos", 5), Validator.update, RecipeController.put)
routes.delete('/', RecipeController.delete)

module.exports = routes