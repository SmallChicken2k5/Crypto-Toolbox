const path = require('path');
const caesar = require('../../helpers/caesar');
const vigenere = require('../../helpers/vigenere');
const playfair = require('../../helpers/playfair');
// [GET] /caesar
module.exports.caesar = async (req, res) => {
    res.render('client/pages/tools/caesar', {
        title: 'Caesar Cipher',
        formData: { text: '', key: '', mode: 'encrypt' },
        result: null
    });
};

// [POST] /caesar/process
module.exports.caesarProcess = async (req, res) => {
    try {
        const bodyText = req.body.text || '';
        const uploadText = req.file ? req.file.buffer.toString('utf8') : '';
        const text = uploadText || bodyText;

        const mode = req.body.mode === 'decrypt' ? 'decrypt' : 'encrypt';
        const key = caesar.normalizeKey(req.body.key);

        let result = mode === 'encrypt' ? caesar.encrypt(text, key) : caesar.decrypt(text, key);

        // Tải file kết quả nếu người dùng chọn "download"
        if (req.body.download === '1') {
            const filename = `caesar-${mode}-k${key}.txt`;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.send(result);
        }

        req.flash('success', 'Xử lý thành công');
        return res.render('client/pages/tools/caesar', {
            title: 'Caesar Cipher',
            formData: { text, key, mode },
            result
        });
    } catch (e) {
        req.flash('error', 'Có lỗi xảy ra');
        return res.render('client/pages/tools/caesar', {
            title: 'Caesar Cipher',
            formData: { text: req.body.text || '', key: req.body.key || '', mode: req.body.mode || 'encrypt' },
            result: null
        });
    }
};

// [GET] /tool/vigenere
module.exports.vigenere = async (req, res) => {
  res.render('client/pages/tools/vigenere', {
    title: 'Vigenère Cipher',
    formData: { text: '', key: '', mode: 'encrypt' },
    result: null
  });
};

// [POST] /tool/vigenere/process
module.exports.vigenereProcess = async (req, res) => {
  try {
    const bodyText = req.body.text || '';
    const uploadText = req.file ? req.file.buffer.toString('utf8') : '';
    const text = uploadText || bodyText;

    const mode = req.body.mode === 'decrypt' ? 'decrypt' : 'encrypt';
    const key = vigenere.normalizeKey(req.body.key);

    if (!key) {
      req.flash('error', 'Khóa không hợp lệ. Vui lòng nhập chuỗi A-Z.');
      return res.render('client/pages/tools/vigenere', {
        title: 'Vigenère Cipher',
        formData: { text, key: req.body.key || '', mode },
        result: null
      });
    }

    const result = mode === 'encrypt' ? vigenere.encrypt(text, key) : vigenere.decrypt(text, key);

    if (req.body.download === '1') {
      const filename = `vigenere-${mode}-k${key}.txt`;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(result);
    }

    req.flash('success', 'Xử lý thành công');
    return res.render('client/pages/tools/vigenere', {
      title: 'Vigenère Cipher',
      formData: { text, key, mode },
      result
    });
  } catch (e) {
    req.flash('error', 'Có lỗi xảy ra');
    return res.render('client/pages/tools/vigenere', {
      title: 'Vigenère Cipher',
      formData: { text: req.body.text || '', key: req.body.key || '', mode: req.body.mode || 'encrypt' },
      result: null
    });
  }
};

// [GET] /tool/playfair
module.exports.playfair = async (req, res) => {
  res.render('client/pages/tools/playfair', {
    title: 'Playfair Cipher',
    formData: { text: '', key: '', mode: 'encrypt' },
    result: null
  });
};

// [POST] /tool/playfair/process
module.exports.playfairProcess = async (req, res) => {
  try {
    const bodyText = req.body.text || '';
    const uploadText = req.file ? req.file.buffer.toString('utf8') : '';
    const text = uploadText || bodyText;

    const mode = req.body.mode === 'decrypt' ? 'decrypt' : 'encrypt';
    const key = playfair.normalizeKey(req.body.key);

    if (!key) {
      req.flash('error', 'Khóa không hợp lệ. Vui lòng nhập chuỗi A-Z.');
      return res.render('client/pages/tools/playfair', {
        title: 'Playfair Cipher',
        formData: { text, key: req.body.key || '', mode },
        result: null
      });
    }

    const result = mode === 'encrypt' ? playfair.encrypt(text, key) : playfair.decrypt(text, key);

    if (req.body.download === '1') {
      const filename = `playfair-${mode}-k${key}.txt`;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(result);
    }

    req.flash('success', 'Xử lý thành công');
    return res.render('client/pages/tools/playfair', {
      title: 'Playfair Cipher',
      formData: { text, key, mode },
      result
    });
  } catch (e) {
    req.flash('error', 'Có lỗi xảy ra');
    return res.render('client/pages/tools/playfair', {
      title: 'Playfair Cipher',
      formData: { text: req.body.text || '', key: req.body.key || '', mode: req.body.mode || 'encrypt' },
      result: null
    });
  }
};