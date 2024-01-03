const crypto = require('crypto');


const secretKey = 'yourSecretKey';

// Function to encrypt the data
const encryptData = (data) => {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

module.exports = encryptData