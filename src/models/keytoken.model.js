'use strict'

const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'KeyToken';
const COLLECTION_NAME = 'KeyTokens';

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: { // nhung refreshToken da su dung roi, neu co refreshToken moi thi push vao array nay de check
        type: Array,
        default: []
    },
    refreshToken: { // freshToken hien tai, neu co refreshToken moi thi update lai
        type: String,
        default: null,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);