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

  // Scroll To Element Smothy with Vanilla JavaScript
let offset = 0;
let call;
function scroll() {
    if ((offset - document.documentElement.scrollTop) > -240
      && (window.innerHeight + window.scrollY) < document.body.offsetHeight) {
        document.documentElement.scrollTop += 20
    } else {
        clearInterval(call)
    }
};
// Add Event Listener to parent Element 
document.querySelector('.navbar').addEventListener("click", reply_click);

//CallBack Function
function reply_click() {
  event.preventDefault();
  call = setInterval(scroll, 2);
  target = event.srcElement.dataset.scroll;
  offset = document.getElementById(target).offsetTop;
}
});