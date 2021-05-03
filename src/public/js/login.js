$('#login-button').click(function(){
    $('#login-button').fadeOut("slow",function(){
      $("#container").fadeIn();
      TweenMax.from("#container", .4, { scale: 0, ease:Sine.easeInOut});
      TweenMax.to("#container", .4, { scale: 1, ease:Sine.easeInOut});
    });
  });
  
//   $("#close-login").click(function(){
//     TweenMax.from("#container", .4, { scale: 1, ease:Sine.easeInOut});
//     TweenMax.to("#container", .4, { left:"0px", scale: 0, ease:Sine.easeInOut});
//     $("#container, #forgotten-container").fadeOut(800, function(){
//       $("#login-button").fadeIn(800);
//     });
//   });
  $("#close-forget").click(function(){
    TweenMax.from("#container", .4, { scale: 1, ease:Sine.easeInOut});
    TweenMax.to("#container", .4, { left:"0px", scale: 0, ease:Sine.easeInOut});
    $("#container, #forgotten-container").fadeOut(800, function(){
      $("#login-button").fadeIn(800);
    });
  });
  /* Forgotten Password */
  $('#forgotten').click(function(){
    $("#container").fadeOut(function(){
      $("#forgotten-container").fadeIn();
    });
  });

  $("#close-login").click(function (){
    $("#container").fadeOut(function(){
        $("#login-button").fadeIn(800);
      });
  })


  // ** FADE OUT FUNCTION **
//   function fadeOut(el) {
//     el.style.opacity = 1;
//     (function fade() {
//         if ((el.style.opacity -= .1) < 0) {
//             el.style.display = "none";
//         } else {
//             requestAnimationFrame(fade);
//         }
//     })();
// };

// // ** FADE IN FUNCTION **
// function fadeIn(el, display) {
//     el.style.opacity = 0;
//     el.style.display = display || "block";
//     (function fade() {
//         var val = parseFloat(el.style.opacity);
//         if (!((val += .1) > 1)) {
//             el.style.opacity = val;
//             requestAnimationFrame(fade);
//         }
//     })();
// };