const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == '') {
            return {
                user: body,
                error: 'Todos os campos são obrigatórios'
            }
        }
    }
}

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
        return res.render(`admin/profile/index`, fillAllFields)
    }

    let { id, email, password } = req.body

    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if(!passed) return res.render('admin/profile/index', {
        user: req.body,
        error: 'Senha incorreta.'
    })

    const users = await User.all()
    const blocked = users.rows.find(user => (user.id != id && user.email == email))

    if (blocked) {
        return res.render('admin/profile/index', {
                user,
                error: 'Já existe um usuário com este email'
        })
    }

    req.user = user

    next()
}

module.exports = {
    update
}