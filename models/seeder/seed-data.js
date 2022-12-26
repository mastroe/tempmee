const dotenv = require('dotenv');
dotenv.config();
const Compensation = require('models/compensation');
const fs = require('fs');
const dbConnection = require('config/db-connection');
const { logger } = require('config/logger');
const Seed = async () => {
    dbConnection('mongodb://' + process.env.DB_HOST, process.env.DB_DATABASE);
    const data = await Compensation.find({});

    if (data.length === 0) {
        const rawdata = fs.readFileSync('./models/seeder/data.json');
        const seederData = JSON.parse(rawdata);

        let dataToSave = [];
        for (const data of seederData) {
            const record = Object.values(data);

            dataToSave.push({
                timestamp: record[0],
                age_range: record[1].match(/\d+/g).map(num => Number(num)),
                industry: record[2],
                title: record[3],
                salary: Number(record[4]?.match(/\d+/g)?.join('')) || undefined,
                currency_main: record[5],
                city: record[6].includes(',') ? record[6]?.split(',')?.[0] : record[6]?.split('/')?.[0],
                state: record[6].includes(',') ? record[6]?.split(',')?.[1] : record[6]?.split('/')?.[1],
                country: record[6].includes(',') ? record[6]?.split(',')?.[2] : record[6]?.split('/')?.[2],
                experience_range: record[7].match(/\d+/g).map(num => Number(num)),
                title_description: record[8],
                currency_other: record[79],
            })


        }

        Compensation.insertMany(dataToSave);
        logger.info('compensation-model Seeding Successfully');
    }

}

module.exports = {
    Seed
}