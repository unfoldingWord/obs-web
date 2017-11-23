/// <reference path="d/jquery.d.ts" />

declare let wd_config: any;

// Quick feature detection
function isTouchEnabled(): boolean {
    return (('ontouchstart' in window)
        || (navigator.maxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

function addEvent(id: string): void {
    const _obj = jQuery('#' + id);
    const _Textobj = jQuery('#' + id + ',' + '#' + wd_config[id]['iso']);

    jQuery('#' + ['text-abb']).attr({'fill': wd_config['default']['namescolor']});

    _obj.attr({'fill': wd_config[id]['upcolor'], 'stroke': wd_config['default']['bordercolor']});
    _Textobj.attr({'cursor': 'default'});
    if (wd_config[id]['enable'] == true) {
        if (isTouchEnabled()) {
            _Textobj.on('touchstart', function (e: JQueryEventObject) {
                const touch = (<TouchEvent>e.originalEvent).touches[0];
                let x = touch.pageX - 10, y = touch.pageY + (-15);
                let $map_tip = jQuery('#map-tip-wd');
                let maptipw = $map_tip.outerWidth(), maptiph = $map_tip.outerHeight();

                x = (x + maptipw > jQuery(document).scrollLeft() + jQuery(window).width()) ? x - maptipw - (20 * 2) : x;
                y = (y + maptiph > jQuery(document).scrollTop() + jQuery(window).height()) ? jQuery(document).scrollTop() + jQuery(window).height() - maptiph - 10 : y;
                if (wd_config[id]['target'] != 'none') {
                    jQuery('#' + id).css({'fill': wd_config[id]['downcolor']});
                }
                $map_tip.show().html(wd_config[id]['hover']);
                $map_tip.css({left: x, top: y})
            });
            _Textobj.on('touchend', function () {
                jQuery('#' + id).css({'fill': wd_config[id]['upcolor']});
                if (wd_config[id]['target'] == '_blank') {
                    window.open(wd_config[id]['url']);
                } else if (wd_config[id]['target'] == '_self') {
                    window.parent.location.href = wd_config[id]['url'];
                }
                jQuery('#map-tip-wd').hide();
            })
        }
        _Textobj.attr({'cursor': 'pointer'});
        _Textobj.hover(function () {
            jQuery('#map-tip-wd').show().html(wd_config[id]['hover']);
            _obj.css({'fill': wd_config[id]['overcolor']})
        }, function () {
            jQuery('#map-tip-wd').hide();
            jQuery('#' + id).css({'fill': wd_config[id]['upcolor']});
        });
        if (wd_config[id]['target'] != 'none') {
            _Textobj.mousedown(function () {
                jQuery('#' + id).css({'fill': wd_config[id]['downcolor']});
            })
        }
        _Textobj.mouseup(function () {
            jQuery('#' + id).css({'fill': wd_config[id]['overcolor']});
            if (wd_config[id]['target'] == '_blank') {
                window.open(wd_config[id]['url']);
            } else if (wd_config[id]['target'] == '_self') {
                window.parent.location.href = wd_config[id]['url'];
            }
        });
        _Textobj.mousemove(function (e) {
            let x = e.pageX + 10, y = e.pageY + 15;
            let $map_tip = jQuery('#map-tip-wd');
            let maptipw = $map_tip.outerWidth(), maptiph = $map_tip.outerHeight();

            x = (x + maptipw > jQuery(document).scrollLeft() + jQuery(window).width()) ? x - maptipw - (20 * 2) : x;
            y = (y + maptiph > jQuery(document).scrollTop() + jQuery(window).height()) ? jQuery(document).scrollTop() + jQuery(window).height() - maptiph - 10 : y;
            $map_tip.css({left: x, top: y})
        })
    }
}

jQuery(function () {

    // this check is for unit testing
    if (typeof wd_config === 'undefined') return;
    if (!wd_config || $.isEmptyObject(wd_config)) return;

    addEvent('wd_1');
    addEvent('wd_2');
    addEvent('wd_3');
    addEvent('wd_4');
    addEvent('wd_5');
    addEvent('wd_6');
});
