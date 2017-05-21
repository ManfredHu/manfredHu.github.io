$(window).scroll(function() {
    //滚动超过视口的一半
    // $(window).scrollTop() > $(window).height()*0.5 ? $("#rocket").addClass("show") : $("#rocket").removeClass("show");
    $(window).scrollTop() > $(window).height()*0.5 ? $(".fix-sidebar-totop").addClass("show") : $(".fix-sidebar-totop").removeClass("show");
});

$(".fix-sidebar-totop").click(function() {
    // $("#rocket").addClass("launch");
    $("html, body").animate({
        scrollTop: 0
    }, 500, function() {
        // $("#rocket").removeClass("show launch");
        $(".fix-sidebar-totop").removeClass("show");
    });
    return false;
});

$("#homelogo").click(function() {
    $("html, body").animate({
        scrollTop: $(window).height()
    }, 500, null);
    return false;
});
