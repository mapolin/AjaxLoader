(function($) {

    APP = window.APP || {};
    
    APP.LazyLoader = function(url, settings) {
        // set internal objects
        var win = $(window);
        var doc = $(document);
        var _this = this;
        var step = win.scrollTop();
        var isWaiting = false;

        // set container and template for population
        if(!settings || !settings.container || !settings.templateName) {
            console.warn('No container or template passed to LazyLoader. Exiting');
            return;
        }

        this.container = $(settings.container);
        this.templateName = settings.templateName;

        // set callback/hook functions
        this.onBeforeLoad = APP.Check.fn(settings.onBeforeLoad);
        this.onAfterLoad = APP.Check.fn(settings.onAfterLoad);
        this.onBeforeRequest = APP.Check.fn(settings.onBeforeRequest);
        this.onAfterRequest = APP.Check.fn(settings.onAfterRequest);
        this.onWheel = APP.Check.fn(settings.onWheel);
        this.onRender = APP.Check.fn(settings.onRender);


        // set behavior settings
        this.shouldRequest = true;
        this.shouldRender = true;
        this.parser = settings.parser || $.param;
        this.delay = settings.delay || 1000;
        this.data = settings.requestData || '';
        this.dataType = settings.requestDataType || 'json';
        this.url = url;
        this.margin = settings.margin || win.height()/2;
        this.restrictScroll = settings.restrictScroll;

        this.onBeforeLoad(this);

        // defined default onwheel behavior
        this.wheel = function(event) {
            // check if we should do a request
            // hook onWheel to add more conditions in addition to the endOfPage
            if( this.onWheel(event, this) && this.endOfPage(event.originalEvent) ) {
                this.request();
            }
        };

        // function can be overwritten and must return true/false
        this.endOfPage = function(event) {
            
            // complex logic going on, check if scrolling down and reaching the end of the page
            var goingDown = false;
            if(event.detail && event.detail < 0) {
                goingDown = true;
            }
            else if(event.wheelDelta && event.wheelDelta < 0) {
                goingDown = true;
            }
            else if((step - win.scrollTop()) < 0) {
                goingDown = true;
            }
            step = win.scrollTop();

            //console.log(win.scrollTop() + win.height() + this.container.offset().top, Math.abs(this.container.height() + this.container.offset().top));

            if(goingDown) {
                if(win.scrollTop() + win.height() + this.container.offset().top > Math.abs(this.container.height() + this.container.offset().top)) {
                    //console.log('Request!');
                    return true;
                }
            }

            return false;
        };

        // request data
        this.request = function() {
            if( isWaiting ) return;

            isWaiting = true;

            // hook into request and manipulate request data or conditions
            this.onBeforeRequest(this);

            // option used to stop/resume requesting
            if( !this.shouldRequest ) return;

            $.ajax({
                url: this.url,
                data: this.parser(this.data),
                dataType: this.dataType,
                success: function(data) {
                    // hook on success of request and render data
                    _this.onRender(data, _this);

                    // option used to disable default rendering
                    if( _this.shouldRender ) {
                        for(var i = 0; i < data.items.length; i++) {
                            _this.render(data.items[i]);
                        }
                    }
                    
                    // hook after rendering and do stuff
                    _this.onAfterRequest(data, _this);
                    
                    setTimeout(function() {
                        isWaiting = false;
                    }, _this.delay);
                },
                error: function(data) {
                    // same hook used, data is now the error result object
                    _this.onAfterRequest(data, _this);

                    setTimeout(function() {
                        isWaiting = false;
                    }, _this.delay);
                }
            });
        };

        // render received data
        // default rendering engine, uses APP.Template:utils.js
        this.render = function(data) {
            var template = new APP.Template(this.templateName);

            for(var name in data) {
                var content = data[name];

                template.populate(name, function(piece) {
                    piece.html(data[name]);
                });
            }

            template.render(this.container);
        };

        // restrict scroll to scrolling within the container only (not recommended)
        if( this.restrictScroll ) {
            this.container.on('mousewheel DOMMouseScroll scroll', function(event) {
                _this.wheel(event);
            });
        } else {
            doc.on('mousewheel DOMMouseScroll scroll', function(event) {
                _this.wheel(event);
            });
        }

        this.onAfterLoad();
    };

})(jQuery);