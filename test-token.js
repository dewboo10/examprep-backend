// test-token.js
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: '507f1f77bcf86cd799439011' }, 'g58bhaktawarramnagerindore', { expiresIn: '1h' });
console.log('Your token:', token);
