const path = require('path');

process.env.NODE_ENV = 'test';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const chai = require('chai'),
    chaiHTTP = require('chai-http');


chai.use(chaiHTTP);
chai.should();

const testURL = process.env.TEST_URL || 'http://localhost:3000';

function request() {
    const req = chai.request(testURL);
    return req;
}


module.exports = {
    request
};
