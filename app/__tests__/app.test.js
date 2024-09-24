/* eslint-env jest */

const request = require('request');

const configPaths = require('../../config/paths.json');

const PORT = configPaths.ports.app;

const requestParamsHomepage = {
  url: `http://localhost:${PORT}/`,
  headers: {
    'Content-Type': 'text/plain',
  },
};

describe('frontend app', () => {
  describe('homepage', () => {
    it('should resolve with a http status code of 200', (done) => {
      request.get(requestParamsHomepage, (err, res) => {
        expect(res.statusCode).toEqual(200);
        done(err);
      });
    });

    it('should resolve with a ‘Content-Type’ header of "text/html"', (done) => {
      request.get(requestParamsHomepage, (err, res) => {
        expect(res.headers['content-type']).toContain('text/html');
        done(err);
      });
    });
  });
});
