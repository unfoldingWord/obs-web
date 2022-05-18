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
    // const v5_url = `https://git.door43.org/api/catalog/v5/search?sort=released&order=desc&includeHistory=1`;
    const v5_url = `https://git.door43.org/api/catalog/v5/search?sort=released&order=desc&includeHistory=1&${subjects.map(arg => `subject=${encodeURIComponent(arg)}`).join('&')}`;
    // load OBS now
    let obs: OBS = new OBS(v5_url, function() {
        if (typeof initMap === 'function')
            obs.buildDiv(initMap);
        else
            obs.buildDiv();
    });
});
