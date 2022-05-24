import GOVUKFrontend from 'govuk-frontend/govuk/all';
import HMRCFrontend from './all';

window.GOVUKFrontend = GOVUKFrontend;
window.HMRCFrontend = HMRCFrontend;

GOVUKFrontend.initAll();
HMRCFrontend.initAll();
