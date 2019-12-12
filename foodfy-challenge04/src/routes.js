const express = require('express')
const routes = express.Router()
const page = require('./app/controllers/page')
const admin = require('./app/controllers/admin')

routes.get('/', page.index)
routes.get('/about', page.about)
routes.get('/recipes', page.recipes)
routes.get('/recipes/:id', page.recipe)
routes.get('/chefs', page.chefs)
routes.get('/search', page.search)

routes.get('/admin/recipes', admin.index)
routes.get('/admin/recipes/create', admin.create)
routes.get('/admin/recipes/:id', admin.show)
routes.get('/admin/recipes/:id/edit', admin.edit)
routes.post('/admin/recipes', admin.post)
routes.put('/admin/recipes', admin.put)
routes.delete('/admin/recipes', admin.delete)

routes.get('/admin/chefs', admin.chefs)
routes.get('/admin/chefs/create', admin.createChef)
routes.get('/admin/chefs/:id', admin.showChef)
routes.get('/admin/chefs/:id/edit', admin.editChef)
routes.post('/admin/chefs', admin.postChef)
routes.put('/admin/chefs', admin.putChef)
routes.delete('/admin/chefs', admin.deleteChef)


module.exports = routes