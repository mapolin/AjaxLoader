(function($) {
    $(function() {
        var requests = 0;

        window.AjaxLoader = new APP.LazyLoader('/AjaxLoader/request.php', {
            container: '.load-content-here',
            templateName: 'template',
            onBeforeRequest: function(loader) {
                requests++;

                if(requests > 10) {
                    loader.shouldRequest = false;
                }
            }
        });

    });
})(jQuery);