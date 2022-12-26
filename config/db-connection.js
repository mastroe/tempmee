const mongoose = require('mongoose');

let db;
const dbConnection = (mongo_url, dbName) => {
    if (db) return db;
    db = mongoose.connect(`${mongo_url}/${dbName}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return db;
}

module.exports = dbConnection;