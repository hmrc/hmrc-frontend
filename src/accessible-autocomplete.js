import HMRCAccessibleAutocomplete from 'accessible-autocomplete';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'nodelist-foreach-polyfill';
import AccessibleAutoComplete from './components/accessible-autocomplete/accessible-autocomplete';

window.HMRCAccessibleAutocomplete = HMRCAccessibleAutocomplete;

const $AccessibleAutocomplete = document.querySelectorAll('select[data-module="hmrc-accessible-autocomplete"]');
if ($AccessibleAutocomplete) {
  $AccessibleAutocomplete.forEach((selectElement) => {
    new AccessibleAutoComplete(selectElement, window, document).init();
  });
}
