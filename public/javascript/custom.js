// var jsdom = require('jsdom');
// $ = require('jquery')(new jsdom.JSDOM().window);

$("button.bta").click(function() {
    $("body").addClass("dark");
    $(".box").addClass("dark1");
    $("a").addClass("dark1");
    $("h1").addClass("dark1");
    $("p").addClass("dark2");
    var input = $( "form input:text" ).css({
    color: "white"
});
}); 

$("button.btb").click(function() {
    $("body").removeClass("dark");
    $("a").removeClass("dark1");
    $(".box").removeClass("dark1");
    $("p").removeClass("dark2");
    $("h1").removeClass("dark1");
    $("input[type=text]").removeClass("dark2"); 
    var input = $( "form input:text" ).css({
    color: "black"
});  
}); 
