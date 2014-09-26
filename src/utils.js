// Define global namespace
var APP = window.APP || {};

(function($) {

    APP.Has3D = function() {
        var el = document.createElement('p'), 
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    };

    APP.Check = {
        fn: function(obj) {
            if(typeof obj == 'function') {
                return obj;
            }

            return function noop() { return true };
        }
    };

    APP.Parse = {
        toString: function(object) {
            if(object && typeof object == 'object') {
                return JSON.stringify(object);
            }
        },
        toJSON: function(string) {
            if(string && typeof string == 'string') {
                return $.parseJSON(string);
            }
        }
    };

    APP.Data = {
        extract: function(name) {
            if(name.indexOf('[data-') == -1) return name;

            return name.replace('[data-', '').replace(']', '');
        },
        addValue: function(name, value) {
            if(name.indexOf('[data-') == -1) return name;
            value = value || '';

            return name.replace(']', '="' + value + '"]');
        }
    };

    APP.Template = function(name) {
        if(!name || typeof name != 'string') {
            name = '';
        }

        this.template = $('[data-template-name="' + name + '"]').filter(function() {
            return $(this).attr('data-rendered') === undefined || $(this).attr('data-render') === false;
        }).clone();

        this.pieces = this.template.find('[data-template-piece]');

        this.populate = function(name, callback) {
            var piece = this.pieces.filter('[data-template-piece="' + name + '"]');
            callback(piece, this);
        };

        this.render = function(container) {
            container = $(container);

            if(container.length <= 0) {
                console.warn('Container not found for Template:Render.');
                return;
            }

            container.append(this.template);
            this.template.attr('data-rendered', true);
        };
    };

})(jQuery);