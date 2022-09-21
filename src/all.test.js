/* eslint-env jest */
/* global spyOn */
import HMRCFrontend from './all';
import * as backLinkModule from './components/back-link-helper/back-link-helper';
import * as characterCountModule from './components/character-count/character-count';

describe('Init All', () => {
  let testScope;
  beforeEach(() => {
    testScope = {
      elemsToWipe: [],
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
    testScope.elemsToWipe.forEach((elem, key) => {
      const parent = elem.parentNode;
      if (parent) {
        parent.removeChild(elem);
      } else {
        throw new Error(`failed to remove child ${key}`);
      }
    });
    testScope.elemsToWipe = [];
  });
  describe('Character Count', () => {
    function createCharCountModule() {
      const elem = document.createElement('div');
      testScope.elemsToWipe.push(elem);
      elem.setAttribute('data-module', 'hmrc-character-count');
      document.querySelector('body').appendChild(elem);
      return elem;
    }

    it('should initialise one module', () => {
      const initFn = jest.fn();
      const elem = createCharCountModule();
      spyOn(characterCountModule, 'default').and.returnValue({ init: initFn });
      expect(characterCountModule.default).not.toHaveBeenCalled();
      HMRCFrontend.initAll();
      expect(characterCountModule.default).toHaveBeenCalledWith(elem);
      expect(initFn).toHaveBeenCalled();
    });

    it('should not initialise when there are no modules', () => {
      const initFn = jest.fn();
      spyOn(characterCountModule, 'default').and.returnValue({ init: initFn });
      HMRCFrontend.initAll();
      expect(characterCountModule.default).not.toHaveBeenCalled();
      expect(initFn).not.toHaveBeenCalled();
    });

    it('should initialise four modules', () => {
      const elemA = createCharCountModule();
      const elemB = createCharCountModule();
      const elemC = createCharCountModule();
      const elemD = createCharCountModule();
      const initFnA = jest.fn();
      const initFnB = jest.fn();
      const initFnC = jest.fn();
      const initFnD = jest.fn();
      const unusedInitFn = jest.fn();
      spyOn(characterCountModule, 'default').and.callFake((elem) => {
        let init = unusedInitFn;
        if (elem === elemA) {
          init = initFnA;
        }
        if (elem === elemB) {
          init = initFnB;
        }
        if (elem === elemC) {
          init = initFnC;
        }
        if (elem === elemD) {
          init = initFnD;
        }
        return { init };
      });
      expect(characterCountModule.default).not.toHaveBeenCalled();
      HMRCFrontend.initAll();
      expect(characterCountModule.default).toHaveBeenCalledWith(elemA);
      expect(characterCountModule.default).toHaveBeenCalledWith(elemB);
      expect(characterCountModule.default).toHaveBeenCalledWith(elemC);
      expect(characterCountModule.default).toHaveBeenCalledWith(elemD);
      expect(initFnA).toHaveBeenCalled();
      expect(initFnB).toHaveBeenCalled();
      expect(initFnC).toHaveBeenCalled();
      expect(initFnD).toHaveBeenCalled();
      expect(unusedInitFn).not.toHaveBeenCalled();
    });
  });

  describe('Back Links', () => {
    function createBackLinkModule() {
      const elem = document.createElement('a');
      testScope.elemsToWipe.push(elem);
      elem.setAttribute('data-module', 'hmrc-back-link');
      document.querySelector('body').appendChild(elem);
      return elem;
    }

    it('should initialise one module', () => {
      const initFn = jest.fn();
      const elem = createBackLinkModule();
      spyOn(backLinkModule, 'default').and.returnValue({ init: initFn });
      expect(backLinkModule.default).not.toHaveBeenCalled();
      HMRCFrontend.initAll();
      expect(backLinkModule.default).toHaveBeenCalledWith(elem, window, document);
      expect(initFn).toHaveBeenCalled();
    });

    it('should not initialise when there are no modules', () => {
      const initFn = jest.fn();
      spyOn(backLinkModule, 'default').and.returnValue({ init: initFn });
      HMRCFrontend.initAll();
      expect(backLinkModule.default).not.toHaveBeenCalled();
      expect(initFn).not.toHaveBeenCalled();
    });

    it('should initialise two modules', () => {
      const elemA = createBackLinkModule();
      const elemB = createBackLinkModule();
      const initFnA = jest.fn();
      const initFnB = jest.fn();
      const unusedInitFn = jest.fn();
      spyOn(backLinkModule, 'default').and.callFake((elem) => {
        let init = unusedInitFn;
        if (elem === elemA) {
          init = initFnA;
        }
        if (elem === elemB) {
          init = initFnB;
        }
        return { init };
      });
      expect(backLinkModule.default).not.toHaveBeenCalled();
      HMRCFrontend.initAll();
      expect(backLinkModule.default).toHaveBeenCalledWith(elemA, window, document);
      expect(backLinkModule.default).toHaveBeenCalledWith(elemB, window, document);
      expect(initFnA).toHaveBeenCalled();
      expect(initFnB).toHaveBeenCalled();
      expect(unusedInitFn).not.toHaveBeenCalled();
    });
  });
});
