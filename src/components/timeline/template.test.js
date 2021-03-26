/* eslint-env jest */

const { render, getExamples } = require('../../../lib/jest-helpers');

const examples = getExamples('timeline');

describe('Timeline', () => {
  describe('by default', () => {
    const $ = render('timeline', examples.default);
    const $timeline = $('.hmrc-timeline');

    it('should not show the timeline if there are no parameters given', () => {
      expect($timeline.length).toBe(0);
    });
  });

  describe('with one item', () => {
    const $ = render('timeline', examples['single-event']);
    const $orderedList = $('ol.hmrc-timeline');
    const $listItems = $('li.hmrc-timeline__event');
    const $heading = $('.hmrc-timeline__event-title');
    const $time = $('.hmrc-timeline__event-meta');

    it('has the correct text', () => {
      expect($listItems.text()).toContain('singleExampleContent1');
    });

    it('has an ordered list', () => {
      expect($orderedList.length).toBe(1);
    });

    it('has a list of 1 item', () => {
      expect($listItems.length).toBe(1);
    });

    it('has the default heading level', () => {
      expect($heading.get(0).tagName).toBe('h2');
    });

    it('has the title content', () => {
      expect($heading.text()).toBe('event one');
    });

    it('has the correct time text and datetime attribute', () => {
      expect($time.text()).toBe('15 July 2020');
      expect($time.attr('datetime')).toBe('2020-07-15');
    });
  });

  describe('with a custom heading level', () => {
    const $ = render('timeline', examples['custom-header-level']);
    const $heading = $('.hmrc-timeline__event-title');

    it('should have a different tag', () => {
      expect($heading.get(0).tagName).toBe('h3');
    });
  });

  describe('with no datetime parameter', () => {
    const $ = render('timeline', examples['no-datetime-event']);
    const $time = $('.hmrc-timeline__event-meta');

    it('should not have the datetime attribute', () => {
      expect($time.attr('datetime')).toBe(undefined);
    });
  });

  describe('with two items', () => {
    const $ = render('timeline', examples['multiple-events']);
    const $listItems = $('li.hmrc-timeline__event');
    const $headings = $('.hmrc-timeline__event-title');
    const $times = $('.hmrc-timeline__event-meta');

    it('Contains a list of 2 items', () => {
      expect($listItems.length).toBe(2);
    });

    it('has the correct title, text, time and datetime for each list item', () => {
      expect($headings.eq(0).text()).toBe('event one');
      expect($times.eq(0).text()).toBe('20 July 2020');
      expect($times.eq(0).attr('datetime')).toBe('2020-07-20');
      expect($listItems.eq(0).text()).toContain('exampleContent1');

      expect($headings.eq(1).text()).toBe('event two');
      expect($times.eq(1).text()).toBe('21 July 2020');
      expect($times.eq(1).attr('datetime')).toBe('2020-07-21');
      expect($listItems.eq(1).text()).toContain('exampleContent2');
    });
  });
});
