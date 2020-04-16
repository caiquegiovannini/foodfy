const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const File = require('./src/app/models/File')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const Recipe_File = require('./src/app/models/Recipe_File')

let totalUsers = 2
let usersIds = []
let totalChefs = 4
let chefsId = []
let totalRecipes = 10

async function createUsers() {
    let users = []
    const password = await hash('123', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
        })
    }

    users[0].is_admin = true
    users[1].is_admin = false

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)

}

async function createChefs() {
    let chefs = []

    while (chefs.length < totalChefs) {
        let fileId = await File.create({
            name: faker.image.avatar(),
            path: `public/images/placeholder.png`
        })

        let chefId = await Chef.create({
            name: faker.name.firstName(),
            file_id: fileId
        })

        chefs.push(chefId)
        chefsId.push(chefId)
    }
}

async function createRecipes() {
    let recipes = []
    let files = []

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id: chefsId[Math.floor(Math.random() * totalChefs)],
            title: faker.name.title(),
            ingredients: faker.lorem.paragraph(1).split(' '),
            preparation: faker.lorem.paragraph(1).split(' '),
            information: faker.lorem.paragraph(Math.floor(Math.random() * 10)),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)]
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    const recipesId = await Promise.all(recipesPromise)

    while (files.length < 50) {
        let fileId = await File.create({
            name: faker.image.image(),
            path: `public/images/placeholder.png`
        })

        await Recipe_File.create({
            recipe_id: recipesId[Math.floor(Math.random() * totalRecipes)],
            file_id: fileId
        })


        files.push(fileId)
    }
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()