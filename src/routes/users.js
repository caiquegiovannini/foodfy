const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')
const  { onlyUsers, onlyAdmin, canNotDeleteOwnAccount } = require('../app/middlewares/session')

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyUsers, UserController.list) // Mostrar a lista de usuários cadastrados
routes.get('/register', onlyAdmin, UserController.registerForm)
routes.get('/:id/edit', onlyAdmin, UserValidator.edit, UserController.edit)

routes.post('/register', UserValidator.post, UserController.post) // Cadastrar um usuário
routes.put('/', UserValidator.update, UserController.put) // Editar um usuário
routes.delete('/', canNotDeleteOwnAccount, UserController.delete) // Deletar um usuário

// Login / logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// Forgot / reset password
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)

routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes