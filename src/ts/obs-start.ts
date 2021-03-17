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

    let urls = [
        'https://api.door43.org/v3/subjects/Open_Bible_Stories.json',
        'https://api.door43.org/v3/subjects/OBS_Study_Notes.json',
        'https://api.door43.org/v3/subjects/OBS_Study_Questions.json',
        'https://api.door43.org/v3/subjects/OBS_Translation_Notes.json',
        'https://api.door43.org/v3/subjects/OBS_Translation_Questions.json',
    ];

    // load OBS now
    let obs: OBS = new OBS(urls, function() {
        if (typeof initMap === 'function')
            obs.buildDiv(initMap);
        else
            obs.buildDiv();
    });
});
