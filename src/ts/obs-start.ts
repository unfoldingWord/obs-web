/// <reference path="d/obs.d.ts" />

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
}


document.addEventListener("DOMContentLoaded", function() {

    appendStyle();

    // load OBS now
    let obs: OBS = new OBS('https://s3-us-west-2.amazonaws.com/api.door43.org/v3/catalog.json', function() {
        obs.buildDiv();
    });
});