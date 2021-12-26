const router = require('express').Router();
const {getFileStream } = require('../Middleware/up_down_image_s3');

router.get('/get', (req, res) => {
    console.log("---***********--------**********----------");
    console.log(req.query.key);
    const key = req.query.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
    console.log("---***********--------**********----------");
  })

module.exports = router;