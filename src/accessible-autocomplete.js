import HMRCAccessibleAutocomplete from 'accessible-autocomplete';
import { nodeListForEach } from './common';
import AccessibleAutoComplete from './components/accessible-autocomplete/accessible-autocomplete';

window.HMRCAccessibleAutocomplete = HMRCAccessibleAutocomplete;

const $AccessibleAutocomplete = document.querySelectorAll('select[data-module="hmrc-accessible-autocomplete"]');
if ($AccessibleAutocomplete) {
  nodeListForEach($AccessibleAutocomplete, (selectElement) => {
    new AccessibleAutoComplete(selectElement, window, document).init();
  });
}
