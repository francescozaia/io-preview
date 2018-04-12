$(function () {


    var smallDevice = window.innerWidth < 992;

    var staffPathArray = [];

    // Per ogni Path SVG creo un'animazione senza autoplay, che verrà animata secondo un setInterval
    $('.staff__path').each(function (index) {

        $element = $(this);
        let pathID = $(this).data('index');
        let pathName = $(this).data('name');
        let path = anime.path('[data-index="' + pathID + '"] path');

        let animeTimeline = anime.timeline({
            targets: '[data-index="' + pathID + '"] .staff__note',
            easing: 'easeInOutQuart',
            autoplay: false,
            begin: function (anim) {
                $('.ball--' + pathName).addClass('ball--burst');
                $('[data-index="' + pathID + '"] .staff__note').removeClass('staff__note--burst');
            },
            complete: function () {
                $('.ball--' + pathName).removeClass('ball--burst');
                $('[data-index="' + pathID + '"] .staff__note').addClass('staff__note--burst');
                $('[data-index="' + pathID + '"] .staff__note').fadeTo("slow", 0);
                let audio = document.getElementById('ting');
                audio.play();
            }
        });

        animeTimeline.add({
            opacity: 1,
            duration: 1000
        }).add({
            opacity: 1,
            translateX: path('x'),
            translateY: path('y'),
            duration: $(this).data('duration')
        });

        staffPathArray.push(animeTimeline);
    });

    // sfondo in parallasse
    var parallaxInstance = new Parallax($('.galaxy')[0]);

    var controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({triggerElement: "#section_1"})
        .on("leave", function () {
            $(".device__content--1").removeClass("device__content--in");
        });

        for (var _i = 2; _i < 7; _i++) {
            var a = (function (i) {
                new ScrollMagic.Scene({
                    triggerElement: "#section_" + i,
                    duration: window.innerHeight - 100
                })
                    .on("enter", function () {
                        $("#section_" + i).addClass("active");
                        $("#section_" + i + " .section-text").addClass("section-text__in");

                            $(".device__content--" + i).addClass("device__content--in");

                    })
                    .on("leave", function () {
                            $("#section_" + i).removeClass("active");
                            $("#section_" + i + " .section-text").removeClass("section-text__in");
                            $(".device__content--" + i).removeClass("device__content--in");
                    }).addTo(controller); //.addIndicators({name:"section:" + i})
            })(_i)
        }

    setInterval(function () {

        if (!smallDevice) {
            var el = $('.italia__dot');
            var w = el.width();
            var h = el.height()
            // imposta una posizione random per il pallino verde
            el.fadeTo(400, 0).promise().done(function () {
                el.css({
                    backgroundPosition: Math.floor((Math.random() * w)) + 'px ' + Math.floor((Math.random() * h)) + 'px'
                }).fadeTo(400, 1);
            });

            // prende un Path SVG casuale nel pentagramma e ri-avvia l'animazione
            staffPathArray[Math.floor(Math.random() * staffPathArray.length)].restart();
        }
    }, 2400);

    $(window).on('scroll', function (event) {
        if ($(window).scrollTop() > $('.section__1').height() - 50) {
            $('.navigation').addClass('navigation--top');
            $('.navigation__slim').addClass('navigation__slim--blue'); // TODO vedere per mobile
            parallaxInstance.disable();
            if (!smallDevice) {
                $('.section__2 .section-wrapper').addClass('section-wrapper--margin-top');
                $('.device').css({'zIndex': -2}); // TODO vedere per mobile
                $('.device').addClass('device--down');
                // Mute any sound
                document.getElementById('ting').muted = true;
            }
        } else {
            $('.navigation').removeClass('navigation--top');
            $('.navigation__slim').removeClass('navigation__slim--blue'); // TODO vedere per mobile
            parallaxInstance.enable();
            if (!smallDevice) {
                $('.section__2 .section-wrapper').removeClass('section-wrapper--margin-top');
                $('.device').css({'zIndex': 'auto'}); // TODO vedere per mobile
                $('.device').removeClass('device--down');
                // Mute any sound
                document.getElementById('ting').muted = false;
            }
        }
    });

    $(window).on('resize', function (event) {
        smallDevice = window.innerWidth < 992;
    });

// TODO debounce

})
;