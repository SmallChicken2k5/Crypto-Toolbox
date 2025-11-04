const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/tool.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get('/caesar', controller.caesar);
router.post('/caesar/process', upload.single('file'), controller.caesarProcess);

router.get('/vigenere', controller.vigenere);
router.post('/vigenere/process', upload.single('file'), controller.vigenereProcess);

router.get('/playfair', controller.playfair);
router.post('/playfair/process', upload.single('file'), controller.playfairProcess);
module.exports = router;