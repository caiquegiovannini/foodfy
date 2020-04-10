const Recipe = require('../models/Recipe')

async function getImages(recipeId) {
    let files = await Recipe.files(recipeId);
    files = files.map((file) => ({
      ...file,
      src: `${file.path.replace("public", "")}`,
    }));
  
    return files;
}

const LoadService = {
    load(service, filter) {
        this.filter = filter

        return this[service]()
    },
    recipe(){
        try {
            
        } catch (error) {
            console.error(erro)
        }
    },
    recipes(){}
}

module.exports = LoadService