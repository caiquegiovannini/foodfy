const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        let results = await Recipe.all()
        let recipes = results.rows
        let mostViewed = []

        // get images 
        const filesPromise = recipes.map(async recipe => {
            results = await Recipe.files(recipe.id)
            let file = results.rows[0]
            file = {
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }
            return recipe = {
                ...recipe,
                file
            }
        })
        const newRecipes = await Promise.all(filesPromise)

        for (let i = 0; i < 6; i++) {
            mostViewed.push(newRecipes[i])
        }

        return res.render('page/index', { mostViewed })
        
    },
    about(req, res) {
        return res.render('page/about')
    },
    async recipes(req, res) {
        let { page, limit } = req.query
        
        page = page || 1
        limit = limit || 3
        let offset = limit * (page - 1)
        
        const params = {
            page,
            limit,
            offset
        }
        
        let results = await Recipe.paginate(params)
        let recipes = results.rows
        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        // get images 
        const filesPromise = recipes.map(async recipe => {
            results = await Recipe.files(recipe.id)
            let file = results.rows[0]
            file = {
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }
            return recipe = {
                ...recipe,
                file
            }
        })
        const newRecipes = await Promise.all(filesPromise)

        return res.render('page/recipes', { recipes: newRecipes, pagination })
    },
    async recipe(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.render('page/recipes', {
            error: 'Receita não encontrada!'
        })

        //get images
        results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("page/show", { recipe, files })
    },
    async chefs(req, res) {
        const results = await Chef.all()
        let chefs = results.rows

        chefs = chefs.map(chef => ({
            ...chef,
            path: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "").replace("\\images\\", "/images/")}`
        }))
            
        return res.render('page/chefs', { chefs })
    },
    async search(req, res) {
        const { filter } = req.query

        let results = await Recipe.findBy(filter)
        let recipes = results.rows

        // get images 
        const filesPromise = recipes.map(async recipe => {
            results = await Recipe.files(recipe.id)
            let file = results.rows[0]
            file = {
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }
            return recipe = {
                ...recipe,
                file
            }
        })
        const newRecipes = await Promise.all(filesPromise)

        return res.render('page/search', { recipes: newRecipes, filter })
        
    //     let { filter, page, limit } = req.query

    //     page = page || 1
    //     limit = limit || 3
    //     let offset = limit * (page - 1)

    //     const total = await Math.ceil 

    //     const params = {
    //         filter,
    //         page,
    //         limit,
    //         offset,
    //         callback(recipes) {
    //             const pagination = {
    //                 total: Math.ceil(recipes[0].total / limit),
    //                 page
    //             }
    //             return res.render('page/search', { recipes, filter, pagination})
    //         }
    //     }

    //     Recipe.paginateFilter(params)
    }
}
