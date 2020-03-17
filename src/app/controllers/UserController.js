const User = require('../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    async list(req, res) {
        const results = await User.all()
        const users = results.rows

        return res.render('admin/user/index', { users })
    },
    registerForm(req, res) {
        
        return res.render('admin/user/register')
    },
    async post(req, res) {
        const password = crypto.randomBytes(5).toString('hex')

        req.body.password = password

        await User.create(req.body)

        await mailer.sendMail({
            to: req.body.email,
            from: 'no-reply@foodfy.com',
            subject: 'Senha de acesso',
            html: `
                <h1>FOODFY</h1>
                <h2>Senha de acesso</h2>
                <p>Sua senha de usuário no site Foodfy é: <span style="font-weight: bold">${password}</span></p>
            `
        })

        return res.render('admin/user/edit', {
            user: req.body,
            success: 'Um email foi enviado ao novo usuário!'
        })
    },
    async edit(req, res) {
        let { user } = req

        return res.render('admin/user/edit', { user })
    },
    async put(req, res) {
        try {
            let { user } = req
            let { name, email, is_admin } = req.body

            if (is_admin) {
                is_admin = true
            } else {
                is_admin = false
            }

            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            user = {
                ...user,
                is_admin
            }

            return res.render('admin/user/edit', {
                user,
                success: 'Usuário atualizado com sucesso!'
            })

        } catch(err) {
            console.error(err)
            return res.render('admin/user/index', {
                error: "Ocorreu um erro"
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)

            const results = await User.all()
            const users = results.rows

            return res.render('admin/user/index', {
                users,
                success: "Usuário deletado com sucesso!"
            })

        } catch(err) {
            console.error(err)
            const results = await User.all()
            const users = results.rows
            return res.render('admin/user/index', {
                users,
                error: "Erro ao tentar deletar um usuário!"
            })
        }
    }
}