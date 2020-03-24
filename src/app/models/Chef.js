const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    all() {
        return db.query(`SELECT chefs.*, count(recipes) AS total_recipes, files.path
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        LEFT JOIN files ON (files.id = chefs.file_id)
        GROUP BY chefs.id, files.path
        ORDER BY chefs.name`)
    },
    create(data, file_id) {
        const query = `
        INSERT INTO chefs (
            name,
            file_id
        ) VALUES ($1, $2)
        RETURNING id
        `

        const values = [
            data.name,
            file_id
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes, files.path
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            LEFT JOIN files ON (files.id = chefs.file_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id, files.path
            `, [id])
    },
    findRecipesByChef(id) {
        return db.query(`
            SELECT recipes.*
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE chef_id = $1
            ORDER BY created_at DESC
        `, [id])
    },
    update(data, file_id) {
        let values = []
        let query = `UPDATE chefs SET
            name = $1
        `

        if (file_id) {
            query = `${query},
                file_id = $2
            WHERE id = $3
            `

            values = [
                data.name,
                file_id,
                data.id
            ]

        } else {
            query = `${query}
            WHERE id = $2
            `

            values = [
                data.name,
                data.id
            ]
        }

        return db.query(query, values)
    },
    async delete(chef_id, file) {
        try {
            fs.unlinkSync(file.path)

            await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
    
            return db.query(`DELETE FROM chefs WHERE id=$1`, [chef_id])

        } catch(err) {
            console.error(err)
        }
    },
    file(filters) {
        let query = 'SELECT * FROM files'

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}`

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        return db.query(query)
    }
}