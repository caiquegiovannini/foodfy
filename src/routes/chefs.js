const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const AdminChefController = require('../app/controllers/AdminChefController')

// Admin Chefs
routes.get('/', AdminChefController.index)
routes.get('/create', AdminChefController.create)
routes.get('/:id', AdminChefController.show)
routes.get('/:id/edit', AdminChefController.edit)

routes.post('/', multer.single("avatar"), AdminChefController.post)
routes.put('/', multer.single("avatar"), AdminChefController.put)
routes.delete('/', AdminChefController.delete)

module.exports = routes