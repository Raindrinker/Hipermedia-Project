$(document).ready(function() {

    var content = document.getElementsByTagName('body')[0];
    var bigtitle = document.getElementById('bigtitle');
    var smalltitle = document.getElementById('smalltitle');
    var searchdiv = document.getElementById('searchdiv');

    var smallTitleControl = function() {
        if (content.scrollTop > (bigtitle.clientHeight - smalltitle.clientHeight)) {
            smalltitle.style.visibility = "visible";
            searchdiv.style.position = "fixed";
            searchdiv.style.top = "0px";

        } else {
            smalltitle.style.visibility = "hidden";
            bigtitle.style.visibility = "visible";
            searchdiv.style.top = (130 - content.scrollTop) + "px";
            searchdiv.style.position = "fixed";
        }
    }

    console.log(searchdiv);

    $(window).scroll(smallTitleControl);

    $(window).resize(smallTitleControl);

});
