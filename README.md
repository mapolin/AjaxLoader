AjaxLoader
==========

Settings
==========

#### Callbacks
``
    onBeforeLoad: function() {}
        callend before the plugin is loaded - before any method is defined

    onAfterLoad: function() {}
        called after the plugin is loaded - after everything is defined

    onBeforeRequest: function(Loader) {}
        called before the request is made

    onAfterRequest: function(ResponseData, Loader) {}
        called after the request is made (both success and fail)

    onWheel: function(Event, Loader) {}
        called on mouse wheel or page scroll, must return true/false, used to hook in additional conditions

    onRender: function(ResponseData, Loader) {}
        called before the items are rendered
``

#### Configurable Settings
``
    container: jQuery|CSS [required]
        default: undefined, the container where all the content will be added to

    template: APP.Template [required]
        default: undefined, the template used for rendering

    delay: Number
        default: 1000, delay between requests

    requestData: Object
        default: ''

    requestDataType: String
        default: 'json'

    margin: Number
        defualt: WindowHeight/2, margin to use when calculating scroll position for requests

    restrictScroll: Boolean
        default: false, if true the scolling event will be restricted to the container object

    parser: Function(requestData) {}
        default: jQuery.param, method used for parsing the request data before sending the request - must return data
``

#### Internal Settings
``
    shouldRequest: Boolean
        default: true, if set to false, the plugin will not make a request (can be changed at any time)

    shouldRender: Boolean
        default: true, if set to false, the plugin will not render the data with it's default behavior, the onRender callback will still be called and can be used
``

#### HTML Setup (Example)
    Container to append the new data to:
    <div class="container"></div>

    Template to use for rendering
    <article class="template" data-template-name="template">
        <div data-template-piece="piece1">
        </div>
        <div data-template-piece="piece2">
        </div>
        <div data-template-piece="piece3">
        </div>
        <div data-template-piece="piece4">
        </div>
    </article>

#### Javascript Setup

    APP.LazyLoader(URL, SETTINGS);

    var page = 0;
    var AjaxLoader = new APP.LazyLoader('/request.php', {
            container: '.container',
            templateName: 'template',
            onBeforeRequest: function(loader) {
                // data can be manipulated here
                loader.data = {page: page++};
            },
            onRender: function(data, loader) {
                // we can check if there are items to render and set the 'shouldRender' option
                if(data.STATUS == 'NO_OK') {
                    loader.shouldRequest = false;
                } else {
                    loader.shouldRequest = true;
                }
            }
        });
        


Lazyloader
