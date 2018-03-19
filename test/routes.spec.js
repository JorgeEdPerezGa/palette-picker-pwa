const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should render html', () => {

  })

  it('should return a 404 for a route that does not exist', () => {

  })
});

describe('API Routes', () => {
  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {

    })
  })

  describe('POST /api/v1/projects', () => {
    it('should create a project', () => {

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
