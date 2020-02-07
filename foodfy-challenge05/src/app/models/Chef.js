const db = require('../../config/db')
const { date } = require('../../lib/utils')

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
            created_at,
            file_id
        ) VALUES ($1, $2, $3)
        RETURNING id
        `

        const values = [
            data.name,
            date(Date.now()),
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
        `, [id])
    },
    update(data, file_id) {
        const query = `UPDATE chefs SET
            name = $1,
            file_id = $2
        WHERE id = $3
        `

        const values = [
            data.name,
            file_id,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id=$1`, [id])
    },
    file(id) {
        return db.query(`
            SELECT * FROM files WHERE id = $1`, [id])
    }
}