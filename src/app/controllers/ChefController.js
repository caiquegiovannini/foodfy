const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        try {
            const results = await Chef.all()
            let chefs = results.rows
            chefs = chefs.map(chef => ({
                    ...chef,
                    path: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "").replace("\\images\\", "/images/")}`
                }))
    
            return res.render('admin/chef/index', { chefs })

        } catch(err) {
            console.error(err)
        }
    },
    create(req, res) {
        return res.render('admin/chef/create')

    },
    async post(req, res) {
        try {
            let results = await File.create({ ...req.file })
            const fileId = results.rows[0].id
    
            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id
    
            return res.redirect(`/admin/chefs/${chefId}`)

        } catch(err) {
            console.error(err)
        } 
    },
    async show(req, res) {
        try {
            let { chef } = req

            const resultsRecipes = await Chef.findRecipesByChef(req.params.id)
            let recipes = resultsRecipes.rows
            
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
            recipes = await Promise.all(filesPromise)
    
            chef = {
                ...chef,
                path: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "").replace("\\images\\", "/images/")}`,
                recipes
            }
    
            return res.render('admin/chef/show', { chef })

        } catch(err) {
            console.error(err)
        }      
    },
    async edit(req, res) {
        try {
            let { chef } = req
    
            results = await Chef.file({ where: {id: chef.file_id} })
            let file = results.rows[0]
            file = {
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\images\\", "/images/")}`
            }
    
            return res.render('admin/chef/edit', { chef, avatar: file })

        } catch(err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            let removedFiles = req.body.removed_files
    
            if (req.file) {
                if (removedFiles != '') {
                    removedFiles = req.body.removed_files.split(",")
                    const lastIndex = removedFiles.length - 1
                    removedFiles.splice(lastIndex, 1)
    
                } else {
                    let results = await Chef.find(req.body.id)
                    const chef = results.rows[0]
        
                    results = await Chef.file({ where: {id: chef.file_id}})
                    const oldAvatar = results.rows[0]
                    removedFiles = [oldAvatar.id]
                }
    
                // add new avatar
                let results = await File.create({ ...req.file })
                const newAvatarId = results.rows[0].id
                await Chef.update(req.body, newAvatarId)
    
                // remove old avatar
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
    
            } else {
                await Chef.update(req.body)
    
            }
            
            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch(err) {
            console.error(err)
        }
    },
    async delete(req, res) {
        try {
            const { chef, avatar } = req.chef

            await Chef.delete(chef.id, avatar)

            return res.redirect('/admin/chefs')

        } catch(err) {
            console.error(err)
        }
    }
}