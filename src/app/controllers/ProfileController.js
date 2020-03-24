const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const user = await User.findOne({ where: {id: req.session.userId} })

            return res.render('admin/profile/index', { user })

        } catch(err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            let { user } = req
            const { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.render('admin/profile/index', {
                user: req.body,
                success: 'Perfil atualizado com sucesso!'
            })
        } catch(err) {
            console.error(err)
            return res.render('admin/profile/index', {
                error: "Ocorreu um erro"
            })
        }
    }
}