// Get the navbar
let navbar = document.getElementById("navbar");

// Get the offset position of the navbar
let sticky = navbar.offsetHeight * 2;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {


  if (window.pageYOffset >= sticky) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
}

window.onscroll = function() {myFunction()};

// Navigation Toggle
const navbarNav = document.querySelector('.navbar__list');
const navbarLogo = document.querySelector('.navbar__logo');
const navbarToggler = document.querySelector('.navbar__toggler');

navbarToggler.addEventListener('click', () => {
  // console.log('click')
  navbar.classList.toggle('active');
});



// Modal DELETE confirmation



// const addModal = () => {
//   const modal = document.createElement('div');
//   modal.classList.add('modal');

//   const post = document.getElementById('post');
//   post.appendChild(modal);
// }


// const addModal = () => {
//   const modal = document.createElement('div').classList.add("modal");
//   const modalContent = document.createElement('div').classList.add('modal__content');

//   modal.appendChild(modalContent);
//   const post = document.getElementById("post");
//   post.appendChild(modal);
// }
window.onscroll = function () { myFunction() };
