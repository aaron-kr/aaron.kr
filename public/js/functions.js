$(function() {

  // Flash script borrowed from WesBos.com 👍
  // set the last one to be the first one
  var last = $('span.flash span:first');
  var z = 1;

  window.setInterval(function() {

    var el = last;
    var next = el.next();
    if(!next.length) {
      next = $('span.flash span:first');
    }

    next.css('z-index',z);
    z++;
    last = next;
  }, 3000);

});