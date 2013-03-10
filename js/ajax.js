$(function () {
    $('ul.primary-links a').click( function (e) {
        var requestUrl = $(this).attr('href'),
            urlPrefix = "/ae-audio/ajax/";
            bodyClass;
        console.log(urlPrefix + requestUrl);

        $.get(urlPrefix + requestUrl, function (responce) {
            //alert(responce);
            $('#content').html(responce);
        })

        bodyClass = $(this).attr("data-body-required-class");
        $('body').removeClass().addClass(bodyClass);

        e.preventDefault();
    });
});