'use strict';
(function ($) {

    // setup variables
    var $homeSlide = $(".homeSlide");
    
    
    function init(){
      TweenMax.set($homeSlide.css({"background": "url(./images/bobo.png) center center no-repeat"}));
	}
	// Run Init function
	init();


    function bombAnime(slide){
            var tlBomb = new TimelineMax({delay: 2});

        tlBomb
            .set(slide, {css:{"background": "url(./images/BOMB.png) center center no-repeat"}, immediateRender: false})
            .to(slide, 1.5, {scale: 1.5, ease: Elastic.easeInOut})
            // .to(slide, 0.65, {scale: '+=0.5', ease: Elastic.easeOut})
            .set(slide, {css:{"background": "url(./images/Boom2.png) center center no-repeat"}}, '+=0.5' )
            .to(slide, 0.65,  {scale: '+=0.5', repeat: 0, yoyo: true, onComplete: unbindEvents()});
    }
   

   $homeSlide.mouseover(function (){ 
            TweenMax.set(this, {css:{"background": "url(./images/Sеlected.png) center center no-repeat"}});     
   })

   $homeSlide.mouseleave(function () {
            TweenMax.set(this, {css:{"background": "url(./images/bobo.png) center center no-repeat"}} );
    });

    function unbindEvents(){
        $homeSlide.off("mouseover");
        $homeSlide.off("mouseleave");
        $homeSlide.off("click");
    }

    function isBomb(slide){
        if (slide.classList.contains('bomb')) {
            return true;
        } else {
            return false;
        }
    }



    $homeSlide.click(function (e) {
	  e.preventDefault(); 
      if (isBomb(this)) {
            TweenMax.to(this, 1, {scale:0, onComplete: bombAnime(this), immediateRender:false});
           // bombAnime(this);
      } else {
          alert('no bomb here');
      }
       	  	  
	});


})(jQuery);