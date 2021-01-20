module.exports = ({ host, port }) => ({
  id: 'backstop_default',
  viewports: [
    {
      label: 'phone',
      width: 320,
      height: 480,
    },
    {
      label: 'tablet',
      width: 1024,
      height: 768,
    },
  ],
  onBeforeScript: 'puppet/onBefore.js',
  onReadyScript: 'puppet/onReady.js',
  scenarios: [
    {
      label: 'HMRC Account Header',
      url: `http://${host}:${port}/components/account-header/preview`,
    },
    {
      label: 'HMRC Account Menu',
      url: `http://${host}:${port}/components/account-menu/preview`,
    },
    {
      label: 'HMRC Add to a list',
      url: `http://${host}:${port}/components/add-to-a-list/preview`,
    },
    {
      label: 'HMRC Banner',
      url: `http://${host}:${port}/components/banner/preview`,
    },
    {
      label: 'HMRC Currency Input',
      url: `http://${host}:${port}/components/currency-input/preview`,
    },
    {
      label: 'HMRC Currency Input (Focus)',
      url: `http://${host}:${port}/components/currency-input/preview`,
      clickSelector: '.govuk-label',
    },
    {
      label: 'HMRC Header',
      url: `http://${host}:${port}/components/header/preview`,
    },
    {
      label: 'HMRC Internal Header',
      url: `http://${host}:${port}/components/internal-header/preview`,
      /* Internal header uses system-defined font so can
      vary between platforms (allowing 1% variance) */
      misMatchThreshold: 1,
    },
    {
      label: 'HMRC Language Select',
      url: `http://${host}:${port}/components/language-select/preview`,
    },
    {
      label: 'HMRC New Tab Link',
      url: `http://${host}:${port}/components/new-tab-link/preview`,
    },
    {
      label: 'HMRC Notification Badge',
      url: `http://${host}:${port}/components/notification-badge/preview`,
    },
    {
      label: 'HMRC Page Heading',
      url: `http://${host}:${port}/components/page-heading/preview`,
    },
    {
      label: 'HMRC Report Technical Issue',
      url: `http://${host}:${port}/components/report-technical-issue/preview`,
    },
    {
      label: 'HMRC Timeout Dialog',
      url: `http://${host}:${port}/components/timeout-dialog/preview`,
      delay: 2000,
    },
    {
      label: 'HMRC User Research Banner',
      url: `http://${host}:${port}/components/user-research-banner/preview`,
      delay: 2000,
    },
  ],
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'backstop_data/engine_scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report',
  },
  report: ['browser'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
});
