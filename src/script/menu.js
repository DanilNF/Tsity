var menu_btn=document.querySelector('.about__mobile-btn');
var menu_nav=document.querySelector('.about__mobile-nav');

menu_btn.addEventListener("click", function(e){
	e.preventDefault();
	if (menu_nav.style.display == 'none'){
		menu_nav.style.display = 'flex'
	}
	else{
		menu_nav.style.display = 'none'
	}
});
