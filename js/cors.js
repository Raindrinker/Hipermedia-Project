function enableCORS(){
  $.fn.enableCors = function() {
    $.ajaxPrefilter(function(options) {
      if(options.crossDomain){
        options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });
    return this;
  };
}
