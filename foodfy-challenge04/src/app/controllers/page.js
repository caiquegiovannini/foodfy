const db = require('../../config/db')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        const { filter } = req.query

        if ( filter ) {
                return res.redirect('/search')
        } else {
            Recipe.all(function(recipes) {
                let mostViewed = []
                for (let i = 0; i < 6; i++) {
                    mostViewed.push(recipes[i])
            }
                return res.render('page/index', { recipes, mostViewed })
            })
        }
    },
    about(req, res) {
        return res.render('page/about')
    },
    recipes(req, res) {
        const { filter } = req.query

        if ( filter ) {
                return res.redirect('/search')
        } else {
            Recipe.all(function(recipes) {
                return res.render('page/recipes', { recipes })
            })
        }
    },
    recipe(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Receita não encontrada!')

            return res.render("page/show", { recipe })
        })
    
    
    },
    chefs(req, res) {
        Chef.allChefs(function(chefs) {
            return res.render('page/chefs', { chefs })
        })
    },
    search(req, res) {
        const { filter } = req.query

        Recipe.findBy(filter, function(recipes) {
            return res.render('page/search', { recipes, filter })
        
        })
    }
}
