import HMRCAccessibleAutocomplete from 'accessible-autocomplete';
import AccessibleAutoComplete from './components/accessible-autocomplete/accessible-autocomplete';

window.HMRCAccessibleAutocomplete = HMRCAccessibleAutocomplete;

const $AccessibleAutocomplete = document.querySelectorAll('select[data-module="hmrc-accessible-autocomplete"]');
if ($AccessibleAutocomplete) {
  $AccessibleAutocomplete.forEach((selectElement) => {
    new AccessibleAutoComplete(selectElement, window, document).init();
  });
}
