const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')

const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            const chefs = await LoadChefService.load('chefs')
    
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
            const { filename, path } = req.file
            const { name } = req.body

            const fileId = await File.create({ name: filename, path })
    
            const chefId = await Chef.create({ name, file_id: fileId })
    
            return res.redirect(`/admin/chefs/${chefId}`)

        } catch(err) {
            console.error(err)
        } 
    },
    async show(req, res) {
        try {
            let { chef } = req

            let recipes = await LoadRecipeService.load('recipes', { where: {chef_id: req.params.id} })
    
            chef = {
                ...chef,
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
    
            return res.render('admin/chef/edit', { chef })

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
                    const chef = await LoadChefService.load('chef', { where: {id: req.body.id} })
        
                    const oldAvatar = await Chef.file({ where: {id: chef.file_id}})
                    removedFiles = [oldAvatar.id]
                }
    
                // add new avatar
                const { filename, path } = req.file
                const newAvatarId = await File.create({ name: filename, path })

                await Chef.update(req.body.id, {
                    name: req.body.name,
                    file_id: newAvatarId       
                })
    
                // remove old avatar
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
    
            } else {
                await Chef.update(req.body.id, {
                    name: req.body.name     
                })
    
            }
            
            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch(err) {
            console.error(err)
        }
    },
    async delete(req, res) {
        try {
            const chef  = req.chef

            unlinkSync(`public/${chef.path}`)
            File.delete(chef.file_id)

            await Chef.delete(chef.id)

            return res.redirect('/admin/chefs')

        } catch(err) {
            console.error(err)
        }
    }
}