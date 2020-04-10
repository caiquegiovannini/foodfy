const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/ProfileController')

const ProfileValidator = require('../app/validators/profile')
const  { onlyUsers, onlyAdmin } = require('../app/middlewares/session')

// Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', ProfileValidator.update, ProfileController.put)// Editar o usuário logado

module.exports = routes