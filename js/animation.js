(function(window){
    let html_animation = function(){
        $("#loadingcontainer").css({"display":"none"});

        $(".menu_border > .border_center > img").animate(
            {"width":"100%","height":"100%","left":"0%","top":"0%"},
            1000,
            function(){

            })
    };
    window.html_animation = html_animation;
})(window);