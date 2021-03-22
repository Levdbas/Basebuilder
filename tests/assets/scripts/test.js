export default function test() {
   const navbar = $('.navbar');
   var navbarHeight = navbar.outerHeight();
   var lastScrollTop = 0;
   var delta = 600;

   function menuScroller() {
      var scroll = $(window).scrollTop();
      if (scroll >= 100) {
         navbar.addClass('scroll');
      } else {
         navbar.removeClass('scroll');
      }

      hasScrolled();
   }

   function hasScrolled() {
      var st = $(window).scrollTop();
      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - st) <= delta) return;
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.

      if (st > lastScrollTop && st > navbarHeight) {
         // Scroll Down
         navbar.removeClass('nav-down').addClass('nav-up');
         $('.menu-item-has-children').removeClass('open');
         $('.dropdown-menu').collapse('hide');
      } else {
         // Scroll Up
         if (st + $(window).height() < $(document).height()) {
            navbar.removeClass('nav-up').addClass('nav-down');
         }
      }
      lastScrollTop = st;
   }

   //window.addEventListener('scroll', throttle(menuScroller, 200, { leading: true, trailing: true }));
}