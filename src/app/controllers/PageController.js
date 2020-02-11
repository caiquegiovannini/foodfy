const db = require('../../config/db')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        const results = await Recipe.all()
        const recipes = results.rows
        let mostViewed = []

        for (let i = 0; i < 6; i++) {
            mostViewed.push(recipes[i])
        }

        return res.render('page/index', { recipes, mostViewed })
        
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
        
        const results = await Recipe.paginate(params)
        const recipes = results.rows
        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        return res.render('page/recipes', { recipes, pagination })

        // PAGINAÇÃO FUNCIONANDO MAS NUMEROS DE PAGINAS NAO APARECEM (! ARRUMAR !)

        // const results = await Recipe.all()
        // const recipes = results.rows

        // return res.render('page/recipes', { recipes })

    },
    async recipe(req, res) {
        const results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada!')

        return res.render("page/show", { recipe })
    },
    async chefs(req, res) {
        const results = await Chef.all()
        const chefs = results.rows
            
        return res.render('page/chefs', { chefs })
    },
    async search(req, res) {
        const { filter } = req.query

        const results = await Recipe.findBy(filter)
        const recipes = results.rows

        return res.render('page/search', { recipes, filter })
        
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
