document.addEventListener('DOMContentLoaded', async function (e) {
  // Navigation Toggle
  const navigation = document.getElementById('navbar');
  const navbarNav = document.querySelector('.navbar__list');
  const navbarLogo = document.querySelector('.navbar__logo');
  const navbarToggler = document.querySelector('.navbar__toggler');

  navbarToggler.addEventListener('click', function (e) {
    navbar.classList.toggle('active');
  });

  // Go back button
  const gobackBtn = document.getElementById('gobackBtn');

  gobackBtn.onclick = function (e) {
    // console.log('click');
    location.assign(localStorage.getItem('prevPage'))
  }


});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('prevPage', `${location.href}`);
})
