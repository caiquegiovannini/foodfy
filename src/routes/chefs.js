const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')

const Validator = require('../app/validators/chef')
const  { onlyUsers, onlyAdmin } = require('../app/middlewares/session')

// Admin Chefs
routes.get('/', onlyUsers, ChefController.index)
routes.get('/create', onlyAdmin, ChefController.create)
routes.get('/:id', onlyUsers, Validator.chefDontExists, ChefController.show)
routes.get('/:id/edit', onlyAdmin, Validator.chefDontExists, ChefController.edit)

routes.post('/', multer.single("avatar"), Validator.post, ChefController.post)
routes.put('/', multer.single("avatar"), Validator.update, ChefController.put)
routes.delete('/', Validator.remove, ChefController.delete)

module.exports = routes