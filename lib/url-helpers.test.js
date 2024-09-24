const { examplePreview } = require('./url-helpers');

describe('get the url for an example preview', () => {
  it('should give correct url when there are leading and trailing slashes', () => {
    expect(examplePreview('/some/example/'))
      .toBe('http://localhost:3000/components/some/example/preview');
  });

  it('should give correct url when there are no leading or trailing slashes', () => {
    expect(examplePreview('some/example'))
      .toBe('http://localhost:3000/components/some/example/preview');
  });

  it('should give correct url when there are only leading slashes', () => {
    expect(examplePreview('/some/example'))
      .toBe('http://localhost:3000/components/some/example/preview');
  });

  it('should give correct url when there are only trailing slashes', () => {
    expect(examplePreview('some/example/'))
      .toBe('http://localhost:3000/components/some/example/preview');
  });
});
