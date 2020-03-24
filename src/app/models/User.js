const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')

const Recipe = require('../models/Recipe')

module.exports = {
    all() {
        return db.query(`
            SELECT * FROM users
            ORDER BY created_at DESC
        `)
    },
    async findOne(filters) {
        let query = 'SELECT * FROM users'

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}`

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },
    async create(data) {
        const query = `
        INSERT INTO users (
            name,
            email,
            password,
            is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
        `

        const passwordHash = await hash(data.password, 8)

        const values = [
            data.name,
            data.email,
            passwordHash,
            data.is_admin || false
        ]

        return db.query(query, values)
    },
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