const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Recipe_File = require('../models/Recipe_File')
const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const user = await User.findOne({ where: {id: req.session.userId} })

            let results = await Recipe.all()
            let recipes = results.rows
    
            // If user is not admin, show only your own recipes
            if (!user.is_admin) {
                const userRecipesPromise = recipes.filter(recipe => {
                    return recipe.user_id == user.id
                })
                
                recipes = await Promise.all(userRecipesPromise)
            }
    
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
    
            return res.render('admin/recipe/index', { recipes: newRecipes })

        } catch(err) {
            console.error(err)
        }
    },
    async create(req, res) {
        const results = await Recipe.chefSelectOptions()
        const chefOptions = results.rows

        return res.render('admin/recipe/create', { chefOptions })

    },
    async post(req, res) {
        try {
            const data = {
                ...req.body,
                user_id: req.session.userId
            }
    
            let results = await Recipe.create(data)
            const recipeId = results.rows[0].id
    
            const filesPromise = req.files.map(file => File.create({ ...file }))
            const files = await Promise.all(filesPromise)
            
            const recipeFilesPromise = files.map(file => Recipe_File.create(recipeId, file.rows[0].id))
            await Promise.all(recipeFilesPromise)
    
            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch(err) {
            console.error(err)
        }
    },
    async show(req, res) {
        try {
            const { recipe } = req

            //get images
            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
    
            return res.render(`admin/recipe/show`, { recipe, files })

        } catch(err) {
            console.error(err)
        }
    },
    async edit(req, res) {
        try {
            const { recipe } = req

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

        } catch(err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
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

        } catch(err) {
            console.error(err)
        }
    },
    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id)

            return res.redirect('/admin/recipes')

        } catch(err) {
            console.error(err)
        }
    }
}
