window.onload = () => {
  const SESSION_DURATION = 15 * 60 * 1000;   
  const WARNING_TIME = 2* 60 * 1000;       

  setTimeout(() => {
    const warning = document.getElementById('session-warning');
    if (warning) warning.style.display = 'block';
  }, SESSION_DURATION - WARNING_TIME);

  setTimeout(() => {
    window.location.href = '/logout';
  }, SESSION_DURATION);
};
