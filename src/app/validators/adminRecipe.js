const Recipe = require('../models/Recipe')

async function post(req, res, next) {
    let results = await Recipe.chefSelectOptions()
    const chefOptions = results.rows

    const keys = Object.keys(req.body)

    for (key of keys) {
        if (key != 'information' && req.body[key] == "") {
            return res.render('admin/recipe/create', {
                recipe: req.body,
                chefOptions,
                error: 'Os campos com * são obrigatórios!'
            })
        }
    }

    if (req.files.length == 0)
        return res.render('admin/recipe/create', {
            error: 'Envie pelo menos 1 foto'
        })

    next()
}
 // ARRUMAR VALIDATOR 

module.exports = {
    post
}