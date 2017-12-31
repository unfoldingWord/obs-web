/// <reference path="d/jquery.d.ts" />
/// <reference path="d/obs.d.ts" />
/// <reference path="d/map_interactive.d.ts" />

/**
 * Add the custom styles
 */
function appendStyle(): void {

    let styles = `
#published-languages i { color: #1a1a1a; font-size: 19px; } 
`;
    let css = document.createElement('style');
    css.type = 'text/css';
    if (css['styleSheet']) css['styleSheet']['cssText'] = styles;
    else css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("head")[0].appendChild(css);

    let lnk: HTMLLinkElement = document.createElement('link');
    lnk.rel = 'stylesheet';
    lnk.type = 'text/css';
    lnk.media = 'all';
    lnk.href = 'https://s3-us-west-2.amazonaws.com/cdn.unfoldingword.org/obs/js/map-style.min.css';
    document.getElementsByTagName("head")[0].appendChild(lnk);
}

// noinspection JSUnusedGlobalSymbols
function appendMap(): void {

    let url = 'https://s3-us-west-2.amazonaws.com/cdn.unfoldingword.org/obs/js/map.html';
    $.ajax({
        url: url
    }).done(function(data: string) {

        let $container = $('body').find('#clickable-map');
        $container.append(data);

        addEvent('wd_1');
        addEvent('wd_2');
        addEvent('wd_3');
        addEvent('wd_4');
        addEvent('wd_5');
        addEvent('wd_6');

    }).fail(function(jqXHR, textStatus, errorThrown) {

        console.log('Failed loading map: status = "' + textStatus + '", message = "' + errorThrown + '".');
    });
}

document.addEventListener("DOMContentLoaded", function() {

    appendStyle();

    // todo: re-enable this when ready for Phase 2
    //appendMap();

    // load OBS now
    let obs: OBS = new OBS('https://s3-us-west-2.amazonaws.com/api.door43.org/v3/catalog.json', function() {
        obs.buildDiv();
    });
});