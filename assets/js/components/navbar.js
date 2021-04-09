var mobileOpenBtn = document.querySelector('.navbar-mobile-btn');
var navbarMenu = document.querySelector('.navbar-navigation');
var homepageDemo = document.querySelector('.homepage-demo');

mobileOpenBtn.addEventListener('click', function(){
    mobileOpenBtn.classList.toggle('navbar-active');

    if(mobileOpenBtn.classList.contains('navbar-active')) {
        navbarMenu.setAttribute ('style', 'display: inline-flex !important; height: 100vh;')
        homepageDemo.setAttribute('style','overflow-y: hidden');
    }
    if(!mobileOpenBtn.classList.contains('navbar-active')) {
        navbarMenu.setAttribute ('style', 'display: inline-flex !important; animation: heighSlideOut 0.5s;');
        setTimeout(function(){
            navbarMenu.removeAttribute('style');
            homepageDemo.removeAttribute('style');
        },500);
    }
})