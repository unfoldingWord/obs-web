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

                // todo: put correct action here
                selectRegion(wd_config[id]['region']);

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

            // todo: put correct action here
            selectRegion(wd_config[id]['region']);

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

function selectRegion(region_name): void {
    alert('Selected ' + region_name);
}

wd_config = {
    'default': {
        'bordercolor': '#6b8b9e',
        'namescolor': '#383838'
    },
    'wd_1': {
        'hover': 'Africa',
        'region': 'africa',
        'target': '_self',
        'upcolor': '#dd9933',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_af'
    },
    'wd_2': {
        'hover': 'Asia',
        'region': 'asia',
        'target': '_self',
        'upcolor': '#e0f3ff',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_as'
    },
    'wd_3': {
        'hover': 'Europe',
        'region': 'europe',
        'target': '_self',
        'upcolor': '#8224e3',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_eu'
    },
    'wd_4': {
        'hover': 'North America',
        'region': 'north-america',
        'target': '_self',
        'upcolor': '#45892a',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_na'
    },
    'wd_5': {
        'hover': 'Oceania',
        'region': 'oceania',
        'target': '_self',
        'upcolor': '#81d742',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_oc'
    },
    'wd_6': {
        'hover': 'South America',
        'region': 'south-america',
        'target': '_self',
        'upcolor': '#dd3333',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_sa'
    }
};
