const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async create(fields) {
        const query = `
        INSERT INTO recipes (
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            user_id
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `

        const values = [
            fields.chef_id,
            fields.title,
            fields.ingredients,
            fields.preparation,
            fields.information,
            fields.user_id
        ]

        const results = await db.query(query, values)
        return results.rows[0].id
    },
    update(fields) {
        const query = `UPDATE recipes SET
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `
        const values = [
            fields.chef_id,
            fields.title,
            fields.ingredients,
            fields.preparation,
            fields.information,
            fields.id
        ]

        return db.query(query, values)
    },
    async paginate(params) {
        const { filter, limit, offset } = params

        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`

        if ( filter ) {
            filterQuery = `${query}
            WHERE recipes.title ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT *, ${totalQuery}
        FROM recipes
        ${filterQuery}
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `

        const results = await db.query(query, [limit, offset])
        return results.rows
    },
    async files(id) {
        const results = await db.query(`
            SELECT files.* FROM files
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            WHERE recipe_files.file_id = files.id
            AND recipe_files.recipe_id = $1
        `, [id])

        return results.rows
    }
}