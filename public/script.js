const hamburger = document.getElementById('hamburger');
const offnav = document.getElementById('offnav')

hamburger.addEventListener('click',function(){
    offnav.classList.toggle('show-nav')
})