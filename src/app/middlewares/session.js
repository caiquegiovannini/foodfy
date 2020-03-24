const User = require('../models/User')
const Recipe = require('../models/Recipe')

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

    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    results = await Recipe.files(recipe.id)
    let files = results.rows
    files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    if (!user.is_admin && user.id != recipe.user_id)
        return res.render('admin/recipe/show', {
            recipe,
            files,
            error: 'Você não tem permissão para editar esta receita!'
        })

    next()
}

async function canNotDeleteOwnAccount(req, res, next) {
    const results = await User.all()
    const users = results.rows

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