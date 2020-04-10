const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

const User = require('../models/User')

module.exports = {
    loginForm(req, res) {

        return res.render('admin/session/login')
    },
    async login(req, res) {
        try {
            req.session.userId = req.user.id

            const user = await User.findOne({ where: {id: req.session.userId} })
    
            if (user.is_admin) {
                return res.redirect('/admin/users')
    
            } else {
                return res.redirect('/admin/profile')
    
            }
        } catch(err) {
            console.error(err)
        }
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect('/admin/users/login')
    },
    forgotForm(req, res) {

        return res.render('admin/session/forgot-password')
    },
    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Recuperação de senha',
                html: `<h1>FOODFY</h1>
                <h2>Quer recuperar sua senha?</h2>
                <p>É fácil, basta clicar no link abaixo para definir uma nova senha</p>
                <p>
                    <a href="http://localhost:3000/admin/users/password-reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })

            return res.render('admin/session/forgot-password', {
                user: req.body,
                success: 'Verifique seu email para recuperar sua senha!'
            })
        } catch(err) {
            console.error(err)
            return res.render('admin/session/forgot-password', {
                error: 'Erro inesperado, tente novamente!'
            })
        }
    },
    resetForm(req, res) {

        return res.render('admin/session/password-reset', { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user

        const { password, token } = req.body

        try {
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            })

            return res.render('admin/session/login', {
                user: req.body,
                success: 'Senha atualizada! Faça o seu login.'
            })
        } catch(err) {
            console.error(err)
            return res.render('admin/session/password-reset', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente!'
            })
        }
    }
}