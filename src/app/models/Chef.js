const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async file(filters) {
        let query = 'SELECT * FROM files'

        Object.keys(filters).map(key => {
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    }
}