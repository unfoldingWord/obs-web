/// <reference path="d/region_data.d.ts" />
/// <reference path="d/map_data.d.ts" />
/// <reference path="d/obs.d.ts" />

declare let wd_config: any;

// Quick feature detection
function isTouchEnabled(): boolean {
    return (('ontouchstart' in window)
        || (navigator.maxTouchPoints > 0)
        || (navigator.maxTouchPoints > 0));
}

function addEvent(id: string): void {
    const _obj = jQuery('#' + id);
    const _Textobj = jQuery('#' + id + ',' + '#' + wd_config[id]['iso']);

    jQuery('#' + ['text-abb']).attr({'fill': wd_config['default']['namescolor']});

    _obj.attr({'fill': wd_config[id]['upcolor'], 'stroke': wd_config['default']['bordercolor']});
    _Textobj.attr({'cursor': 'default'});
    if (wd_config[id]['enable'] == true) {
        if (isTouchEnabled()) {
            _Textobj.on('touchstart', function () {
                if (wd_config[id]['target'] != 'none') {
                    jQuery('#' + id).css({'fill': wd_config[id]['downcolor']});
                }
            });
            _Textobj.on('touchend', function () {
                jQuery('#' + id).css({'fill': wd_config[id]['upcolor']});

                selectRegion(wd_config[id]['region'], wd_config[id]['hover']);
            })
        }
        _Textobj.attr({'cursor': 'pointer'});
        _Textobj.hover(function () {
            _obj.css({'fill': wd_config[id]['overcolor']})
        }, function () {
            jQuery('#' + id).css({'fill': wd_config[id]['upcolor']});
        });
        if (wd_config[id]['target'] != 'none') {
            _Textobj.mousedown(function () {
                jQuery('#' + id).css({'fill': wd_config[id]['downcolor']});
            })
        }
        _Textobj.mouseup(function () {
            jQuery('#' + id).css({'fill': wd_config[id]['overcolor']});

            selectRegion(wd_config[id]['region'], wd_config[id]['hover']);
        });
    }
}

function selectRegion(region_name, region_label): void {

    let $langs = $('#published-languages').find('h2.language-h2');
    let $btn = $('#show-all-languages');

    $('#selected-region').html(region_label);

    // if showing all, do it and return
    if (region_name === 'All') {
        $btn.hide();
        $langs.parent().show();
        return;
    }

    let lang_codes: string[] = regions[region_name];

    // loop through the H2 tags looking at the data-lang-code attribute
    $langs.each(function(idx: number, h2: HTMLElement) {

        if (lang_codes.indexOf(h2.getAttribute('data-lang-code')) === -1) {
            $(h2).parent().hide();
        }
        else {
            $(h2).parent().show();
        }
    });

    $btn.show();
}

// noinspection JSUnusedGlobalSymbols
function initMap(): void {

    // this check is for unit testing
    if (typeof wd_config === 'undefined') return;
    if (!wd_config || $.isEmptyObject(wd_config)) return;

    // insert the map
    $('#clickable-map').html(map_data);

    addEvent('wd_1');
    addEvent('wd_2');
    addEvent('wd_3');
    addEvent('wd_4');
    addEvent('wd_5');
    addEvent('wd_6');

    $('#show-all-languages').on('click', function(){
        selectRegion('All', 'All Regions');
    });
}

wd_config = {
    'default': {
        'bordercolor': '#6b8b9e',
        'namescolor': '#383838'
    },
    'wd_1': {
        'hover': 'Africa',
        'region': 'Africa',
        'target': '_self',
        'upcolor': '#dd9933',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_af'
    },
    'wd_2': {
        'hover': 'Asia',
        'region': 'Asia',
        'target': '_self',
        'upcolor': '#e0f3ff',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_as'
    },
    'wd_3': {
        'hover': 'Europe',
        'region': 'Europe',
        'target': '_self',
        'upcolor': '#8224e3',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_eu'
    },
    'wd_4': {
        'hover': 'North America',
        'region': 'NorthAmerica',
        'target': '_self',
        'upcolor': '#45892a',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_na'
    },
    'wd_5': {
        'hover': 'Oceania',
        'region': 'Oceania',
        'target': '_self',
        'upcolor': '#81d742',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_oc'
    },
    'wd_6': {
        'hover': 'South America',
        'region': 'SouthAmerica',
        'target': '_self',
        'upcolor': '#dd3333',
        'overcolor': '#8fbee8',
        'downcolor': '#477cb2',
        'enable': true,
        'iso': 'iso_sa'
    }
};
