const express = require('express')
const routes = express.Router()

const page = require('./page')
const users = require('./users')
const profile = require('./profile')
const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/', page)
routes.use('/admin/users', users)
routes.use('/admin/profile', profile)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

// Alias
routes.get('/admin', function(req, res) {
    return res.redirect('/admin/users/login')
})

module.exports = routes