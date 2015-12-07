$(document).ready(function() {

    var content = document.getElementsByTagName('body')[0];
    var bigtitle = document.getElementById('bigtitle');
    var smalltitle = document.getElementById('smalltitle');

    var smallTitleControl = function() {
        if (content.scrollTop > (bigtitle.clientHeight - smalltitle.clientHeight)) {
            smalltitle.style.visibility = "visible";
            smalltitle.childNodes[1].style.opacity = (content.scrollTop - (bigtitle.clientHeight - smalltitle.clientHeight)) / 100;
        } else {
            smalltitle.style.visibility = "hidden";
        }
    }

    console.log(bigtitle);

    $(window).scroll(smallTitleControl);

    $(window).resize(smallTitleControl);

});
