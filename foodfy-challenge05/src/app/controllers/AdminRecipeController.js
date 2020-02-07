const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Recipe_File = require('../models/Recipe_File')

module.exports = {
    async index(req, res) {
        let results = await Recipe.all()
        let recipes = results.rows

        const filesPromise = recipes.map(async recipe => {
            results = await Recipe.files(recipe.id)
            let file = results.rows[0]
            file = {
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }
            recipe = {
                ...recipe,
                file
            }
        })
        await Promise.all(filesPromise)
        
        console.log(filesPromise) // colocar as miniaturas no recipes index

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

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file }))
        const files = await Promise.all(filesPromise)
        
        const recipeFilesPromise = files.map(file => Recipe_File.create(recipeId, file.rows[0].id))
        await Promise.all(recipeFilesPromise)

        return res.redirect(`/admin/recipes/${recipeId}`)
    
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]
        
        if (!recipe) return res.send('Receita não encontrada!')

        //get images
        results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render(`admin/recipe/show`, { recipe, files })
    },
    async edit(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada!')

        //get images
        results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        //get chefs
        results = await Recipe.chefSelectOptions()
        const chefOptions = results.rows

        return res.render('admin/recipe/edit', { recipe, chefOptions, files })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (key != 'information' && req.body[key] == "" && key != "removed_files") {
                return res.send('Os campos com * são obrigatórios!')
            }
        }

        // add new images
        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({ ...file }))
            const newFiles = await Promise.all(newFilesPromise)

            const newRecipeFilesPromise = newFiles.map(file => Recipe_File.create(req.body.id, file.rows[0].id))
            await Promise.all(newRecipeFilesPromise)
        }

        // remove images
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }
        
        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        await Recipe.delete(req.body.id)

        return res.redirect('/admin/recipes')
    }
}
