const User = require('../models/User')
const Recipe = require('../models/Recipe')

const LoadRecipeService = require('../services/LoadRecipeService')

function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/users/login')

    next()
}

async function onlyAdmin(req, res, next) {
    const user = await User.findOne({ where: {id: req.session.userId} })

    if (!user.is_admin)
        return res.render('admin/profile/index', {
            user,
            error: 'Você não tem permissão para fazer isso!'
        })

    next()
}

async function onlyWhoCreatedOrAdmin(req, res, next) {
    const user = await User.findOne({ where: {id: req.session.userId} })

    const recipe = await LoadRecipeService.load('recipe', { where: {id: req.params.id}})

    if (!user.is_admin && user.id != recipe.user_id)
        return res.render('admin/recipe/show', {
            recipe,
            files,
            error: 'Você não tem permissão para editar esta receita!'
        })

    next()
}

async function canNotDeleteOwnAccount(req, res, next) {
    const users = await User.findAll()

    if (req.session.userId == req.body.id) return res.render('admin/user/index', {
        users,
        error: 'Não é possível deletar sua própria conta.'
    })

    next()
}

async function userIsAdmin(req, res, next) {
    try {
        if (req.session.userId) {
            const user = await User.findOne({ where: {id: req.session.userId} })

            if (user.is_admin) res.locals.userIsAdmin = true
        }

        next()
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    onlyUsers,
    onlyAdmin,
    onlyWhoCreatedOrAdmin,
    canNotDeleteOwnAccount,
    userIsAdmin
}