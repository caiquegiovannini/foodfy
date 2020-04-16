const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { unlinkSync } = require('fs')

const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

const emailMessage = (password) => `
    <h1>FOODFY</h1>
    <h2>Senha de acesso</h2>
    <p>Sua senha de usuário no site Foodfy é: <span style="font-weight: bold">${password}</span></p>
`

module.exports = {
    async list(req, res) {
        try {
            const user = await User.findOne({ where: {id: req.session.userId}})
        
            const users = await User.findAll()

            if (user.is_admin) {
                return res.render('admin/user/index', { users })

            } else {
                return res.render('admin/profile/index', { user })

            }
        } catch(err) {
            console.error(err)
        }
    },
    registerForm(req, res) {
        
        return res.render('admin/user/register')
    },
    async post(req, res) {
        try {
            let { name, email, is_admin = false } = req.body

            const password = crypto.randomBytes(5).toString('hex')
            const passwordHash = await hash(password, 8)
    
            await User.create({
                name,
                email,
                password: passwordHash,
                is_admin
            })
    
            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com',
                subject: 'Senha de acesso',
                html: emailMessage(password)
            })
    
            return res.render('admin/user/edit', {
                user: req.body,
                success: 'Um email foi enviado ao novo usuário!'
            })
        } catch(err) {
            console.error(err)
        }
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
                ...req.body,
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
            let recipes = await Recipe.findAll({ where: {user_id: req.body.id} })

            const recipeFilesPromise = recipes.map(recipe =>
                Recipe.files(recipe.id)
            )

            let recipeFiles = await Promise.all(recipeFilesPromise)

            await User.delete(req.body.id)

            recipeFiles.map(files => {
                files.map(file => {
                    try {
                        File.delete(file.id)

                        unlinkSync(file.path)
                    } catch (error) {
                        console.error(error)
                    }
                })
            })

            const users = await User.findAll()

            return res.render('admin/user/index', {
                users,
                success: "Usuário deletado com sucesso!"
            })

        } catch(err) {
            console.error(err)
            const users = await User.findAll()
            return res.render('admin/user/index', {
                users,
                error: "Erro ao tentar deletar um usuário!"
            })
        }
    }
}