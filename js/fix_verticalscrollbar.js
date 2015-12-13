// This script fixes the shift that occurs in a centered layout
// when the page grows and forces scrollbars to appear.
$(function () {
    var body = $("body");

    var previousWidth = null;

    // Function that applies padding to the body
    // to adjust its position.
    var resizeBody = function () {
        var currentWidth = body.width();
        if (currentWidth != previousWidth) {
            previousWidth = currentWidth;

            // Measure the scrollbar size
            body.css("overflow", "hidden");
            var scrollBarWidth = body.width() - currentWidth;
            body.css("overflow", "auto");

            body.css("margin-left", scrollBarWidth + "px");
        }
    };

    // setInterval is required because the resize event
    // is not fired when a scrollbar appears or disappears.
    setInterval(resizeBody, 100);
    resizeBody();
});
