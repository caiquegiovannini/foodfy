const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        const results = await Recipe.all()
        const recipes = results.rows

        return res.render('admin/recipe/index', { recipes })

    },
    async create(req, res) {
        const results = await Recipe.chefSelectOptions()
        const chefOptions = results.rows

        return res.render('admin/recipe/create', { chefOptions })

    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (key != 'information' && req.body[key] == "") {
                return res.send('Os campos com * são obrigatórios!')
            }
        }

        if (req.files.length == 0)
            return res.send('Envie pelo menos uma foto')

        const results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file }))
        await Promise.all(filesPromise)

        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async show(req, res) {
        const results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]
        
        if (!recipe) return res.send('Receita não encontrada!')

        return res.render(`admin/recipe/show`, { recipe })
    },
    async edit(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada!')

        results = await Recipe.chefSelectOptions()
        const chefOptions = results.rows

        return res.render('admin/recipe/edit', { recipe, chefOptions })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (key != 'information' && req.body[key] == "") {
                return res.send('Os campos com * são obrigatórios!')
            }
        }
        
        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        await Recipe.delete(req.body.id)

        return res.redirect('/admin/recipes')
    }
}
