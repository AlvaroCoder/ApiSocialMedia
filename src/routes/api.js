const router = require("express").Router()
const author = require("./author")

router.use("/author",author)

module.exports = router;