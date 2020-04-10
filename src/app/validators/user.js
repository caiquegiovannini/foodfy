const User = require('../models/User')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == '') {
            return {
                user: body,
                error: 'Os campos com * são obrigatórios!'
            }
        }
    }
}

async function post(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
        return res.render('admin/user/register', fillAllFields)
    }

    const { email } = req.body

    const user = await User.findOne({ 
        where: { email }
    })

    if (user)
        return res.render('admin/user/register', {
            user: req.body,
            error: 'Esse usuário já existe'
        })

    next()
}

async function edit(req, res, next) {
    const { id } = req.params

    const user = await User.findOne({
        where: { id }
    })

    if (!user) {
        const results = await User.all()
        const users = results.rows

        return res.render('admin/user/index', {
            users,
            error: "Usuário não encontrado!"
        })
    }

    req.user = user

    next()
}

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
        return res.render(`admin/user/edit`, fillAllFields)
    }

    let { id, email } = req.body

    let user = await User.findOne({ where: {id} })
    const users = await User.all()
    const blocked = users.rows.find(user => (user.id != id && user.email == email))

    if (blocked) {
        return res.render('admin/user/edit', {
                user,
                error: 'Já existe um usuário com este email'
        })
    }

    req.user = user

    next()
}

module.exports = {
    post,
    edit,
    update
}