const router = require('express').Router();
const {getFileStream } = require('../Middleware/up_down_image_s3');

router.get('/get/:key', (req, res) => {
    console.log("---***********--------**********----------");
    console.log(req.params.key);
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
    console.log("---***********--------**********----------");
  })

module.exports = router;