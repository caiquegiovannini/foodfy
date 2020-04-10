const db = require('../../config/db')
const fs = require('fs')

const Base = require('./Base')
const Recipe = require('../models/Recipe')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    async update(id, fields) {
        let query = 'UPDATE users SET'

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)
        return
    },
    async delete(id) {
        let results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id])
        const recipes = results.rows

        const allFilesPromise = recipes.map(recipe => {
            Recipe.delete(recipe.id)
        })

        await Promise.all(allFilesPromise)

        await db.query('DELETE FROM users WHERE id = $1', [id])
    }
}