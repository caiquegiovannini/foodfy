const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

async function getImage(fileId) {
    let file = await Chef.file({ where: {id: fileId} });
    file = {
        ...file,
        path: `${file.path.replace("public", "").replace("\\images\\", "/images/")}`,
    }
    
      return file
}

async function format(chef) {
    const file = await getImage(chef.file_id)
    chef.path = file.path

    const recipes = await Recipe.findAll({ where: { chef_id: chef.id } })
    chef.total_recipes = recipes.length

    return chef
}

const LoadService = {
    load(service, filter) {
        this.filter = filter

        return this[service]()
    },
    async chef() {
        try {
            const chef = await Chef.findOne(this.filter)

            return format(chef)
            
        } catch (error) {
            console.error(erro)
        }
    },
    async chefs() {
        try {
            const chefs = await Chef.findAll(this.filter)
            const chefsPromise = chefs.map(format)

            return Promise.all(chefsPromise)
        } catch (error) {
            console.error(error)
        }
    },
    format
}

module.exports = LoadService