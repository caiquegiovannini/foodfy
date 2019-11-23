const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require('./data')

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    noCache: true,
    autoescape: false
})

server.get('/', function(req, res) {
    let mostViewed = []
    for (let i = 0; i < 6; i++) {
        mostViewed.push(recipes[i])
    }

    return res.render('index', { mostViewed, recipes })
})

server.get('/about', function(req, res) {
    return res.render('about')
})

server.get('/recipes', function(req, res) {
    return res.render('recipes', { recipes })
})

server.get('/recipes/:index', function(req, res) {
            const recipeIndex = req.params.index

            const recipe = recipes[recipeIndex]
        
            if (recipeIndex > recipes.length - 1) {
                return res.send('Recipe not found!')
            }
            return res.render('full_recipe', { recipe })
})

server.listen(3000, function() {
    console.log('Server online')
})