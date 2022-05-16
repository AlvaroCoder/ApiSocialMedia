const router = require("express").Router()
const author = require("./author")
const post = require("./post")

router.use("/author",author)
router.use("/post",post)

module.exports = router;