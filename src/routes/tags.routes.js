const { Router } = require('express')
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")


const TagsController = require('../controllers/TagsController')

const tagsRoutes = Router()

const tagsController = new TagsController()

tagsRoutes.get('/',ensureAuthenticated , tagsController.index);
tagsRoutes.delete("/", tagsController.delete);


module.exports = tagsRoutes