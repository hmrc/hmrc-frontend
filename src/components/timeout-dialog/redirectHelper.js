function RedirectHelper() {}

RedirectHelper.redirectToUrl = (url) => {
  // This exists to make redirects more testable
  window.location.href = url;
};

export default RedirectHelper;
