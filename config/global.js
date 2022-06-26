"use strict";

const fs = require('fs');
const uuidv4 = require('uuid');

module.exports = {
    getStandardResponse: function (status, message, data) {
        return {
            code: status,
            message: message,
            data: data
        }
    },

    uploadBase64Image: function (images) {
        try {

            // to declare some path to store your converted image
            
            const filename = uuidv4.v4();
            const path = './public/upload/images/' + filename + '.png'
            const imgdata = images["string"];

            // to convert base64 format into random filename
            const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');

            fs.writeFileSync(path, base64Data, { encoding: 'base64' });
            return filename;

        } catch (e) {
            throw new Error (e.message);
        }
    }
}