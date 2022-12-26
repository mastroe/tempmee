const { request } = require('./index');
const should = require('should');
const { expect } = require('chai');

describe('Compensation Fetch Test', async () => {

    /**
    * Payload Structre.
    * @param {string} _id 
    * @param {string} industry 
    * @param {string} title 
    * @param {string} currency_main 
    * @param {string} city  
    * @param {string} state  
    * @param {string} country 
    * @param {string} title_description 
    * @param {number} salary 
    * @param {[date]} timestamp 
    * @param {[number]} age_range 
    * @param {[number]} experience_range
    */

    /**
    * Query Test
    */
    it('should fetch salary info with greater than or equal to given value', async () => {
        const response = await request()
            .get(`/compensation?salary[gte]=50000&limit=5`)

        expect(response).to.have.status(200);
        response.should.be.json;

        response.body.data.forEach(object => {
            object.salary.should.be.aboveOrEqual(50000);
        })

    });

    it('should fetch salary info with less than or equal to given value', async () => {
        const response = await request()
            .get(`/compensation?salary[lte]=120000&limit=5`)

        expect(response).to.have.status(200);
        response.should.be.json;

        response.body.data.forEach(object => {
            object.salary.should.be.belowOrEqual(120000)
        })

    });

    it('should fetch salary info with 20 as limit', async () => {
        const response = await request()
            .get(`/compensation?salary[lte]=120000&limit=20`)

        expect(response).to.have.status(200);
        response.should.be.json;
        response.body.data.length.should.be.equal(20);

    });

    it('should fetch salary info by ascending order', async () => {
        const response = await request()
            .get(`/compensation?salary[lte]=120000&sort_by=salary&sort_dir=asc&limit=5`)

        expect(response).to.have.status(200);
        response.should.be.json;

        const isAscending = (arr) => {
            return arr.every(function (x, i) {
                return i === 0 || x >= arr[i - 1];
            });
        }

        isAscending(response.body.data.map(a => a.salary)).should.be.equal(true);
    });

    it('should fetch salary info by descending order', async () => {
        const response = await request()
            .get(`/compensation?salary[lte]=120000&sort_by=salary&sort_dir=desc&limit=5`)

        expect(response).to.have.status(200);
        response.should.be.json;

        const isDescending = (arr) => {
            return arr.every(function (x, i) {
                return i === 0 || x <= arr[i - 1];
            });
        }

        isDescending(response.body.data.map(a => a.salary)).should.be.equal(true);

    });

    it('should return error for salary info by providing wrong sort enum', async () => {
        const response = await request()
            .get(`/compensation?salary[lte]=120000&sort_by=salary&sort_dir=abc&limit=5`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });


    it('should return error for salary info by providing wrong range paramater', async () => {
        const response = await request()
            .get(`/compensation?salary[abc]=120000`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });

    it('should return error for salary info by providing wrong value type', async () => {
        const response = await request()
            .get(`/compensation?salary[lte]=abc`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });

    it('should return error for salary info without providing a range', async () => {
        const response = await request()
            .get(`/compensation?salary`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });

    it('should fetch age info with greater than or equal to given value', async () => {
        const response = await request()
            .get(`/compensation?age_range[gte]=34&limit=5`)
        expect(response).to.have.status(200);
        response.should.be.json;

        response.body.data.forEach(object => {
            Math.max(...object.age_range).should.be.aboveOrEqual(34);
        })

    });

    it('should fetch age info with less than or equal to given value', async () => {
        const response = await request()
            .get(`/compensation?age_range[lte]=55&limit=5`)

        expect(response).to.have.status(200);
        response.should.be.json;

        response.body.data.forEach(object => {
            should(Math.max(...object.age_range)).be.belowOrEqual(55)
        })

    });

    it('should return error for age info by providing wrong range paramater', async () => {
        const response = await request()
            .get(`/compensation?age_range[abc]=55`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });

    it('should return error for age info by providing wrong value type', async () => {
        const response = await request()
            .get(`/compensation?age_range[lte]=abc`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });

    it('should return error for age info without providing a range', async () => {
        const response = await request()
            .get(`/compensation?age_range`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });


    it('should fetch experience_range info with greater than or equal to given value', async () => {
        const response = await request()
            .get(`/compensation?experience_range[gte]=10&limit=5`)
        expect(response).to.have.status(200);
        response.should.be.json;

        response.body.data.forEach(object => {
            Math.max(...object.experience_range).should.be.aboveOrEqual(10)
        })

    });

    it('should fetch experience_range info with less than or equal to given value', async () => {
        const response = await request()
            .get(`/compensation?experience_range[lte]=20&limit=5`)

        expect(response).to.have.status(200);
        response.should.be.json;

        response.body.data.forEach(object => {
            Math.max(...object.experience_range).should.be.belowOrEqual(20)
        })

    });

    it('should return error for experience_range info by providing wrong range paramater', async () => {
        const response = await request()
            .get(`/compensation?experience_range[abc]=55`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });

    it('should return error for experience_range info by providing wrong value type', async () => {
        const response = await request()
            .get(`/compensation?experience_range[lte]=abc`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });

    it('should return error for experience_range info without providing a range', async () => {
        const response = await request()
            .get(`/compensation?experience_range`)

        expect(response).to.have.status(400);
        response.should.be.json;
    });


    /**
    * Response Object Validity Test
    */

    it('should return result with right data format', async () => {
        const response = await request()
            .get(`/compensation?country=USA&sort_by=salary&limit=1&sort_dir=desc&start=2`)

        response.should.be.json;
        if (response.body.data.length > 0) {
            response.body.data[0].should.have.property('_id');
            response.body.data[0].should.have.property('industry');
            response.body.data[0].should.have.property('title');
            response.body.data[0].should.have.property('currency_main');
            response.body.data[0].should.have.property('city');
            response.body.data[0].should.have.property('state');
            response.body.data[0].should.have.property('country');
            response.body.data[0].should.have.property('salary');
            response.body.data[0].should.have.property('timestamp');
            response.body.data[0].should.have.property('age_range');
            response.body.data[0].should.have.property('experience_range');

            (typeof response.body.data[0]._id).should.be.equal('string');
            (typeof response.body.data[0].industry).should.be.equal('string');
            (typeof response.body.data[0].title).should.be.equal('string');
            (typeof response.body.data[0].currency_main).should.be.equal('string');
            (typeof response.body.data[0].city).should.be.equal('string');
            (typeof response.body.data[0].state).should.be.equal('string');
            (typeof response.body.data[0].country).should.be.equal('string');
            (typeof response.body.data[0].salary).should.be.equal('number');
            (typeof response.body.data[0].timestamp).should.be.equal('string');
            (typeof response.body.data[0].age_range).should.be.equal('object');
            (typeof response.body.data[0].experience_range).should.be.equal('object');
        }


    });


    /**
    * Wrong Input Test
    */

    it('should return error for industry info for providing wrong input', async () => {
        const response = await request()
            .get(`/compensation?industry=`)
        expect(response).to.have.status(400);
    });

    it('should return error for title info by providing wrong input', async () => {
        const response = await request()
            .get(`/compensation?title=`)

        expect(response).to.have.status(400);
    });

    it('should return error for currency_main info by providing wrong input', async () => {
        const response = await request()
            .get(`/compensation?currency_main=`)

        expect(response).to.have.status(400);
    });

    it('should return error for city info by providing wrong input', async () => {
        const response = await request()
            .get(`/compensation?city=`)

        expect(response).to.have.status(400);
    });

    it('should return error for state info by providing wrong input', async () => {
        const response = await request()
            .get(`/compensation?state=`)

        expect(response).to.have.status(400);
    });

    it('should return error for country info by providing wrong input type', async () => {
        const response = await request()
            .get(`/compensation?country=`)

        expect(response).to.have.status(400);
    });


});



