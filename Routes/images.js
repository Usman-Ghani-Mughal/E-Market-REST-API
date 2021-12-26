const router = require('express').Router();
const {getFileStream } = require('../Middleware/up_down_image_s3');

router.get('/get/:key', (req, res) => {
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
  })

module.exports = router;