/* eslint-env jest */

const backstopConfig = require('../backstop-config');

const host = 'localhost';
const port = '8000';

describe('backstopConfig', () => {
  describe('scenario list', () => {
    it('should be empty if no components', () => {
      expect(backstopConfig({ host, port, components: [] })).toEqual(
        expect.objectContaining({ scenarios: [] }),
      );
    });

    it('should contain scenarios for all component examples', () => {
      expect(
        backstopConfig({
          host,
          port,
          components: [
            {
              componentsPath: 'button',
              componentsConfig: {
                examples: [{ name: 'default' }, { name: 'high contrast' }],
              },
            },
            {
              componentsPath: 'currency-input',
              componentsConfig: {
                examples: [{ name: 'default' }],
              },
            },
          ],
        }).scenarios,
      ).toHaveLength(3);
    });

    it('should contain scenarios for all alternate states for all component examples', () => {
      expect(
        backstopConfig({
          host,
          port,
          components: [
            {
              componentsPath: 'button',
              componentsConfig: {
                examples: [{ name: 'default' }, { name: 'high contrast' }],
                visualRegressionTests: {
                  alternateStates: {
                    focused: {
                      clickSelector: '.button',
                    },
                  },
                },
              },
            },
            {
              componentsPath: 'currency-input',
              componentsConfig: {
                examples: [{ name: 'default' }],
              },
            },
          ],
        }).scenarios,
      ).toHaveLength(5);
    });

    describe('scenario', () => {
      it('should have a label and url', () => {
        expect(
          backstopConfig({
            host,
            port,
            components: [
              {
                componentsPath: 'button',
                componentsConfig: {
                  examples: [{ name: 'high contrast' }],
                },
              },
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            scenarios: [
              {
                label: 'button (high contrast example)',
                url: `http://${host}:${port}/components/button/high-contrast/preview`,
              },
            ],
          }),
        );
      });

      it('should inherit options from component config', () => {
        expect(
          backstopConfig({
            host,
            port,
            components: [
              {
                componentsPath: 'button',
                componentsConfig: {
                  examples: [{ name: 'default' }, { name: 'high contrast' }],
                  visualRegressionTests: {
                    backstopScenarioOptions: {
                      delay: 2000,
                    },
                  },
                },
              },
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            scenarios: [
              {
                label: 'button (default example)',
                url: `http://${host}:${port}/components/button/default/preview`,
                delay: 2000,
              },
              {
                label: 'button (high contrast example)',
                url: `http://${host}:${port}/components/button/high-contrast/preview`,
                delay: 2000,
              },
            ],
          }),
        );
      });

      it('should inherit options from component examples', () => {
        expect(
          backstopConfig({
            host,
            port,
            components: [
              {
                componentsPath: 'button',
                componentsConfig: {
                  examples: [
                    { name: 'default' },
                    {
                      name: 'high contrast',
                      visualRegressionTests: {
                        backstopScenarioOptions: { delay: 4000 },
                      },
                    },
                  ],
                  visualRegressionTests: {
                    backstopScenarioOptions: {
                      delay: 2000,
                    },
                  },
                },
              },
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            scenarios: [
              {
                label: 'button (default example)',
                url: `http://${host}:${port}/components/button/default/preview`,
                delay: 2000,
              },
              {
                label: 'button (high contrast example)',
                url: `http://${host}:${port}/components/button/high-contrast/preview`,
                delay: 4000,
              },
            ],
          }),
        );
      });

      it('should inherit options from component alternate states', () => {
        expect(
          backstopConfig({
            host,
            port,
            components: [
              {
                componentsPath: 'button',
                componentsConfig: {
                  examples: [{ name: 'default' }, { name: 'high contrast' }],
                  visualRegressionTests: {
                    alternateStates: {
                      focused: {
                        clickSelector: '.button',
                      },
                    },
                    backstopScenarioOptions: {
                      delay: 2000,
                    },
                  },
                },
              },
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            scenarios: [
              {
                label: 'button (default example)',
                url: `http://${host}:${port}/components/button/default/preview`,
                delay: 2000,
              },
              {
                label: 'button (default example) (focused)',
                url: `http://${host}:${port}/components/button/default/preview`,
                delay: 2000,
                clickSelector: '.button',
              },
              {
                label: 'button (high contrast example)',
                url: `http://${host}:${port}/components/button/high-contrast/preview`,
                delay: 2000,
              },
              {
                label: 'button (high contrast example) (focused)',
                url: `http://${host}:${port}/components/button/high-contrast/preview`,
                delay: 2000,
                clickSelector: '.button',
              },
            ],
          }),
        );
      });

      it('should inherit options from component examples alternate states', () => {
        expect(
          backstopConfig({
            host,
            port,
            components: [
              {
                componentsPath: 'button',
                componentsConfig: {
                  examples: [
                    { name: 'default' },
                    {
                      name: 'high contrast',
                      visualRegressionTests: {
                        alternateStates: {
                          focused: { clickSelector: '.high-contrast-button' },
                        },
                      },
                    },
                  ],
                  visualRegressionTests: {
                    alternateStates: {
                      focused: {
                        clickSelector: '.button',
                      },
                    },
                    backstopScenarioOptions: {
                      delay: 2000,
                    },
                  },
                },
              },
            ],
          }),
        ).toEqual(
          expect.objectContaining({
            scenarios: [
              {
                label: 'button (default example)',
                url: `http://${host}:${port}/components/button/default/preview`,
                delay: 2000,
              },
              {
                label: 'button (default example) (focused)',
                url: `http://${host}:${port}/components/button/default/preview`,
                delay: 2000,
                clickSelector: '.button',
              },
              {
                label: 'button (high contrast example)',
                url: `http://${host}:${port}/components/button/high-contrast/preview`,
                delay: 2000,
              },
              {
                label: 'button (high contrast example) (focused)',
                url: `http://${host}:${port}/components/button/high-contrast/preview`,
                delay: 2000,
                clickSelector: '.high-contrast-button',
              },
            ],
          }),
        );
      });
    });
  });
});
