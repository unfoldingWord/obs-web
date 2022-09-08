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
    const subjects = [
        'Open Bible Stories',
        'OBS Study Notes',
        'TSV OBS Study Notes',
        'OBS Study Questions',
        'TSV OBS Study Questions',
        'OBS Translation Notes',
        "TSV OBS Translation Notes",
        'OBS Translation Questions',
        "TSV OBS Translation Questions",
    ]
    const urlParams = new URLSearchParams(window.location.search);
    let dcs = urlParams.get('dcs');
    if (! dcs) {
        if (window.location.hostname.endsWith("openbiblestories.org") || window.location.hostname == "obs-web.netlify.app" || window.location.hostname == "openbiblestories.squarespace.com") {
            dcs = 'git.door43.org';
        } else {
            dcs = 'git.door43.org';
        }
    }
    const v5_url = `https://${dcs}/api/catalog/v5/search?sort=released&order=desc&includeHistory=1&${subjects.map(arg => `subject=${encodeURIComponent(arg)}`).join('&')}`;
    // load OBS now
    let obs: OBS = new OBS(v5_url, function(error: string) {
        if (error)
            obs.displayError(error);
        else if (typeof initMap === 'function')
            obs.buildDiv(initMap);
        else
            obs.buildDiv();
    });
});
