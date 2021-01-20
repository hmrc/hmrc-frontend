/* eslint-env jest */

import MockDate from 'mockdate';
import { getCookie, setCookie } from '../cookies';

describe('cookies', () => {
  describe('setCookie', () => {
    beforeEach(() => {
      delete window.location;
      window.location = {
        protocol: 'http:',
      };

      // Clear any cookies that exist
      document.cookie = 'baz=; Max-Age=-99999999;';
      document.cookie = 'foo=; Max-Age=-99999999;';
      document.cookie = 'bam=; Max-Age=-99999999;';
      document.cookie = 'faz=; Max-Age=-99999999;';
    });

    it('should set a cookie', () => {
      const cookieString = setCookie('baz', 'foo');

      expect(cookieString).toEqual('baz=foo; path=/');
      expect(document.cookie).toEqual('baz=foo');
    });

    it('should set multiple cookies', () => {
      setCookie('baz', 'foo');
      setCookie('faz', 'bar');

      expect(document.cookie).toEqual('baz=foo; faz=bar');
    });

    it('should set a cookie with an expiry date', () => {
      MockDate.set('1/1/2050');

      const cookieString = setCookie('foo', 'bar', { days: 1 });

      expect(cookieString).toEqual('foo=bar; path=/; expires=Sun, 02 Jan 2050 00:00:00 GMT');
      expect(document.cookie).toEqual('foo=bar');
    });

    it('should set a secure cookie', () => {
      window.location.protocol = 'https:';
      const cookieString = setCookie('foo', 'bar');

      expect(cookieString).toEqual('foo=bar; path=/; Secure');
    });
  });

  describe('getCookie', () => {
    it('should correctly retrieve a cookie', () => {
      document.cookie = 'foo=bar';
      expect(getCookie('foo')).toEqual('bar');
    });

    it('should correctly retrieve a cookie if more than one exists', () => {
      document.cookie = 'foo=bar';
      document.cookie = 'bam=bat';

      expect(getCookie('bam')).toEqual('bat');
      expect(getCookie('foo')).toEqual('bar');
    });

    it("should return null if the cookie doesn't exist", () => {
      expect(getCookie('nonexistent')).toEqual(null);
    });
  });
});
