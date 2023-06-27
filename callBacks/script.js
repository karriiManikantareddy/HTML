function apiCalls(callback) {
  setTimeout(() => {
    console.log("api calls end");
    callback();
  },3000);
}
function header() {
  setTimeout(() => {
    console.log("header displayed");
  },0);
}
function body() {
  setTimeout(() => {
    console.log("body displayed");
  },1000);
}
function footer() {
  setTimeout(() => {
    console.log("footer displayed");
  },5000);
}
apiCalls(function(){
    header();
    body();
    footer();
});

