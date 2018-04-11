$(function () {

    let staffPathArray = [];

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
            begin: function(anim) {
                $('.ball--' + pathName).addClass('ball--burst');
                $('[data-index="' + pathID + '"] .staff__note').removeClass('staff__note--burst');
            },
            complete: function() {
                $('.ball--' + pathName).removeClass('ball--burst');
                $('[data-index="' + pathID + '"] .staff__note').addClass('staff__note--burst');
                $('[data-index="' + pathID + '"] .staff__note').fadeTo("slow",0);
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

    $('.page-scroll-container').fullpage({
        responsiveWidth: 900,
        anchors:['', 'messaggi', 'pagamenti', 'documenti', 'preferenze', 'profilo'],
        //fitToSection: true,
        css3: true,
        fitToSection: false,
        autoScrolling: false,
        'onLeave': function (index, nextIndex, direction) {

            if (index === 1 && direction === 'down') {
                // Squeeze the Staff
                //$('.staff').addClass('staff--squeeze');
                // Add a Blue background to the Slim Navigation
                $('.navigation__slim').addClass('navigation__slim--blue');
                // Move the device down a bit to leave space for the Navigation
                $('.device').addClass('device--down');
                // Mute any sound
                document.getElementById('ting').muted = true;
                parallaxInstance.disable();
            }
            if (index === 2 && direction === 'up') {
                //$('.staff').removeClass('staff--squeeze');
                $('.navigation__slim').removeClass('navigation__slim--blue');
                $('.device').removeClass('device--down');
                document.getElementById('ting').muted = false;
                parallaxInstance.enable();
            }

            $('div[class^="copy__content"]').removeClass('copy__content--in');
            $('.copy__content--' + nextIndex).addClass('copy__content--in');
            $('div[class^="device__content"]').removeClass('device__content--in');
            $('.device__content--' + nextIndex).addClass('device__content--in');
            $('div[class^="section-text"]').removeClass('in');
            $('.section-text--' + nextIndex).addClass('in');

        }
    });

    setInterval(function () {

        // imposta una posizione random per il pallino verde
        $('.italia__dot').fadeTo(400, 0).promise().done(function() {
            $('.italia__dot').css({
                backgroundPosition: Math.floor((Math.random() * document.body.clientWidth / 2)) + 'px ' + Math.floor((Math.random() * document.body.clientHeight)) + 'px'
            }).fadeTo(400, 1);
        });

        // prende un Path SVG casuale nel pentagramma e ri-avvia l'animazione
        staffPathArray[Math.floor(Math.random() * staffPathArray.length)].restart();

    }, 5000);

    $(window).on('scroll',function (event) {
        if ($(window).scrollTop() > $('.section__one').height() - 50){
            $('.navigation').addClass('navigation--top');
            $('.section__two .section-wrapper').addClass('section-wrapper--margin-top');
            $('.device').css({
                'zIndex': -2
            });
        } else {
            $('.navigation').removeClass('navigation--top');
            $('.section__two .section-wrapper').removeClass('section-wrapper--margin-top');
            $('.device').css({
                'zIndex': 'auto'
            });
        }
    });


});
