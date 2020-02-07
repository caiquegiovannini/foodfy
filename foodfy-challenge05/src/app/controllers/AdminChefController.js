const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        const results = await Chef.all()
        let chefs = results.rows
        chefs = chefs.map(chef => ({
                ...chef,
                path: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "").replace("\\images\\", "/images/")}`
            }))

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
        let results = await Chef.find(req.params.id)
        const resultsRecipes = await Chef.findRecipesByChef(req.params.id)
        let recipes = resultsRecipes.rows
        let chef = results.rows[0]

        if (!chef) return res.send('Chef não encontrado!')

        chef = {
            ...chef,
            path: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "").replace("\\images\\", "/images/")}`,
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
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\images\\", "/images/")}`
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
        console.log(req.body)
        
        // to change avatar
        if (req.file && req.body.removed_files != '') {
            if (req.body.removed_files) {
                var removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
            }

            // add new avatar
            let results = await File.create({ ...req.file })
            const newAvatarId = results.rows[0].id
            await Chef.update(req.body, newAvatarId)

            // remove old avatar
            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        } else {
            return res.send('Por favor, exclua o avatar atual antes de enviar um novo')
        }
        
        return res.redirect(`/admin/chefs/${req.body.id}`)
    
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    }
}