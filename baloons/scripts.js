'use strict';
(function ($) {

    // setup variables
    var $homeSlide = $(".homeSlide");


    function init() {

        // $homeSlide.each(function() {
        //     TweenMax.set($(':nth-child(3)', this).css({    
        //         "background": `url(./images/${this.id}.png) center center no-repeat, 
        //                         url(./images/${this.id}a.png) center center no-repeat, 
        //                         url(./images/${this.id}b.png) center center no-repeat`}));
        //     TweenMax.set($(this).children().last().css({ "background-repeat": "no-repeat, no-repeat, no-repeat"}));
        //     TweenMax.set($(this).children().last().css({ "background-size": "auto, 0 0, 0 0"}));

        //     TweenMax.set($(this).children().first().css({"background": `url(./images/nonum.png) center center no-repeat`}));
        // }, this);

        $homeSlide.each(function () {
            var $this = $(this);
            $this.css({ "background": "url(./images/shadow.png) center center no-repeat"})
            $this.find('.lbl').text(this.id);
            $this.children().first().css({ "background": `url(./images/nonum.png) center center no-repeat` });

            $this.mouseover(function () {
                $this.children().first().css({ "background": "url(./images/Sеlected.png) center center no-repeat"});
                $this.children().css({ "cursor": "pointer"})
            });

            $this.mouseleave(function () {
                $this.children().first().css({ "background": "url(./images/nonum.png) center center no-repeat"});
            });

        }, this);

    }
    // Run Init function
    init();


    function bombAnime(slide) {
        var tlBomb = new TimelineMax(),
            label = slide.next().children();            

        unbindEvents($homeSlide);

        tlBomb
            .set(slide, { css: { "background": "url(./images/BOMB.png) center center no-repeat" }}, 5)
            .to(slide, 1.5, { scale: 1, ease: Power1.easeIn, autoAlpha: 1})
            .set(slide, { css: { "background": "url(./images/Boom.png) center center no-repeat" }})
            .to(label, 2, { className:"-=nb", ease: Power1.easeIn, autoAlpha: 1 }, 5)
            .to(slide, 1.5, {scale: 1, autoAlpha: 0});

        tlBomb.play(0)
    }

    function winAnime(slide) {
        var tlWin = new TimelineMax(),
            label = slide.next().children();

            tlWin
                .set(slide, { css: { "background": "url(./images/winBg.png) center center no-repeat" }}, 5)
                .to(label, 1, { className:"white-with-gold-shadow", ease: Power1.easeIn}, 5);

                tlWin.play(0);

    }

    function unbindEvents(selected) {

        selected.off();
        selected.children().off();
    }

    function isBomb(slide) {
        if (slide.classList.contains('bomb')) {
            return true;
        } else {
            return false;
        }
    }

    function baloonFly(slide) {

        var tlFly = new TimelineMax(),
            container = slide.parent(),
            label = $(container).children().last();

        TweenMax.set(slide, { transformOrigin: 'center center', transformPerspective: 800 });

        tlFly
            .to(slide, 0.5, { scale: 1.5 })
            .to(label, 0.5, { scale: 1.5}, "-=1")
            .add('startUp')
            .to(slide, 1, { rotationZ: -2, x: -25, ease: Power1.easeInOut }, 1)
            .fromTo(slide, 1, { rotationZ: -2, x: -25, ease: Power1.easeInOut, immediateRender: false }, { rotationZ: 2, x: 25, ease: Power1.easeInOut, repeat: 1, yoyo: true })
            .to(slide, 1, { rotationZ: 2.5, x: 25, ease: Power1.easeInOut })
            .to(slide, 3, { y: -window.innerHeight, ease: Power2.easeIn }, 'startUp')
            .add(function () { unbindEvents(container) }, 0)

        tlFly.play(0);


    }

    $homeSlide.click(function (e) {
        e.preventDefault();

        baloonFly($(this).children().first())

        if (isBomb(this)) {
            bombAnime($(':nth-child(2)', this));
        } else {
            winAnime($(':nth-child(2)', this));
        }

    });


})(jQuery);