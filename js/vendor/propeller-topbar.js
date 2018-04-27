/*Propeller topbar close*/
$(document).ready(function() {
	"use strict";
	$("body").addClass("propeller-topbar-body");
	$(".close-propeller-topbar").on("click",function() {
		$('body').addClass('hidden-propeller');
		$('.propeller-topbar').hide();
		$('body').removeClass('propeller-topbar-body');
	});
});
/* On Scroll Remove Propeller Topbar */
$(window).on("scroll",function() {
	"use strict";
	var IntroScroll = 56;
	var pageScroll = $(this).scrollTop();
	if (pageScroll > IntroScroll) {
//		$('.propeller-topbar').slideUp();
		$('body').removeClass('propeller-topbar-body');
	} else {
		if ($('body').hasClass('hidden-propeller')){
			$('.propeller-topbar').slideUp();
			$('body').removeClass('propeller-topbar-body');	
		} else {
			$('.propeller-topbar').show();
			$('body').addClass('propeller-topbar-body');
		}
	}
});	