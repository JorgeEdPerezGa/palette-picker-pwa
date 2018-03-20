const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should render html', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    })
  })

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/asdf')
    .then(response => {
      response.should.have.status(404);
    })
  })
});

describe('API Routes', () => {

  describe('GET /api/v1/projects', () => {
    beforeEach(function(done) {
      database.migrate.rollback()
      .then(function() {
        database.migrate.latest()
        .then(function() {
          return database.seed.run()
          .then(function() {
            done();
          });
        });
      });
    });

    it('should return all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('sample project 1');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
      })
      .catch(err => {
        throw err;
      })
    })
  })

  describe('POST /api/v1/projects', () => {
    it('should create a project', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: 'palette'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('name');
        response.body.name.should.equal('palette');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
      })
    })

    it('should not create a project with missing data', () => {

    })
  })

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return all of the projects', () => {

    })
  })

  describe('POST /api/v1/projects/:id/palettes', () => {
    it('should create a palette', () => {

    })

    it('should not create a palette with missing data', () => {

    })
  })

  describe('DELETE DELETE /api/v1/palettes/:id', () => {
    it('should delete a palette', () => {

    })
  })
});
