import { initAll } from 'govuk-frontend/dist/govuk/govuk-frontend.min';
import HMRCFrontend from './all';

// window.GOVUKFrontend = GOVUKFrontend;
window.HMRCFrontend = HMRCFrontend;

initAll();
HMRCFrontend.initAll();
