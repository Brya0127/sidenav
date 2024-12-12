$(document).ready(function () {
   
    initSideNav();
    initBttBtn();
});

/*Back to top button*/
function initBttBtn() {
    var btn = $('#btt-button');

    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            btn.addClass('showBtt');
        } else {
            btn.removeClass('showBtt');
        }
    });

    btn.on('click', function (e) {
        e.preventDefault();
        $(window).scrollTop(0);
        if($('.useSidenav')){
            $('#nav a').removeClass('active');
        }
    });
}

function initSideNav() {
   
   if($('.useSidenav').length){
    var $navUl;
    var $lastH2Li = null;
    var activeH1Id = null;
    var activeH2Id = null;
    var activeH3Id = null;
    var sidenavStateKey = 'sidenavState'; // Key for local storage

    // Detect page language from the HTML lang property
    var lang = $('html').attr('lang') || 'en';
    var textOnThisPage = lang === 'fr' ? 'Sur cette page' : 'On this page';
    var textHide = lang === 'fr' ? 'Réduire' : 'Hide';
    var textToolTip = lang === 'fr' ? 'Basculer la navigation' : 'Toggle page navigation';
    // Create and inject the left-nav structure dynamically
    function createSideNav() {
        var $h1 = $('h1').first();
        if ($h1.length) {
            var $leftNav = $(`
                <div class="navWrap">
                    <div class="left-nav">
                        <div class="nav-header">
                            <h5 id="on-this-page">${textOnThisPage}</h5>
                            <div class="toggle-wrapper">
                                <button id="nav-toggle" title="${textToolTip}">
                                    <span>${textHide}</span><i id="toggle-icon" class="fas"></i>
                                </button>
                            </div>
                        </div>
                        <nav id="nav" class="sidebar" role="navigation" aria-label="Sidebar">
                            <ul class="lst-spcd"></ul>
                        </nav>
                    </div>
                </div>
            `);
            $h1.after($leftNav); // Inject the left-nav under the h1
            $navUl = $leftNav.find('#nav > ul'); // Assign the dynamic ul
        }
    }

    // Restore sidenav state from local storage
    function restoreSidenavState() {
        var sidenavState = localStorage.getItem(sidenavStateKey);
        if (sidenavState === 'open' || sidenavState === null) {
            openSidenav();
        } else {
            closeSidenav();
        }
    }

    // Save sidenav state to local storage
    function saveSidenavState(isOpen) {
        localStorage.setItem(sidenavStateKey, isOpen ? 'open' : 'closed');
    }

    // Functions to open and close the sidenav
    function openSidenav() {
        var $sidenavParent = $('.useSidenav');
        $sidenavParent.removeClass('closed').addClass('open');
        $('#toggle-icon').removeClass('fa-list');
        $('#nav-toggle span').text(textHide);
    }

    function closeSidenav() {
        var $sidenavParent = $('.useSidenav');
        $sidenavParent.removeClass('open').addClass('closed');
        $('#toggle-icon').addClass('fa-list');
        $('#nav-toggle span').text('');
    }

    // Initialize sidenav based on saved state
    createSideNav();
    restoreSidenavState();

    // Handle toggle button click
    $('#nav-toggle').on('click', function () {
        var $sidenavParent = $('.useSidenav');
        if ($sidenavParent.hasClass('open')) {
            closeSidenav();
            saveSidenavState(false); // Save state as "closed"
        } else {
            openSidenav();
            saveSidenavState(true); // Save state as "open"
        }
    });

    // Dynamically populate navigation based on headings
    $('h1, .content-area h2, .content-area h3').each(function () {
        var $heading = $(this);
        var headingText = $heading.text();
        var headingId = $heading.attr('id');

        if (!headingId) {
            headingId = headingText.replace(/\s+/g, '-').toLowerCase();
            $heading.attr('id', headingId);
        }

        var $link = $('<a class="sidenav-link"></a>').attr('href', '#' + headingId).text(headingText);
        var $li = $('<li></li>').append($link);

        if ($heading.is('h1')) {
            $navUl.prepend($li); // Add the h1 link at the top of the navigation

            $link.on('click', function (event) {
                // event.preventDefault();
                $('#nav a').removeClass('active');
                $(this).addClass('active');

                // var targetOffset = $heading.offset().top;
                // $('html, body').animate({ scrollTop: targetOffset }, 300);
            });
        } else if ($heading.is('h2')) {
            var $button = $('<button></button>')
                .addClass('chevron-btn')
                .html('<span class="chevron fa fa-angle-right"></span>')
                .attr('aria-expanded', 'false');

            var $div = $('<div></div>').append($button);
            $li.prepend($div);
            $navUl.append($li);
            $lastH2Li = $li;

            $link.on('click', function (event) {
                // event.preventDefault();
                $('#nav a').removeClass('active');
                $(this).addClass('active');

                // var targetOffset = $heading.offset().top;
                // $('html, body').animate({ scrollTop: targetOffset }, 300);

                toggleUl($(this));
            });

            $button.on('click', function (event) {
                event.preventDefault();
                toggleUl($(this).parent().siblings('a'));
            });
        } else if ($heading.is('h3')) {
            if ($lastH2Li && $lastH2Li.children('ul').length === 0) {
                $lastH2Li.append('<ul></ul>');
            }
            $lastH2Li.children('ul').append($li);
        }
    });

    function toggleUl($link) {
        var $currentUl = $link.siblings('ul');

        if ($currentUl.is(':visible')) {
            $currentUl.removeClass("shown");
            $link.siblings('div').find('.chevron').removeClass('rotate');
            $link.siblings('div').attr('aria-expanded', 'false');
        } else {
            $currentUl.addClass("shown");
            $link.siblings('div').find('.chevron').addClass('rotate');
            $link.siblings('div').attr('aria-expanded', 'true');
        }
    }

    // Scroll handler to update active class
    $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        var currentH1Id = null;
        var currentH2Id = null;
        var currentH3Id = null;

        // Determine if h1 is active
        var $h1 = $('h1');
        if ($h1.length) {
            var h1Top = $h1.offset().top - 150;
            var firstH2Top = $('.content-area h2').first().offset()?.top || Infinity;

            if (scrollTop >= h1Top - 150 && scrollTop < firstH2Top - 150) {
                currentH1Id = $h1.attr('id');
            }
        }

        if (currentH1Id) {
            if (currentH1Id !== activeH1Id) {
                activeH1Id = currentH1Id;
                activeH2Id = null;
                activeH3Id = null;

                $('#nav a').removeClass('active');
                $('#nav a[href="#' + currentH1Id + '"]').addClass('active');
            }
        } else {
            if (activeH1Id) {
                $('#nav a[href="#' + activeH1Id + '"]').removeClass('active');
                activeH1Id = null;
            }
        }

        $('.content-area h2').each(function () {
            var $heading = $(this);
            if (scrollTop >= $heading.offset().top - 150) {
                currentH2Id = $heading.attr('id');
            }
        });

        if (currentH2Id && currentH2Id !== activeH2Id) {
            activeH2Id = currentH2Id;
            activeH3Id = null;

            $('#nav a').removeClass('active');
            $('#nav a[href="#' + currentH2Id + '"]').addClass('active');
        }

        if (activeH2Id) {
            $('.content-area h3').each(function () {
                var $heading = $(this);
                if (scrollTop >= $heading.offset().top - 150) {
                    var parentH2 = $heading.prevAll('h2').first().attr('id');
                    if (parentH2 === activeH2Id) {
                        currentH3Id = $heading.attr('id');
                    }
                }
            });
        }

        if (currentH3Id && currentH3Id !== activeH3Id) {
            activeH3Id = currentH3Id;
            $('#nav ul ul a').removeClass('active');
            $('#nav a[href="#' + currentH3Id + '"]').addClass('active');
        }

        if (!currentH3Id && activeH3Id) {
            activeH3Id = null;
            $('#nav ul ul a').removeClass('active');
        }
    });
   }
};

