const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiThings = require('chai-things');
const nock = require('nock');
const darsky = require('./index.js');

chai.use(chaiAsPromised);
chai.use(chaiThings);

const expect = chai.expect;
const assert = chai.assert;

describe('Darsky Controller', () => {
  beforeEach(() => {
    darsky.init();
  });

  afterEach(() => {
    nock.cleanAll()
  });

  it('Tiene definido la APIKEY', () => {
    darsky.isDefinedApiKey();
  });

  it('En caso de error al solicitar ' +
    'tiempo sobre una ciudad, enviar mensaje.',  (done) => {
    nock('https://api.darksky.net')
      .get(uri => uri.includes(','))
      .replyWithError('error');

      const city = {
        name: 'Santiago (CL)',
        latitude : -33.435974,
        longitude: -70.67286
      };
      darsky.getDataCity(city).catch((error) => {
        assert.equal(error.message, 'error');
        done();
      });
  });

  it('Enviar error cuando no se envia objeto ciudad', () => {
    expect(darsky.getDataCity).to.throw('undefined');
  });

  it('Enviar error falta una propiedad en el objeto ciudad', () => {
    const city = {
      name: 'Santiago (CL)',
      latitude : -33.435974,
      // longitude: -70.67286
    };
    expect(() => darsky.getDataCity(city)).to.throw('properties');
  });

  it('Debe devolver un objeto con latitude, longitude, y time ', (done) => {

    const obj =  {
      latitude: -33.435974,
      longitude: -70.67286,
      timezone: 'America/Santiago',
      currently: {
        time: 1551113094,
        temperature: 60,
      }
    };

    nock('https://api.darksky.net')
      .get(uri => uri.includes(','))
      .reply(200, obj);

    const city = {
      name: 'Santiago (CL)',
      latitude : -33.435974,
      longitude: -70.67286
    };

    darsky.getDataCity(city).then((response) => {
      expect(response).to.be.an('object').that.to.have.keys('latitude', 'longitude', 'time', 'name', 'temperature', 'timezone');
      done();
    });
  });

  it('Debe traer un array con objectos, que posean latitude, longitude y time como propiedades', (done) => {
    const obj =  {
      latitude: -33.435974,
      longitude: -70.67286,
      timezone: 'America/Santiago',
      currently: {
        time: 1551113094,
        temperature: 60,
      }
    };

    nock('https://api.darksky.net')
      .get(uri => uri.includes(','))
      .reply(200, obj);

    darsky.getTimeCities().then((response) => {
      expect(response).to.be.a('array').that.to.have.all.keys('latitude', 'longitude', 'time', 'name', 'temperature', 'timezone');
      done()
    });
  });
});

describe('Darsky Controller without init ', () => {
  it('Enviar mensaje si no está definido la apikey', () => {
    darsky.getTimeCities().catch((error) => {
      expect(error).to.be.a('string');
    });
  });
})
