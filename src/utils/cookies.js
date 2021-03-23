// Based on https://github.com/alphagov/govuk_template_jinja
export const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value}; path=/`;
  if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
    cookieString = `${cookieString}; expires=${date.toGMTString()}`;
  }
  if (window.location.protocol === 'https:') {
    cookieString += '; Secure';
  }
  document.cookie = cookieString;

  return cookieString;
};

export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0, len = cookies.length; i < len; i += 1) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};
