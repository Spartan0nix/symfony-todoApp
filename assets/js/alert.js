var AlertprogressBar = document.querySelectorAll(".alert-progress-bar");
var alert = document.querySelectorAll(".alert");

AlertprogressBar.forEach( el => {
   el.addEventListener('animationend', () => {
      alert.forEach(element => {
         element.style.display = "none";
         element.height = '0px';
      });
   })
})

var pageProgressBar = document.querySelectorAll('.page-progress-bar');

pageProgressBar.forEach(el => {
   el.addEventListener('animationend' , () => {
      el.style.display = 'none';
   })
})
