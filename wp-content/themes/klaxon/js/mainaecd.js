//Wrap all custom JS in an anonymous function that passes the alias "$" to everything so that "jQuery" doesn't have to be used
(function($) {
  //Global variables
  var mobileMenuInitialized = false; //Flag that mobile menu is already set up
  var megaMenuTarget = $(".menu-item-360"); //Where the mega menu is placed - remove if no mega menu

  //Begin JavaScript/jQuery setup
  //The "on ready"
  $(function() {
    checkScroll();
    // checkBrowserSupport();
    setupMobileMenu();
    setupExternalLinks();
    setupYouTube();
    initializeSliders();
    makeListenersPassive();

    //Optional features - if not needed, remove on your build
    setupGeolocation();

    $('.gtranslate .glink').on('click',function(){
        $('.gtranslate .glink').removeClass('active');
        $(this).addClass('active');
    });

    //If attorney search results are present, scroll to the section
    if ($('#attorney-search-results-bar').exists())
    {
      animateScroll($('#attorney-search-results-bar').offset().top - getScrollAdjustValue(), 300);
      $('#attorney-search-results-inner').attr("tabindex", "0");
      $('#attorney-search-results-inner').focus();
    }
    
    if($(".prac-banner-title").length)
    {
        setTimeout(function() {
       $(".prac-banner-title").css("opacity","1");
             $(".prac-banner-title").addClass("animated fadeInUp");
             }, 200); 
    }
    var input = document.getElementById("header-search-input");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("header-search-submit").click();
      }
    });

    //  if ($('.module-footer-a').exists()) {
    //   $('.module-footer-a').each(function() {
    //     var slideImageURL = $(this).attr('data-mobile-image');

    //     //Desktop alternate
    //     if (window.innerWidth >= 1281) {
    //       slideImageURL = $(this).attr('data-desktop-image');
    //     }
    //     if(window.innerWidth >= 600  && window.innerWidth < 1281 ){
    //       slideImageURL = $(this).attr('data-medium-image');
    //     } 

    //     $(this).css('background-image', "url(" + slideImageURL + ")");
    //   });
    // }



    //SIDEBAR JUMP LINKS
    //Generate list for table of contents and select options for mobile
    if ($('#sidebar-jump-links').exists())
    {
      $('.content h2').each(function() {
        //Get text from heading
        var thisHeadingText = $(this).text();

        //Convert text to lowercase, replace spaces with dashes, get rid of everything else
        thisHeadingID = "jump-" + thisHeadingText.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');

        //Give each heading a unique identifier
        $(this).attr('id', thisHeadingID);

        //Dynamically create list item within table of contents
        //Select is used on mobile
        $('#sidebar-jump-links-list').append('<li><button class="scroll-to interact no-button" data-scroll-to-id="' + thisHeadingID +'">' + thisHeadingText + '</button></li>');
        $('#sidebar-jump-links-select').append('<option value="#' + thisHeadingID + '">' + thisHeadingText + '</option>');
      });
    }

    //Respond to mobile input in the table of contents select element
    $('.scroll-to-select').on('change', function(e) {
      //Get selected option then scroll to it
      var selectedOption = ($(this).find(":selected").val());
      animateScroll($(selectedOption).offset().top - getScrollAdjustValue());
    });
    //END SIDEBAR JUMP LINKS




      function equalHeight(group) {     // Equal height blocks
        var tallest = 0;
        group.height("auto").each(function() {
          var thisHeight = $(this).height();
          if(thisHeight > tallest) {
            tallest = thisHeight;
          }
        });
        group.height(tallest);
      }



      equalHeight($(".module-blog-c-single"));





    //STICKY ELEMENTS
    //Used in longform template
    if ($('.make-sticky').exists())
    {
      $(".make-sticky").sticky({
        topSpacing: getScrollAdjustValue(),
        zIndex: 1
      });
    }
    //END STICKY ELEMENTS

    //CONTENT TAB BUTTONS
    //Used on attorney bios
    $('.content-tab-activate').on('click', function() {
      $(".content-tab-activate, .content-tab").removeActive();
      $("[data-content-tab='" + $(this).attr("data-content-tab") + "']").addActive();
      $(this).addActive();
    });
    $('#select-content-skip').on('change', function() {
      $(".content-tab-activate, .content-tab").removeActive();
      $("[data-content-tab='" + $(this).val() + "']").addActive();
      $(this).addActive();
    });

    $('.mobile-tab').on('click', function() {
      animateScroll($('#main').offset().top - getScrollAdjustValue());
    });
    //END CONTENT TAB BUTTONS

    //INPUT ACTIVE CLASS CONTROL
    //Inputs: Add class when field holds a value
    $("input, textarea").on("input", function() {
      if (this.value != "" && $(this).isActive() == false) {
        $(this).addActive();
      }
      else if (this.value == "") {
        $(this).removeActive();
      }
    });

    //Select fields: Add class when <select> is used
    $('select').on('change', function() {
      $(this).addActive();
    });

    $('select').on('focusin focusout', function() {
      $(this).closest('.select-wrapper').toggleClass('active');
    });
    //END INPUT ACTIVE CLASS CONTROL

    //ACCORDION CONTROL
    //Toggle accordion open and closed
    if ($('.accordion-item').exists()) {
      //If there are accordions on this page, set their ARIA properties
      $('.accordion-item').attr('aria-expanded', false);

      //Event listener for accordion items - titles are interactive
      $(".accordion-item-title").on("interact:action", function() {
        var parentAccordionItem = $(this).closest('.accordion-item');

        $(parentAccordionItem).siblings().removeClass('active').attr('aria-expanded', false); //Close sibling accordions

        if ($(parentAccordionItem).isActive() == false) {
          //Scroll to opened accordion's content
          if (isMobileScreen()) {
            animateScroll($(parentAccordionItem).offset().top - getScrollAdjustValue());
          }
          else {
            animateScroll($(parentAccordionItem).offset().top - getScrollAdjustValue());
          }
        }

        $(parentAccordionItem).toggleClass("active").attr('aria-expanded', true);
      });
    }

    //Open first accordion on load
    if ($('.open-first').exists()) {
      $(".open-first").each(function() {
        $(this).find('.accordion-item:first-of-type').addClass("active").attr('aria-expanded', true);
      });
    }
    //END ACCORDION CONTROL

    //CONTENT SELECTORS CONTROL
    //Copies content from a selected area to a target; used only on some modules
    $(".content-selector").on("interact:action", function() {
      $(this).toggleClass("active");
      $(this).siblings().removeActive();

      $('#content-selector-target').removeClass('animated fast fadeIn');
      $('#content-selector-target').html($(this).html());

      setTimeout(function() {
        $('#content-selector-target').addClass('animated fast fadeIn');
      }, 200);
    });
    //END CONTENT SELECTORS CONTROL

    //MAIN NAV FOCUS CONTROL
    //Ensures main navigation dropdowns remain open for keyboard focus
    $(".main-navigation-menu li, .mega-menu li").on("focusin mouseover", function() {
      $(this).addActive();
      $(this).siblings().removeActive();
    }).on("mouseleave", function() {
      $(this).removeActive();
    });
    //END MAIN NAV FOCUS CONTROL

    //MEGA MENUS
    if (isDesktopScreen())
    {
      $(megaMenuTarget).addClass('static');
      $('#mega-menu').detach().appendTo(megaMenuTarget);
    }
    //END MEGA MENUS

    //MAGNIFIC POPUP EXAMPLE
    // $('.popup-video').magnificPopup({
    //   type: 'iframe',
    //   iframe: {
    //     patterns: {
    //       youtube: {
    //         index: 'youtube.com/',
    //         id: 'v=',
    //         src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0'
    //       }
    //     },
    //     srcAction: 'iframe_src',
    //   }
    // });
    //END MAGNIFIC POPUP EXAMPLE

    //LAZY LOADING WITH LOZAD
		//Use class "lazy-img" and attribute "data-img-src" to lazy load an <img>
		//To randomly pick an image from a set, use attribute "data-img-srcs" like so: data-img-srcs="imageurl.jpg, imageurl.jpg"
		var imageLazyLoader = lozad('.lazy-img', {
			rootMargin: '10px 0px',
			threshold: 0.1,
			load: function(elementInView) {

				var imageToLoad = $(elementInView).attr('data-all-src');
				if(imageToLoad == undefined || imageToLoad == ""){
					if (window.innerWidth >= 1025)
					{
						var imageToLoad = $(elementInView).attr('data-desktop-src');
						console.log('Lazy loading an image: ' + imageToLoad);
					}
					else
					{
						var imageToLoad = $(elementInView).attr('data-mobile-src');
						console.log('Lazy loading an image: ' + imageToLoad);
					}
				}

			  if(imageToLoad == undefined)
				{
					return;
				}

				if (imageToLoad != ""){
				$(elementInView).attr('src', imageToLoad);
				}
			}
		});
		imageLazyLoader.observe();

    //Use class "lazy-bg" and attribute "data-bg-src" on any element using a CSS background image lazy load
		//To randomly pick background image from a set, use attribute "data-bg-srcs" like so: data-bg-srcs="imageurl.jpg, imageurl.jpg"
		const backgroundImageLazyLoader = lozad('.lazy-bg', {
			rootMargin: '80px 0px',
			threshold: 0.1,
			load: function(elementInView) {

				var imageToLoad = $(elementInView).attr('data-all-bg');

				if(imageToLoad == undefined || imageToLoad == ""){
					if (window.innerWidth >= 1025)
					{
						var imageToLoad = $(elementInView).attr('data-desktop-bg');
					}
					else
					{
						var imageToLoad = $(elementInView).attr('data-mobile-bg');
					}
				}

			  if(imageToLoad == undefined)
			    {
			      return;
			    }

				if (imageToLoad != "") {
					$(elementInView).css('background-image', "url(" + imageToLoad + ")");
				}
			  
				
			}
		});
		backgroundImageLazyLoader.observe();

    //Add an active class to an element when it enters view
    //Optionally, add a "data-delay" attribute equal to milliseconds, e.g. 500 for 0.5 seconds
    var activeInViewTrigger = lozad('.active-in-view', {
      rootMargin: '10px 0px',
      threshold: 0.1,
      load: function(elementInView) {
        var delayActive = 0;

        if ($(elementInView).attr('data-delay'))
        {
          delayActive = $(elementInView).attr('data-delay');
        }

        setTimeout(function() {
          $(elementInView).addActive();
          $(elementInView).removeClass('active-in-view');
        }, delayActive);
      }
    });
    activeInViewTrigger.observe();

    //Trigger animate in view with a specific animation class added
    //TO USE: Add class "specific-animate-in-view" to an element plus a data attribute "data-animation-class" equal to an animation class name
    var specificAnimateInViewTrigger = lozad('.animate-in-view', {
      rootMargin: '10px 0px',
      threshold: 0.1,
      load: function(elementInView) {
        var animToUse = $(elementInView).attr('data-animation-class');
        $(elementInView).addClass('animated ' + animToUse);
      }
    });
    specificAnimateInViewTrigger.observe();

    //Lazy load Google Map
    //Requires data attribute "data-embed-map-link" to be set
    var mapLoadInViewTrigger = lozad('.load-map-in-view', {
      rootMargin: '10px 0px',
      threshold: 0.1,
      load: function(elementInView) {
        var embedMapWidth = $(elementInView).attr('data-embed-map-width') ? $(elementInView).attr('data-embed-map-width') : 600;
        var embedMapHeight = $(elementInView).attr('data-embed-map-height') ? $(elementInView).attr('data-embed-map-height') : 450;

        //Add live <iframe> containing Google Map once the element is in view
        $(elementInView).append('<iframe src="' + $(elementInView).attr('data-embed-map-link') + '" width="' + embedMapWidth + '" height="' + embedMapHeight + '" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>');
      }
    });
    mapLoadInViewTrigger.observe();
    //END LAZY LOADING WITH LOZAD
  });

  //Window Load = Entire page including the DOM is loaded
  $(window).on("load", function() {
    //Initialize mCustomScrollbars if any exist
    if ($('.custom-scrollbar').exists() && isMobileScreen() == false) {
      $('.custom-scrollbar').mCustomScrollbar();
    }
  });

  //Sets up all slick sliders present on the page
  function initializeSliders() {
    $("#results-slider").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      autoplay: false,
      fade: true,
      speed: 500,
      arrows: true,
      prevArrow: $("#results-slider-previous"),
      nextArrow: $("#results-slider-next"),
      dots: false
    });

    $("#posts-slider").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      autoplay: true,
      fade: true,
      speed: 500,
      arrows: false,
      prevArrow: $("#posts-slider-previous"),
      nextArrow: $("#posts-slider-next"),
      dots: true
    });

    //MODULE-SPECIFIC SLIDERS
    $("#slider-practices-g").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      pauseOnHover: false,
      responsive: [{
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }],
      autoplay: false,
      fade: false,
      speed: 400,
      cssEase: "ease",
      dots: false,
      arrows: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      prevArrow: $("#slider-practices-g-prev"),
      nextArrow: $("#slider-practices-g-next")
    });

    $("#slider-testimonials-a").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      autoplay: true,
      fade: true,
      speed: 500,
      autoplaySpeed:5000,
      dots: false,
      arrows: false
    });

    $("#slider-testimonials-b").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      autoplay: true,
      fade: false,
      speed: 300,
      autoplaySpeed:7000,
      dots: false,
      arrows: true,
      prevArrow: $("#slider-testimonials-b-prev"),
      nextArrow: $("#slider-testimonials-b-next")
    });
    
  /*var slider = $('#slider-blog-c');
    slider.slick({
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        autoplay: true,
      autoplaySpeed:5000,
        fade: false,
      arrows: true,
        
    });*/

    $("#slider-blog-c").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      pauseOnHover: false,
      responsive: [{
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        },
         
          breakpoint: 767,
          settings: {
            slidesToShow: 1
          }
         
      }],
      autoplay: false,
      fade: false,
      speed: 300,
      cssEase: "ease",
      dots: true,
      arrows: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      prevArrow: $("#slider-blog-c-prev"),
      nextArrow: $("#slider-blog-c-next")
    });

    $("#slider-blog-d").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      autoplay: false,
      fade: true,
      speed: 500,
      dots: false,
      arrows: false
    });

    $("#slider-results-a").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      pauseOnHover: false,
      responsive: [{
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }],
      autoplay: false,
      fade: false,
      speed: 300,
      cssEase: "ease",
      dots: false,
      arrows: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      prevArrow: $("#slider-results-a-prev"),
      nextArrow: $("#slider-results-a-next")
    });

    $("#slider-results-b").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      pauseOnHover: false,
      responsive: [{
          breakpoint: 1024,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 639,
          settings: {
            slidesToShow: 1
          }
        }
      ],
      autoplay: false,
      fade: false,
      speed: 300,
      cssEase: "ease",
      dots: false,
      arrows: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      prevArrow: $("#slider-results-b-prev"),
      nextArrow: $("#slider-results-b-next")
    });

    $("#slider-badges-a").not('.slick-initialized').slick({
      infinite: true,
      pauseOnHover: false,
      pauseOnHover: false,
      responsive: [{
          breakpoint: 640,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3
          }
        }
      ],
      autoplay: false,
      fade: false,
      speed: 300,
      cssEase: "ease",
      dots: false,
      arrows: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      prevArrow: $("#slider-badges-a-prev"),
      nextArrow: $("#slider-badges-a-next")
    });
  }

  ///////////////////////
  // General Listeners //
  ///////////////////////

  //Fires custom event on any type of user interaction, not just clicks
  $("body").on("click keypress", ".interact", function(e) {
    if (e.type == "keypress" && e.which != 13 && e.which != 32) {
      return; //Enter (13) or Space (32) keypress ONLY
    }

    if ((e.timeStamp - $(this).attr('data-last-interact')) < 200) {
      return;
    }

    //Trigger interact event and add attribute to hold timestamp
    $(this).trigger("interact:action").attr('data-last-interact', e.timeStamp);

    console.log('Interact triggered');
  });

  //On window resize
  $(window).resize(function() {
    setupMobileMenu();
  });

  ///////////////////////////////////
  // Scrolls and On-Screen Reveals //
  ///////////////////////////////////

  $(window).on("scroll", function() {
    //Constant scroll detection with no debounce - Be careful with performance impact!
    checkScroll();
  });

  function checkScroll() {
    //Add class to body when scrolled beyond top of page
    if ($(window).scrollTop() > 100) {
      $("body").addClass("scrolled");
    }
    else {
      $("body").removeClass("scrolled");
    }
  }

  var checkScrollDebounce = debounce(function() {
    //Debounced scroll detection - Occurs on every scroll but at a limited rate

    //If scrolled to bottom, activate slideout feature in footer
    if ($('.sticky-footer').exists()) {
      //Detect page bottom
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        $('.sticky-footer').addActive();
      }
      else {
        $('.sticky-footer').removeActive();
      }
    }
    if ($('#bottom-slideout').exists()) {
      //Detect page bottom
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        $('#bottom-slideout').addActive();
      }
      else {
        $('#bottom-slideout').removeActive();
      }
    }

    //Check elements that are revealed on scroll
    $(".scroll-reveal").each(function() {
      //If element is on screen and not yet revealed, add classes
      var cur = $(this);
      if (cur.isOnScreen()) {
        if (!cur.hasClass("animated")) {
          cur.addClass("animated fadeInUp");
        }
      }
    });
  }, 25);
  window.addEventListener("scroll", checkScrollDebounce);

  //The "debounce" function slows down occurrence of frequent checks like on-scrolls for improved performance
  //https://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  /////////////
  // Scrolls //
  /////////////

  //Gradually scrolls window to element on click of any element with the "scroll-to" class
  $("body").on("interact:action", ".scroll-to", function(e) {
    e.preventDefault();
    var elementToScrollToID = '#' + $(this).attr("data-scroll-to-id");

    animateScroll($(elementToScrollToID).offset().top - getScrollAdjustValue());
  });

  //Scrolls window back to top of page
  $('.scroll-to-top').on("interact:action", function(e) {
    e.preventDefault();
    animateScroll(0);
  });

  function animateScroll(animateScrollLocation, scrollTimeMilliseconds) {
    //Set default value for time if none provided
    scrollTimeMilliseconds = scrollTimeMilliseconds || 400;

    $('html, body').animate({
      scrollTop: animateScrollLocation
    }, scrollTimeMilliseconds);
  }

  ////////////////////
  // YouTube Embeds //
  ////////////////////

  function addVideoMetadata() {
    var videoData;
    var apiKey = "AIzaSyCZ31XxRuVs421sDbf8uBxVOBNVGj3E2dI"; //Google API key
    var endpoint = "https://www.googleapis.com/youtube/v3/videos?id=" + $('.youtube-player').attr("data-id") + "&key=" + apiKey + "&part=snippet,contentDetails,statistics,status";

    $.getJSON(endpoint, function(json) {
      $("#data-video-info").append(json);
    });
  }

  function setupYouTube() {
    //Prepare YouTube video placeholders that turn into iframe on click
    if ($(".youtube-player").length == 0) {
      return;
    }

    var div;
    var n;
    var v = document.getElementsByClassName("youtube-player");

    for (n = 0; n < v.length; n++) {
      div = document.createElement("div");
      div.setAttribute("data-id", v[n].dataset.id);
      div.setAttribute("data-list", v[n].dataset.list);
      div.innerHTML = '<img src="https://img.youtube.com/vi/' + v[n].dataset.id + '/hqdefault.jpg" alt="">';

      //Add attributes and classes to the div to make interactive
      $(div).addClass("interact youtube-player-inner").attr("tabindex", "0");
      $(div).on("click keypress", getYouTubeFrame);

      //Add div to this player
      v[n].appendChild(div);
    }
  }

  function getYouTubeFrame() {
    var iframe = document.createElement("iframe");
    var embed = "https://www.youtube.com/embed/ID?autoplay=1&rel=0";

    iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "1");

    this.parentNode.replaceChild(iframe, this);
  }

  /////////////////
  // Mobile Menu //
  /////////////////

  //Sets up mobile menu - only once
  function setupMobileMenu() {
    if ((mobileMenuInitialized == true) || (isMobileScreen() == false))
    {
      //Only set up once, and only if on a mobile screen size
      return;
    }

    //Insert buttons and title in mobile menu
    $('<button class="mobile-navigation-next"><i class="fas fa-arrow-right"></i><span class="visually-hidden">Next Tab</span></button>').insertAfter($('#mobile-navigation .menu-item-has-children > a'));
    $('#mobile-navigation .sub-menu').prepend('<li class="mobile-navigation-previous"><button><i class="fas fa-arrow-left small-margin-right"></i>Back</button></li>');
    $('#mobile-navigation > ul').prepend('<div id="mobile-navigation-top"></div>');

    //Move mobile navigation top into place
    $('#mobile-navigation-top-inner').detach().appendTo('#mobile-navigation-top');

    mobileMenuInitialized = true;
  }

  //Mobile menu interaction: Open and close
  $('.mobile-menu-toggle').on('click', function() {
    toggleMobileMenu();
  });

  //Allow any clicks on container to close an open mobile menu
  $('#container').on('click', function() {
    if ($(this).isActive()) {
      toggleMobileMenu();
    }
  });

  //Opens or closes mobile menu, changing necessary classes
  function toggleMobileMenu() {
    $('#mobile-navigation').toggleClass('active');
    $('#mobile-navigation li').removeClass('sub-menu-open');

    setTimeout(function() {
      $('#container').toggleClass('active');
    }, 100);
  }

  //Mobile menu interaction: Paging controls
  //Because these buttons are created after page load, events handled by delegation
  $("#mobile-navigation").on("click", ".mobile-navigation-next", function(e) {
    e.preventDefault();
    $(this).parent().toggleClass('sub-menu-open');
  });

  $("#mobile-navigation").on("click", ".mobile-navigation-previous button", function(e) {
    e.preventDefault();
    $(this).closest('.menu-item-has-children').removeClass('sub-menu-open');
  });

  ///////////////////////
  // Passive Listeners //
  ///////////////////////

  //Functions to inform browser that you are not going to preventDefault() on scroll
  //Aims to eliminate page speed test error
  function makeListenersPassive() {
    var supportsPassive = eventListenerOptionsSupported();

    if (supportsPassive) {
      var addEvent = EventTarget.prototype.addEventListener;
      overwriteAddEvent(addEvent);
    }
  }

  function overwriteAddEvent(superMethod) {
    var defaultOptions = {
      passive: true,
      capture: false
    };

    EventTarget.prototype.addEventListener = function(type, listener, options) {
      var usesListenerOptions = typeof options === 'object';
      var useCapture = usesListenerOptions ? options.capture : options;

      options = usesListenerOptions ? options : {};
      options.passive = options.passive !== undefined ? options.passive : defaultOptions.passive;
      options.capture = useCapture !== undefined ? useCapture : defaultOptions.capture;

      superMethod.call(this, type, listener, options);
    };
  }

  function eventListenerOptionsSupported() {
    var supported = false;

    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supported = true;
        }
      });
      window.addEventListener("test", null, opts);
    }
    catch (e) {}

    return supported;
  }

  ///////////
  // Misc. //
  ///////////

  //Returns true if on homepage
  //Requires WordPress body classes to be in effect
  function isHomepage() {
    if (jQuery('body.home').length) {
      return true;
    }
    return false;
  }

  //Returns true no homepage class is present
  function isSubpage() {
    if (jQuery('body.home').length) {
      return false;
    }
    return true;
  }

  //Returns true if element is on screen
  //Usage: element.isOnScreen()
  function isOnScreen() {
    var viewport = {};
    viewport.top = jQuery(window).scrollTop();
    viewport.bottom = viewport.top + jQuery(window).height();
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
  }

  //Add attributes specifically to external links
  function setupExternalLinks() {
    $("a").filter(function() {
      return this.hostname && this.hostname !== location.hostname;
    }).attr("target", "_blank").attr("rel", "noopener").addClass("external-link");

    //Also open PDFs in new tab
    $('a[href$=".pdf"]').each(function() {
      $(this).attr('target', '_blank');
    });
  }

  //Returns a pixel height adjustment based precisely on header height
  function getScrollAdjustValue() {
    var scrollAdjust = $('#header-desktop').height();

    if (isMobileScreen())
    {
      scrollAdjust = $('#header-mobile').height();
    }

    //Add to the returned value to prevent flush against header scroll
    return scrollAdjust;
  }

  //Using Modernizr, scan for browser capabilities
  function checkBrowserSupport() {
    if (Modernizr == null)
    {
      return;
    }

    //WebP test
    Modernizr.on('webp', function(result) {
      if (result) {
        $('body').addClass('webp-support');
      }
      else
      {
        $('body').addClass('webp-no-support');
      }
    });
  }

  //Optional geolocation feature
  //Adds geolocation and other information to contact emails
  function setupGeolocation() {
    if (sessionStorage.geolocationReady)
    {
      return;
    }

    //Make AJAX request to store PHP SESSION variables containing geolocation data; requires API key
    setTimeout(function() {
      jQuery.ajax({
        type: "get",
        url: "/wp-content/themes/paperstreet/includes/include-geolocation.php",
        success: function(response) {
        }
      });

      console.log('Geolocation data saved for this session.');
      sessionStorage.geolocationReady = 'true';
    }, 2000);
  }
})(jQuery);
function slideGo(dir) {
  var slider = jQuery('#slider-blog-c');
  if(dir === "+") {
    slider.slick('slickNext');
  } else if ( dir === "-" ) {
    slider.slick('slickPrev');
  }
 }
 function searchValid(txt,frm)
 {
  if(frm == 'b')
  {
    var search = jQuery('#blog-search-input').val();
  }
  else if(frm == 's')
  {
    var search = jQuery('#repeat-search-input').val();
  }
  else if(frm == 'd')
  {
    var search = jQuery('#desktop-header-search-input').val();
  }
  else
  {       
    var search = jQuery('#header-search-input').val();    
  }
    if( search =='')
  {
     alert("Please type in a search.");
  }
  else
  {
    window.location.href = txt+"?s="+search;    
     
  }
 }
