const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')
const File = require('../models/File')

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

        if (!req.file)
            return res.send('Selecione uma foto de avatar')
            
        let results = await File.create({ ...req.file })
        const fileId = results.rows[0].id

        results = await Chef.create(req.body, fileId)
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
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chef não encontrado!')

        results = await Chef.file(chef.file_id)
        let file = results.rows[0]
        file = {
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }

        return res.render('admin/chef/edit', { chef, avatar: file })
        
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Todos os campos são obrigatórios!')
            }
        }

        // add new avatar
        if (req.file) {
            const newAvatar = await File.create({ ...req.file })
            const newAvatarId = newAvatar.rows[0].id

            await Chef.create(req.body, newAvatarId)
        }

        await Chef.update(req.body)

        return res.redirect(`/admin/chefs/${req.body.id}`)
    
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    }
}

// Edição de imagem de chef