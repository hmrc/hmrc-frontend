import GOVUKFrontend from 'govuk-frontend';
import HMRCFrontend from './all';

window.GOVUKFrontend = GOVUKFrontend;
window.HMRCFrontend = HMRCFrontend;

GOVUKFrontend.initAll();
HMRCFrontend.initAll();
