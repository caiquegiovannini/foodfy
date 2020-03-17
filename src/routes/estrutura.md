# Session

## login/logout
- routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
- routes.post('/login', SessionValidator.login, SessionController.login)
- routes.post('/logout', SessionController.logout)

## reset password
- routes.get('/forgot-password', SessionController.forgotForm)
- routes.get('/password-reset', SessionController.resetForm)
- routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
- routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

---

# User
- só poderá cadastrar novas receitas
- poderá editar as receitas criadas por ele mesmo

---

# Songs
- night vision - runaway (feat dave maverick)
- dark smoke signal - december rose
- robert parker - '85 again (feat miss k)