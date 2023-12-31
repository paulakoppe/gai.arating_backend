const knex = require("../database/knex")


class BooksController {
    async create(request, response){
        const {title, rate, tags, links} = request.body;
        const  user_id  = request.user.id;

        const [book_id] = await knex("books").insert({
            title,
            rate,
            user_id
        });

        if(links.length>0){
        const linksInsert = links.map(link => {
            return{
                book_id,
                url: link
            }
        });

        await knex("links").insert(linksInsert)
        }
        if(tags.length > 0){
        const tagsInsert = tags.map(name => {
            return{
                book_id,
                name,
                user_id
            }
        });

        await knex("tags").insert(tagsInsert)
    }
        return response.json();
    }

    async show(request, response){
        const { id } = request.params;

        const book = await knex("books").where({ id }).first();
        const tags = await knex("tags").where({ book_id: id }).orderBy("name")
        const links = await knex("links").where({ book_id: id }).orderBy("created_at")

        return response.json({
            ...book,
            tags,
            links,
        })
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("books").where({ id }).delete();

        return response.json();
    }

    async index(request, response){
        const { title, tags } = request.query;
        const user_id = request.user.id;

        let books;

        if(tags){
            const filterTags = tags.split(",").map(tag => tag.trim());
            books = await knex('tags')
            .select([
                'books.id',
                'books.title',
                'books.user_id'
            ])
            .where("books.user_id", user_id)
            .whereLike("books.title",`%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("books", "books.id", "tags.book_id")
            .groupBy("books.id")
            .orderBy("books.title")

        }else{
         books = await knex("books")
        .where({user_id})
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }

        const userTags = await knex("tags").where({ user_id })

        const booksWithTags = books.map(book => {
            const bookTags = userTags.filter(tag => tag.book_id === book.id)

            return{
                ...book,
                tags: bookTags
            }
        })

        return response.json(booksWithTags)

    }
}

module.exports = BooksController