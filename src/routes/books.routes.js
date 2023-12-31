const { Router } = require('express')
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const BooksController = require('../controllers/BooksController')

const bookRoutes = Router()

const booksController = new BooksController()

bookRoutes.use(ensureAuthenticated)

bookRoutes.get('/', booksController.index)
bookRoutes.post('/', booksController.create)
bookRoutes.get("/:id", booksController.show)
bookRoutes.delete("/:id", booksController.delete)

module.exports = bookRoutes