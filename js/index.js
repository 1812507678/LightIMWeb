$(document).ready(function () {
    $(".tcp_content").change(function () {
        $(".t_h i").html($(".tcp_content").val().length)
    });
    $(".tcp_content").keydown(function () {
        $(".t_h i").html($(".tcp_content").val().length)
    });
    $(".tcp_content").keyup(function () {
        $(".t_h i").html($(".tcp_content").val().length)
    });
    $(".tcp_content").change(function () {
        console.log(111);
        $(".t_h em").html($(".up_content").val().length)
    });
    $(".tcp_content").keydown(function () {
        $(".t_h em").html($(".up_content").val().length)
    });
    $(".tcp_content").keyup(function () {
        $(".t_h em").html($(".up_content").val().length)
    });

    // 自定义选择
    $(".choice_list").each(function () {
        $(this).find("li").first().addClass("choice_active");
    });
    $(".choice_list li").click(function () {
        $(this).siblings().removeClass("choice_active");
        $(this).addClass("choice_active");
    });
    $(".equipment li").click(function () {
        $(this).siblings().removeClass("equipment_active");
        $(this).addClass("equipment_active");
    });
});
