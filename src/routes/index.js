const express = require('express')
const routes = express.Router()

const page = require('./page')
const admin = require('./admin')
const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/', page)
routes.use('/', admin)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

module.exports = routes