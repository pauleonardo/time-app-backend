const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiThings = require('chai-things');
const redisController = require('./index');

chai.use(chaiThings);
chai.use(chaiAsPromised).should();

const expect = chai.expect;

describe('Redis Controller without Init', () => {
  it('Sin inicializar Redis, debe dar false', (done) => {
    redisController.isClientConnected().should.equal(false);
    done();
  });
});

describe('Redis Controller', () => {
  beforeEach((done) => {
    redisController.init().should.eventually.equal('OK').notify(done);
  });

  it('Al iniciarlizar Cliente Redis, al verificar si esta conectado debe dar' +
    ' verdadero', (done) => {
    redisController.isClientConnected().should.equal(true);
    done();
    });

  it('Enviar OK, al insertar un tiempo', async () => {
    const time =
      {
        name: 'Santiago ejemplo',
        latitude : -33.435974,
        longitude: -70.67286,
        time: 12,
        timezone: 'America/Santiago',
        temperature: 60,
      };
    const result = await redisController.pushTime(time);
    expect(result).to.equal('OK');
  });

  it('error insertando sin un objeto', (done) => {
    expect(redisController.pushTime).to.throw('undefined');
    done();
  });

  it('error insertando un objeto que le falta un propiedad', (done) => {
    const time =
      {
        name: 'Santiago (CL)',
        latitude : -33.435974,
        longitude: -70.67286,
        // time: 12
      };
    expect(() => redisController.pushTime(time)).to.throw('properties');
    done();
  });

  it('Obtener la data de una ciudad en especifico', async () => {
    const time =
      {
        name: 'Santiago ejemplo',
        latitude : -33.435974,
        longitude: -70.67286,
        time: 12,
        timezone: 'America/Santiago',
        temperature: 60,
      };
    await redisController.pushTime(time);
    const city = 'Santiago ejemplo';
    const result = await redisController.getTime(city);
    expect(result).to.have.keys('time', 'longitude', 'longitude', 'name', 'temperature', 'timezone');
  });

  it('Intentar obtener un valor no existente, enviar ELEMENT IS NULL', async () => {
    const city = 'nombre no existente';
    expect(redisController.getTime(city)).to.eventually.rejectedWith('ELEMENT IS NUL');
  });

  it('Error al obtener tiempo sin nombre de ciudad', () => {
    expect(redisController.getTime).to.throw('need a city name');
  });

  it('Al guardar un error de llamada, debe devolver un OK', () => {
    const error = 'How unfortunate! The API Request Failed';
    redisController.setErrorRequest(error).then((result) => {
      expect(result).equal('OK');
    });
  });

  it('Intentar guardar un error diferente de "How unfortunate! The API Request Failed", enviar un error', async () => {
    const error = 'otro error';
    const result = await redisController.setErrorRequest(error);
    expect(result.message).to.equal('NO ES UN ERROR PERMITIDO');
  });
});



