'use strict';
(function ($) {

    // setup variables
    var $card = $('#card');
    TweenMax.set($card, {transformPerspective: 900, transformOrigin: 'center', ease: Power1.easeOut});

    $card.mouseover(function () {

        $card.css('cursor','pointer');

        $(document).mousemove(function (event) {
            // Detect mouse position
            var xPos = (event.clientX / $card.width()) - 0.5,
                yPos = (event.clientY / $card.height()) - 0.5;
            // Tilt the card container
            TweenMax.to($card, 0.6, { rotationY: 17 * xPos, rotationX: 17 * yPos});
        })

    });
    $card.mouseleave(function () {
        // unbind the mousemove event
        $(document).off("mousemove");
        // tween to initial position
        TweenMax.to($card, 0.6, { rotationY: 0, rotationX: 0});

    });

})(jQuery);