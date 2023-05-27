$(document).ready(function() {
  function lockBody() {
    const DEFAULT_SCROLLBAR_WIDTH = getScrollbarWidth();
    document.body.classList.add("_lock");
    document.body.style.paddingRight = `${DEFAULT_SCROLLBAR_WIDTH}px`;
  }
  function unlockBody() {
    const DEFAULT_SCROLLBAR_WIDTH = getScrollbarWidth();
    document.body.classList.remove("_lock");
    document.body.style.paddingRight = '';
  }
  function getScrollbarWidth() {
    return window.innerWidth - document.body.offsetWidth;
  }
  function bodyLock(con) {
    if (con === true) {
      lockBody();
    } else if (con === false) {
      unlockBody();
    } else if (con === undefined) {
      if (!document.body.classList.contains("_lock")) {
        lockBody();
      } else {
        unlockBody();
      }
    } else {
      console.error("Неопределенный аргумент у функции bodyLock()");
    }
  }

  // реакция на scroll - показ фиксированного меню
  function fixedMenu() {
    var wt = $(window).scrollTop();
    var wh = $(window).height();
    var hh = $('.header').outerHeight();

    if (wt > hh) {
      $('#backToTop').addClass('show');
      $('.header-menu').addClass('fixed');
    } else {
      $('#backToTop').removeClass('show');
      $('.header-menu').removeClass('fixed');

    }

  }
  fixedMenu();

  $(window).on('scroll', function() {
    fixedMenu();
  });


 /*
  $('.header-menu__item').hover(
    function() {
      $('.menu-overlay').addClass( "active" );
    }, function() {
      $('.menu-overlay').removeClass( "active" );
    }
  );
  */


 // modal menu start
  $(document).on('click', '.fixed-menu-btn', function() {
    $('#modalMenu').addClass('active');
    lockBody();
  });
  $(document).on('click', '#modalMenu #modalClose', function() {
    $('#modalMenu').removeClass('active');
    unlockBody();
  });
  // modal menu end

  // fixed search start
  $(document).on('click', '#openSearch', function() {
    $('.search-fixed').addClass('active');
  });

  $(document).on('click', '#searchClose', function() {
    $('.search-fixed').removeClass('active');
  });
  // fixed search end

});
