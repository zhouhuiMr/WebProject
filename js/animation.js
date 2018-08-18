(function(window){
    const WindowWidth =  $(window).width();
    const WindowHeight = $(window).height();

    const containerWidth = 1190; //自定义容器的大小
    const Menu_Text = $("#topcontainer > .menu_text_container > .menu_text").width();
    const Logo_Width = $(".menu_border > .border_center").width();

    //初始化部分标签的大小
    let w = (Menu_Text - containerWidth) / 2;
    $("#topcontainer > .menu_text_container > .menu_text > .menu_list").css({
       "width": containerWidth+"px","left" : w + "px"
    });
    $(".menu_text > .menu_list > .menu_list_span").css({
       "width" : (( containerWidth - Logo_Width ) / 2 - 40) +"px"
    });

    /**--------------**/
    /**-- 事件班定 --**/
    /**--------------**/

    let html_animation = function(){
        $("#loadingcontainer").css({"display":"none"});
        $(".menu_border > .border_center > img").animate(
            {"width":"100%","height":"100%","left":"0%","top":"0%"},
            1000,
            function(){
                let animateTime = 500;
                $("#topcontainer > .menu_text_container > .menu_text").show();
                $("#topcontainer > .menu_text_container > .menu_text").animate({
                    "width": containerWidth+"px"
                },animateTime);
                $("#topcontainer > .menu_text_container > .menu_text > .menu_list").animate({
                    "left":"0px"
                },animateTime);
            })
    };
    window.html_animation = html_animation;
})(window);