var mobileOpenBtn = document.querySelector('.navbar-mobile-btn');
var navbarMenu = document.querySelector('.navbar-navigation');
var body = document.querySelector('body');

mobileOpenBtn.addEventListener('click', function(){
    mobileOpenBtn.classList.toggle('navbar-active');

    if(mobileOpenBtn.classList.contains('navbar-active')) {
        navbarMenu.setAttribute ('style', 'display: inline-flex !important; height: 100vh;')
        body.setAttribute('style','overflow-y: hidden');
    }
    if(!mobileOpenBtn.classList.contains('navbar-active')) {
        navbarMenu.setAttribute ('style', 'display: inline-flex !important; animation: heighSlideOut 0.5s;');
        setTimeout(function(){
            navbarMenu.removeAttribute('style');
            body.removeAttribute('style');
        },500);
    }
})