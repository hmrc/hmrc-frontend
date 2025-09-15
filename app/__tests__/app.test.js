/* eslint-env jest */

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
    it('should resolve with a http status code of 200', async () => {
      const res = await fetch(requestParamsHomepage.url, {
        headers: requestParamsHomepage.headers,
      });

      expect(res.status).toEqual(200);
    });

    it('should resolve with a ‘Content-Type’ header of "text/html"', async () => {
      const res = await fetch(requestParamsHomepage.url, {
        headers: requestParamsHomepage.headers,
      });

      expect(res.headers.get('content-type')).toContain('text/html');
    });
  });
});
