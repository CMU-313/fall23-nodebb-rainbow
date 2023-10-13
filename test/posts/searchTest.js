// searchTest.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const app = 'http://localhost:4567';  

describe('Search API', () => {

    // Test case for a keyword that should return results
    it('should return posts for valid keywords', (done) => {
        chai.request(app)
            .get('/api/posts/search?keyword=weird')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.is.not.empty;
                done();
            });
    });

    // Test case for a keyword that shouldn't return results
    it('should return an empty array for non-existent keywords', (done) => {
        chai.request(app)
            .get('/api/posts/search?keyword=nonExistentKeyword')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.is.empty;
                done();
            });
    });
});

