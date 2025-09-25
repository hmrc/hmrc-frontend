import { getCookie, setCookie } from '../../utils/cookies';

function UserResearchBanner($module) {
  this.$module = $module;
  this.$closeLink = this.$module.querySelector('.hmrc-user-research-banner__close');
  this.cookieName = 'mdtpurr';
  this.cookieExpiryDays = 28;
}

UserResearchBanner.prototype.init = function init() {
  const cookieData = getCookie(this.cookieName);

  if (cookieData == null) {
    this.$module.classList.add('hmrc-user-research-banner--show');
    if (this.$closeLink) {
      this.$closeLink.addEventListener('click', this.eventHandlers.noThanksClick.bind(this));
    }
  }
};

UserResearchBanner.prototype.eventHandlers = {
  noThanksClick(event) {
    event.preventDefault();

    setCookie(this.cookieName, 'suppress_for_all_services', { days: this.cookieExpiryDays });
    this.$module.classList.remove('hmrc-user-research-banner--show');
  },
};

export default UserResearchBanner;
