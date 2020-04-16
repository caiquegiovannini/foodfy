const Recipe = require('../app/models/Recipe')

module.exports = {
    async paginate(query) {
        let { page, limit, filter } = query
        
        page = page || 1
        limit = limit || 3
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset
        }

        let recipes = await Recipe.paginate(params)
        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        return { recipes, pagination }
    }
}