const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Recipe_File = require('../models/Recipe_File')
const User = require('../models/User')
const Chef = require('../models/Chef')

const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
    async index(req, res) {
        try {
            const user = await User.findOne({ where: {id: req.session.userId} })

            let recipes = await LoadRecipeService.load('recipes')
    
            // If user is not admin, show only your own recipes
            if (!user.is_admin) {
                recipes = await LoadRecipeService.load('recipes', { where: {user_id: req.session.userId} })
            }
    
            return res.render('admin/recipe/index', { recipes })

        } catch(err) {
            console.error(err)
        }
    },
    async create(req, res) {
        const chefs = await Chef.findAll()

        return res.render('admin/recipe/create', { chefs })

    },
    async post(req, res) {
        try {
            const {
                chef,
                title,
                ingredients,
                preparation,
                information
            } = req.body

            const { userId } = req.session

            const recipeId = await Recipe.create({
                chef_id: chef,
                title,
                ingredients,
                preparation,
                information,
                user_id: userId
            })
    
            const filesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path }))
            const files = await Promise.all(filesPromise)

            const recipeFilesPromise = files.map(file => Recipe_File.create({ recipe_id: recipeId, file_id: file }))
            await Promise.all(recipeFilesPromise)
    
            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch(err) {
            console.error(err)
        }
    },
    async show(req, res) {
        try {
            const { recipe } = req
    
            return res.render(`admin/recipe/show`, { recipe })

        } catch(err) {
            console.error(err)
        }
    },
    async edit(req, res) {
        try {
            const { recipe } = req
            const chefs = await LoadChefService.load('chefs')
 
            return res.render('admin/recipe/edit', { recipe, chefs })

        } catch(err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            // add new images
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path }))
                const newFiles = await Promise.all(newFilesPromise)
    
                const newRecipeFilesPromise = newFiles.map(file => Recipe_File.create({ recipe_id: req.body.id, file_id: file }))
                await Promise.all(newRecipeFilesPromise)
            }
    
            // remove images
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(async id => {
                    try {
                        const filePath = await File.findOne({ where: {id} })
                        unlinkSync(filePath.path)
                        
                        File.delete(id)
                    } catch (error) {
                        console.error(error)
                    }
                })
    
                await Promise.all(removedFilesPromise)
            }

            await Recipe.update({
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information,
                id: req.body.id
            })
    
            return res.redirect(`/admin/recipes/${req.body.id}`)

        } catch(err) {
            console.error(err)
        }
    },
    async delete(req, res) {
        try {
            const files = await Recipe.files(req.body.id)

            await Recipe.delete(req.body.id)

            files.map(file => {
                try {
                    unlinkSync(file.path)
                    
                } catch (error) {
                    console.error(error)
                }
            })

            return res.redirect('/admin/recipes')

        } catch(err) {
            console.error(err)
        }
    }
}
