const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        const results = await Chef.all()
        const chefs = results.rows

        return res.render('admin/chef/index', { chefs })
    },
    create(req, res) {
        return res.render('admin/chef/create')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Todos os campos são obrigatórios!')
            }
        }

        const results = await Chef.create(req.body)
        const chefId = results.rows[0].id

        return res.redirect(`/admin/chefs/${chefId}`)
    },
    async show(req, res) {
        const results = await Chef.find(req.params.id)
        const resultsRecipes = await Chef.findRecipesByChef(req.params.id)
        const recipes = resultsRecipes.rows
        let chef = results.rows[0]

        if (!chef) return res.send('Chef não encontrado!')

        chef = {
            ...chef,
            recipes
        }

        return res.render('admin/chef/show', { chef })
    },
    async edit(req, res) {
        const results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chef não encontrado!')

        return res.render('admin/chef/edit', { chef })
        
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Todos os campos são obrigatórios!')
            }
        }

        await Chef.update(req.body)

        return res.redirect(`/admin/chefs/${req.body.id}`)
    
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    }
}