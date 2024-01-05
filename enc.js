const crypto = require('crypto');


const secretKey = 'yourSecretKey';

// Function to encrypt the data
const encryptData = (data) => {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

// Function to decrypt the data
const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return JSON.parse(decryptedData);
}

module.exports = {
    encryptData,
    decryptData
};