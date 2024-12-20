import {
  delay,
  render,
  withHmrcStylesAndScripts,
} from '../../../lib/browser-tests/puppeteer-helpers';

const adamsPolyfill = `
// Note - updated to work with the HMRC Frontend implementation
// https://github.com/hmrc/play-frontend-hmrc#adding-accessible-autocomplete-css-and-javascript

if (typeof HMRCAccessibleAutocomplete != 'undefined' && document.querySelector('[data-module="hmrc-accessible-autocomplete"]') != null) {
    var originalSelect = document.querySelector('[data-module="hmrc-accessible-autocomplete"]');
    // load autocomplete - now handled by the HMRC component wrapper in Twirl
    // accessibleAutocomplete.enhanceSelectElement({
    //     selectElement: originalSelect,
    //     showAllValues: true
    // });

    // =====================================================
    // Polyfill autocomplete once loaded
    // =====================================================
    var checkForLoad = setInterval(checkForAutocompleteLoad, 50);
    var parentForm = upTo(originalSelect, 'form');

    function polyfillAutocomplete(){
        var combo = parentForm.querySelector('[role="combobox"]');

        // =====================================================
        // Update autocomplete once loaded with fallback's aria attributes
        // Ensures hint and error are read out before usage instructions
        // =====================================================
        if(originalSelect && originalSelect.getAttribute('aria-describedby') > ""){
            if(parentForm){
                if(combo){
                    combo.setAttribute('aria-describedby', originalSelect.getAttribute('aria-describedby') + ' ' + combo.getAttribute('aria-describedby'));
                }
            }
        }
        // =====================================================
        // Update autocomplete once loaded with error styling if needed
        // This won't work if the autocomplete css is loaded after the frontend library css because
        // the autocomplete's border will override the error class's border (they are both the same specificity)
        // but we can use the class assigned to build a more specific rule
        // =====================================================
        setErrorClass();
        function setErrorClass(){
            if(originalSelect && originalSelect.classList.contains("govuk-select--error")){
                if(parentForm){
                    if(combo){
                        combo.classList.add("govuk-input--error");
                        // Also set up an event listener to check for changes to input so we know when to repeat the copy
                        combo.addEventListener('focus', function(){setErrorClass()});
                        combo.addEventListener('blur', function(){setErrorClass()});
                        combo.addEventListener('change', function(){setErrorClass()});
                    }
                }
            }
        }

        // =====================================================
        // Ensure when user replaces valid answer with a non-valid answer, then valid answer is not retained
        // =====================================================
        var holdSubmit = true;
        parentForm.addEventListener('submit', function(e){
            if(holdSubmit){
                e.preventDefault()
                if(originalSelect.querySelectorAll('[selected]').length > 0 || originalSelect.value > ""){

                    var resetSelect = false;

                    if(originalSelect.value){
                        if(combo.value != originalSelect.querySelector('option[value="' + originalSelect.value +'"]').text){
                            resetSelect = true;
                        }
                    }
                    if(resetSelect){
                        originalSelect.value = "";
                        if(originalSelect.querySelectorAll('[selected]').length > 0){
                            originalSelect.querySelectorAll('[selected]')[0].removeAttribute('selected');
                        }
                    }
                }

                holdSubmit = false;
                //parentForm.submit();
                HTMLFormElement.prototype.submit.call(parentForm); // because submit buttons have id of "submit" which masks the form's natural form.submit() function
            }
        })

    }
    function checkForAutocompleteLoad(){
        if(parentForm.querySelector('[role="combobox"]')){
            clearInterval(checkForLoad)
            polyfillAutocomplete();
        }
    }


}


// Find first ancestor of el with tagName
// or undefined if not found
function upTo(el, tagName) {
    tagName = tagName.toLowerCase();

    while (el && el.parentNode) {
      el = el.parentNode;
      if (el.tagName && el.tagName.toLowerCase() == tagName) {
        return el;
      }
    }

    // Many DOM methods return null if they don't
    // find the element they are searching for
    // It would be OK to omit the following and just
    // return undefined
    return null;
}
`;

