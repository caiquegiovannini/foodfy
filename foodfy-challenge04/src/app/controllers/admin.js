const { date } = require('../../lib/utils')
const db = require('../../config/db')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        Recipe.all(function(recipes) {
        return res.render('admin/index', { recipes })
        })

    },
    create(req, res) {
        Recipe.chefSelectOptions(function(options) {
            return res.render('admin/create', { chefOptions: options })
        })

    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (key != 'information' && req.body[key] == "") {
                return res.send('Os campos com * são obrigatórios!')
            }
        }
    
        Recipe.create(req.body, function(recipe) {
            return res.redirect(`/admin/recipes`)
        })
    },
    show(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Receita não encontrada!')

            return res.render(`admin/show`, { recipe })
        })
    },
    edit(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Receita não encontrada!')

            Recipe.chefSelectOptions(function(options) {
                return res.render('admin/edit', { recipe, chefOptions: options })
            })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (key != 'information' && req.body[key] == "") {
                return res.send('Os campos com * são obrigatórios!')
            }
        }
        
        Recipe.update(req.body, function(recipe) {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res) {
        Recipe.delete(req.body.id, function(recipe) {
            return res.redirect('/admin/recipes')
        })
    },   
    chefs(req, res) {

        Chef.allChefs(function(chefs) {
            return res.render('admin/chef/chefs', { chefs })
        })
        
    },
    createChef(req, res) {
        return res.render('admin/chef/create')
    },
    postChef(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Todos os campos são obrigatórios!')
            }
        }

        Chef.createChef(req.body, function(chef) {
            // return res.redirect(`/admin/chefs/${chef.id}`)
            return res.redirect(`/admin/chefs`)
        })
        
    },
    showChef(req, res) {
        Chef.findChef(req.params.id, function(chef) {
            if (!chef) return res.send('Chef não encontrado!')

            Chef.findRecipesByChef(req.params.id, function(recipes) {
                chef = {
                    ...chef, 
                    recipes: [...recipes]
                }
                return res.render('admin/chef/show', { chef } )
            })
        })
    },
    editChef(req, res) {
        Chef.findChef(req.params.id, function(chef) {
            if (!chef) return res.send('Chef não encontrado!')

            return res.render('admin/chef/edit', { chef })
        })
    },
    putChef(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Todos os campos são obrigatórios!')
            }
        }

        Chef.updateChef(req.body, function(chef) {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    deleteChef(req, res) {
        Chef.deleteChef(req.body.id, function(chef) {
            return res.redirect('/admin/chefs')
        })
    }
}
