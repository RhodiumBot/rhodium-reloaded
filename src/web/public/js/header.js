$(window).on("scroll", function () {
    if ($(this).scrollTop() > 100) {
        $(".header").addClass("scrolled");
    }
    else {
        $(".header").removeClass("scrolled");
    }
});