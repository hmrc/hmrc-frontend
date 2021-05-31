/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('fieldset-heading');

describe('fieldset-heading', () => {
  it('passes accessibility tests', async () => {
    const $ = render('fieldset-heading', examples.default);

    const results = await axe($.html());
    expect(results).toHaveNoViolations();
  });

  it('creates a fieldset', () => {
    const $ = render('fieldset-heading', examples.default);

    const $component = $('fieldset.govuk-fieldset');
    expect($component.get(0).tagName).toContain('fieldset');
  });

  it('includes a legend element which captions the fieldset', () => {
    const $ = render('fieldset-heading', examples.default);

    const $legend = $('.govuk-fieldset__legend');
    expect($legend.get(0).tagName).toEqual('legend');
  });

  it('nests the legend within the fieldset', () => {
    const $ = render('fieldset-heading', examples.default);

    const $legend = $('.govuk-fieldset__legend');
    expect($legend.parent().get(0).tagName).toEqual('fieldset');
  });

  it('allows you to set the legend text', () => {
    const $ = render('fieldset-heading', examples.default);

    const $legend = $('.govuk-fieldset__legend');
    expect($legend.text().trim()).toEqual(examples.default.legend.text);
  });

  it('allows you to set the aria-describedby attribute', () => {
    const $ = render('fieldset-heading', examples.default);

    const $component = $('.govuk-fieldset');
    expect($component.attr('aria-describedby')).toEqual(examples.default.describedBy);
  });

  it('escapes HTML in the text argument', () => {
    const $ = render('fieldset-heading', examples.escape);

    const $legend = $('.govuk-fieldset__legend');
    expect($legend.html()).toContain(examples.escape.legend.text);
  });

  it('does not escape HTML in the html argument', () => {
    const $ = render('fieldset-heading', examples.escape);

    const $legend = $('.govuk-fieldset__legend');
    expect($legend.html()).toContain('<b>your</b>');
  });

  it('nests the legend text in an H1 if the legend is a page heading', () => {
    const $ = render('fieldset-heading', examples.default);

    const $headingInsideLegend = $('.govuk-fieldset__legend > h1');
    expect($headingInsideLegend.text().trim()).toBe(examples.default.legend.text);
  });

  it('renders html when passed as fieldset content', () => {
    const $ = render('fieldset-heading', examples.default);

    expect($('.govuk-fieldset .govuk-body').html().trim()).toEqual('<p>This is some content to put inside the fieldset</p>');
  });

  it('renders nested components using `call`', () => {
    const $ = render('fieldset-heading', {}, '<div class="app-nested-component"></div>');

    expect($('.govuk-fieldset .app-nested-component').length).toBeTruthy();
  });

  it('can have additional classes on the legend', () => {
    const $ = render('fieldset-heading', examples.default);

    const $legend = $('.govuk-fieldset__legend');
    expect($legend.hasClass(examples.default.legend.classes)).toBeTruthy();
  });

  it('can have additional classes on the fieldset', () => {
    const $ = render('fieldset-heading', examples.escape);

    const $component = $('.govuk-fieldset');
    expect($component.hasClass(examples.escape.classes)).toBeTruthy();
  });

  it('can have an explicit role', () => {
    const $ = render('fieldset-heading', examples.escape);

    const $component = $('.govuk-fieldset');
    expect($component.attr('role')).toEqual(examples.escape.role);
  });

  it('can have additional attributes', () => {
    const $ = render('fieldset-heading', examples.default);

    const $component = $('.govuk-fieldset');
    expect($component.attr('data-attribute')).toEqual(examples.escape.attributes['data-attributes']);
  });
});
