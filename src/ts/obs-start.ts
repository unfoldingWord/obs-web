/// <reference path="d/obs.d.ts" />
/// <reference path="d/map_interactive.d.ts" />

/**
 * Add the custom styles
 */
function appendStyle(): void {

    let styles = `
#published-languages i { color: #1a1a1a; font-size: 19px; width: 20px; } 
`;

    let css = document.createElement('style');
    css.type = 'text/css';

    if (css['styleSheet'])
        css['styleSheet']['cssText'] = styles;
    else
        css.appendChild(document.createTextNode(styles));

    document.getElementsByTagName("head")[0].appendChild(css);

    let lnk: HTMLLinkElement = document.createElement('link');
    lnk.rel = 'stylesheet';
    lnk.type = 'text/css';
    lnk.media = 'all';
    lnk.href = 'https://cdn.unfoldingword.org/obs/js/map-style.min.css';
    document.getElementsByTagName("head")[0].appendChild(lnk);
}

document.addEventListener("DOMContentLoaded", function() {
    appendStyle();
    const urlParams = new URLSearchParams(window.location.search);
    let dcs_domain = urlParams.get('dcs');
    let tracker_url = urlParams.get('tracker');
    if (! dcs_domain) {
        if (window.location.hostname.endsWith("openbiblestories.org") || window.location.hostname == "obs-web.netlify.app" || window.location.hostname == "openbiblestories.squarespace.com") {
            dcs_domain = 'git.door43.org';
        } else {
            dcs_domain = 'qa.door43.org';
        }
    }
    if (! tracker_url && window.location.hostname.endsWith("openbiblestories.org")) {
        tracker_url = 'https://track.door43.org/track';
    }
    // load OBS now
    const obs = new OBS(dcs_domain, tracker_url, function(error: string) {
        if (error)
            obs.displayError(error);
        else if (typeof initMap === 'function')
            obs.buildDiv(initMap);
        else
            obs.buildDiv();
    });
});
