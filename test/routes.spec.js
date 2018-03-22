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

  describe('GET /api/v1/projects', () => {
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
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        fake: ''
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal(`You're missing a "projct name" property.`);
      })
      .catch(err => {
        throw err;
      });
    })
  })

  describe('GET /api/v1/projects/:id/palettes', () => {
    it(`should return all of the projects' palettes`, () => {
      return chai.request(server)
      .get('/api/v1/projects/1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('sample palette 1');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('color_0');
        response.body[0].color_0.should.equal('#FF7575');
        response.body[0].should.have.property('color_1');
        response.body[0].color_1.should.equal('#CC5C8A');
        response.body[0].should.have.property('color_2');
        response.body[0].color_2.should.equal('#AA75FF');
        response.body[0].should.have.property('color_3');
        response.body[0].color_3.should.equal('#7D5FDA');
        response.body[0].should.have.property('color_4');
        response.body[0].color_4.should.equal('#aae6e6');
      })
      .catch(err => {
        throw err;
      })
    })
  })

  describe('POST /api/v1/projects/:id/palettes', () => {
    it('should create a palette', () => {
      return chai.request(server)
      .post('/api/v1/projects/1/palettes')
      .send({
        name: 'palette',
        color_0: '#FFFFFF',
        color_1: '#FFFFFF',
        color_2: '#FFFFFF',
        color_3: '#FFFFFF',
        color_4: '#FFFFFF'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('name');
        response.body.name.should.equal('palette');
        response.body.should.have.property('color_0');
        response.body.color_0.should.equal('#FFFFFF');
        response.body.should.have.property('color_1');
        response.body.color_1.should.equal('#FFFFFF');
        response.body.should.have.property('color_2');
        response.body.color_2.should.equal('#FFFFFF');
        response.body.should.have.property('color_3');
        response.body.color_3.should.equal('#FFFFFF');
        response.body.should.have.property('color_4');
        response.body.color_4.should.equal('#FFFFFF');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
      })
    })

    it('should not create a palette with missing data', () => {
      return chai.request(server)
      .post('/api/v1/projects/1/palettes')
      .send({
        fake: ''
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('incomplete palette, missing name');
      })
      .catch(err => {
        throw err;
      });
    })
  })

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should delete a palette', () => {
      return chai.request(server)
      .delete('/api/v1/palettes/1')
      .then(response => {
        response.should.have.status(200);
      })
    })
  })
});
