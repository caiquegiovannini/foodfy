const { paginate } = require('../../lib/pagination')

const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
    async index(req, res) {
        try {
            let allRecipes = await LoadRecipeService.load('recipes')
            const recipes = allRecipes.filter((recipe, index) => index > 5 ? false : true)
    
            return res.render('page/index', { recipes })

        } catch(err) {
            console.error(err)
        }
    },
    about(req, res) {
        return res.render('page/about')
    },
    async recipes(req, res) {
        try {
            let { pagination, recipes } = await paginate(req.query)
            
            const recipesPromise = recipes.map(LoadRecipeService.format)
            recipes = await Promise.all(recipesPromise)
    
            return res.render('page/recipes', { recipes, pagination })

        } catch(err) {
            console.error(err)
        }
    },
    async recipe(req, res) {
        try {
            const recipe = await LoadRecipeService.load('recipe', { where: {id: req.params.id}})
    
            return res.render("page/show", { recipe })

        } catch(err) {
            console.error(err)
        }
    },
    async chefs(req, res) {
        try {
            const chefs = await LoadChefService.load('chefs')
                
            return res.render('page/chefs', { chefs })

        } catch(err) {
            console.error(err)
        }
    },
    async search(req, res) { 
        try {
            const { filter } = req.query

            let { pagination, recipes } = await paginate(req.query)

            const recipesPromise = recipes.map(LoadRecipeService.format)
            recipes = await Promise.all(recipesPromise)
    
            return res.render('page/search', { recipes, filter, pagination })

        } catch(err) {
            console.error(err)
        }
    }
}