describe('Patched accessible autocomplete', () => {
  describe('original select has aria-describedby links (for example for an error and/or hint)', () => {
    it('should prepend them to its own aria-describedby, so that the hint and error will be announced', async () => {
      await render(page, withHmrcStylesAndScripts(`
        <div class="govuk-form-group govuk-form-group--error">
          <label class="govuk-label" for="location">
            Choose location
          </label>
          <div id="location-hint" class="govuk-hint">
            This can be different to where you went before
          </div>
          <p id="location-error" class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span> Select a location
          </p>
          <select class="govuk-select govuk-select--error" id="location" name="location" aria-describedby="location-hint location-error" data-module="hmrc-accessible-autocomplete">
            <option value="choose" selected>Choose location</option>
            <option value="eastmidlands">East Midlands</option>
            <option value="eastofengland">East of England</option>
            <option value="london">London</option>
            <option value="northeast">North East</option>
            <option value="northwest">North West</option>
            <option value="southeast">South East</option>
            <option value="southwest">South West</option>
            <option value="westmidlands">West Midlands</option>
            <option value="yorkshire">Yorkshire and the Humber</option>
          </select>
        </div>
      `));

      const element = await page.$('#location');
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      const ariaDescribedBy = await element.evaluate((el) => el.getAttribute('aria-describedby'));

      expect(tagName).not.toBe('select'); // or select element was not enhanced to be an autocomplete component
      expect(ariaDescribedBy).toBe('location-hint location-error location__assistiveHint');
    });

    it('should not be possible for them to be added twice if page is still using adams patch', async () => {
      await render(page, withHmrcStylesAndScripts(`
        <form>
          <div class="govuk-form-group govuk-form-group--error">
            <label class="govuk-label" for="location">
              Choose location
            </label>
            <div id="location-hint" class="govuk-hint">
              This can be different to where you went before
            </div>
            <p id="location-error" class="govuk-error-message">
              <span class="govuk-visually-hidden">Error:</span> Select a location
            </p>
            <select class="govuk-select govuk-select--error" id="location" name="location" aria-describedby="location-hint location-error" data-module="hmrc-accessible-autocomplete">
              <option value="choose" selected>Choose location</option>
              <option value="eastmidlands">East Midlands</option>
              <option value="eastofengland">East of England</option>
              <option value="london">London</option>
              <option value="northeast">North East</option>
              <option value="northwest">North West</option>
              <option value="southeast">South East</option>
              <option value="southwest">South West</option>
              <option value="westmidlands">West Midlands</option>
              <option value="yorkshire">Yorkshire and the Humber</option>
            </select>
          </div>
        </form>
      `));

      await page.evaluate(adamsPolyfill);
      await delay(100); // because it takes ~50ms for adam's polyfill to apply

      const element = await page.$('#location');
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      const ariaDescribedBy = await element.evaluate((el) => el.getAttribute('aria-describedby'));

      expect(tagName).not.toBe('select'); // or select element was not enhanced to be an autocomplete component
      expect(ariaDescribedBy).toBe('location-hint location-error location__assistiveHint');
    });
  });
  describe('original select has an error', () => {
    it('should have the border colour of a gov.uk input with errors', async () => {
      await render(page, withHmrcStylesAndScripts(`
        <div class="govuk-form-group govuk-form-group--error">
          <label class="govuk-label" for="location">
            Choose location
          </label>
          <div id="location-hint" class="govuk-hint">
            This can be different to where you went before
          </div>
          <p id="location-error" class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span> Select a location
          </p>
          <select class="govuk-select govuk-select--error" id="location" name="location" aria-describedby="location-hint location-error" data-module="hmrc-accessible-autocomplete">
            <option value="choose" selected>Choose location</option>
            <option value="eastmidlands">East Midlands</option>
            <option value="eastofengland">East of England</option>
            <option value="london">London</option>
            <option value="northeast">North East</option>
            <option value="northwest">North West</option>
            <option value="southeast">South East</option>
            <option value="southwest">South West</option>
            <option value="westmidlands">West Midlands</option>
            <option value="yorkshire">Yorkshire and the Humber</option>
          </select>
        </div>
      `));

      const element = await page.$('#location');
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      const borderColor = await element.evaluate((el) => getComputedStyle(el).getPropertyValue('border-color'));

      // await jestPuppeteer.debug();

      expect(tagName).not.toBe('select'); // or select element was not enhanced to be an autocomplete component
      expect(borderColor).toBe('rgb(212, 53, 28)');
    });
  });
  it('should not retain previous valid selection if an option that does not exist is entered', async () => {
    await render(page, withHmrcStylesAndScripts(`
      <div class="govuk-form-group govuk-form-group--error">
        <label class="govuk-label" for="location">
          Choose location
        </label>
        <div id="location-hint" class="govuk-hint">
          This can be different to where you went before
        </div>
        <p id="location-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">Error:</span> Select a location
        </p>
        <select class="govuk-select govuk-select--error" id="location" name="location" aria-describedby="location-hint location-error" data-module="hmrc-accessible-autocomplete">
          <option value="choose" selected>Choose location</option>
          <option value="eastmidlands">East Midlands</option>
          <option value="eastofengland">East of England</option>
          <option value="london">London</option>
          <option value="northeast">North East</option>
          <option value="northwest">North West</option>
          <option value="southeast">South East</option>
          <option value="southwest">South West</option>
          <option value="westmidlands">West Midlands</option>
          <option value="yorkshire">Yorkshire and the Humber</option>
        </select>
      </div>
    `));

    await expect(page).toFill('#location', 'Lon');
    await page.$eval('#location + ul li:nth-child(1)', (firstAutocompleteSuggestion) => firstAutocompleteSuggestion.click());
    expect(await page.$eval('select', (select) => select.value)).toBe('london');
    await expect(page).toFill('#location', 'Bristol');
    await page.$eval('#location', (input) => input.blur()); // simulate clicking out of field
    expect(await page.$eval('select', (select) => select.value)).toBe('');
  });
});
