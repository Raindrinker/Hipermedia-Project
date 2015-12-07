$(document).ready(function() {

    var content = document.getElementsByTagName('body')[0];
    var bigtitle = document.getElementById('bigtitle');
    var smalltitle = document.getElementById('smalltitle');

    console.log(bigtitle);

    $(window).scroll(function() {
        if(content.scrollTop > (bigtitle.clientHeight - smalltitle.clientHeight)){
            smalltitle.style.visibility = "visible";
            smalltitle.childNodes[1].style.opacity = (content.scrollTop - (bigtitle.clientHeight - smalltitle.clientHeight))/100;
            console.log(bigtitle.offsetWidth);
            smalltitle.style.width = bigtitle.offsetWidth + "px";
        }else{
            smalltitle.style.visibility = "hidden";
        }
    });
});
