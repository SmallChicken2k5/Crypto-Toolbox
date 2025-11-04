// Playfair cipher (I/J gộp lại). Chỉ xử lý chữ cái, loại bỏ ký tự khác trong kết quả.
const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // không có J

function normalizeKey(input = '') {
  const up = (input || '').toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const seen = new Set();
  let res = '';
  for (const ch of up) {
    if (!seen.has(ch) && ALPHABET.includes(ch)) {
      seen.add(ch);
      res += ch;
    }
  }
  return res;
}

function buildMatrix(key) {
  const used = new Set(key.split(''));
  let seq = key;
  for (const ch of ALPHABET) if (!used.has(ch)) seq += ch;

  const matrix = Array.from({ length: 5 }, (_, r) => seq.slice(r * 5, r * 5 + 5).split(''));
  const pos = {};
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      pos[matrix[r][c]] = { r, c };
    }
  }
  // map J -> I
  pos['J'] = pos['I'];
  return { matrix, pos };
}

function toPairs(text) {
  const s = (text || '').toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const pairs = [];
  let i = 0;
  while (i < s.length) {
    const a = s[i];
    const b = s[i + 1];
    if (!b) {
      pairs.push([a, 'X']);
      i += 1;
    } else if (a === b) {
      pairs.push([a, 'X']);
      i += 1;
    } else {
      pairs.push([a, b]);
      i += 2;
    }
  }
  return pairs;
}

function encPair(a, b, pos, mode) {
  const pa = pos[a], pb = pos[b];
  if (!pa || !pb) return a + b;
  if (pa.r === pb.r) {
    // cùng hàng
    const shift = mode === 'encrypt' ? 1 : -1;
    const ca = (pa.c + shift + 5) % 5;
    const cb = (pb.c + shift + 5) % 5;
    return rowChar(pa.r, ca) + rowChar(pb.r, cb);
  }
  if (pa.c === pb.c) {
    // cùng cột
    const shift = mode === 'encrypt' ? 1 : -1;
    const ra = (pa.r + shift + 5) % 5;
    const rb = (pb.r + shift + 5) % 5;
    return rowChar(ra, pa.c) + rowChar(rb, pb.c);
  }
  // hình chữ nhật
  return rowChar(pa.r, pb.c) + rowChar(pb.r, pa.c);

  function rowChar(r, c) {
    return ALPHABET[matrixIndex(r, c)];
  }
}

function matrixIndex(r, c) {
  return r * 5 + c;
}

function transform(text, key, mode) {
  const k = normalizeKey(key);
  if (!k) return '';
  const { matrix, pos } = buildMatrix(k);
  // helper to fetch char from matrix by r,c
  function getRC(r, c) { return matrix[r][c]; }

  function processPair(a, b) {
    const pa = pos[a], pb = pos[b];
    if (pa.r === pb.r) {
      const s = mode === 'encrypt' ? 1 : -1;
      return getRC(pa.r, (pa.c + s + 5) % 5) + getRC(pb.r, (pb.c + s + 5) % 5);
    }
    if (pa.c === pb.c) {
      const s = mode === 'encrypt' ? 1 : -1;
      return getRC((pa.r + s + 5) % 5, pa.c) + getRC((pb.r + s + 5) % 5, pb.c);
    }
    return getRC(pa.r, pb.c) + getRC(pb.r, pa.c);
  }

  return toPairs(text).map(([a, b]) => processPair(a, b)).join('');
}

function encrypt(text, key) {
  return transform(text, key, 'encrypt');
}

function decrypt(text, key) {
  return transform(text, key, 'decrypt');
}

module.exports = { normalizeKey, encrypt, decrypt };