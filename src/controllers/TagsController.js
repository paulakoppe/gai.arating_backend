const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite")

class TagsController {
   async index(request, response) {
    const user_id = request.user.id;

    const tags = await knex("tags")
    .where({ user_id })
    .groupBy("name")

   return response.json(tags) 

   
}
   async delete(request, response) {
      const {  name  } = request.body;
      const database = await sqliteConnection();
      const result = await database.run('DELETE FROM tags WHERE name = ?', [name]);
    
      return response.status(200).json(result)
   }

 
}

module.exports = TagsController;