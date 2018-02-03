/// <reference path="d/jquery.d.ts" />
/// <reference path="d/strings.d.ts" />
/// <reference path="region_data.ts" />

interface LanguageData {

    lc: string;
    alt: string[];
    lr: string;
    pk: number;
    gw: boolean;
    ld: string;
    cc: string[];
    ln: string;
    ang: string;
}

class LangNames {

    testString: string;
    loadResult: string;
    languages: LanguageData[];

    /**
     * Class constructor
     * @param {string} url
     * @param {Function} callback An optional callback function, mainly for unit testing
     */
    constructor(url: string, callback?: Function) {

        // this is for unit testing
        if (url === 'test') {
            this.testString = 'Test success.';
            return;
        }

        // load the url now
        let me = this;
        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function(data: LanguageData[]) {

            if (!Array.isArray(data)) {
                me.loadResult = 'Error loading langnames - Result was not an array.';
            }
            else {
                me.loadResult = 'Successfully loaded langnames data.';
                me.languages = data;
            }

            console.log(me.loadResult);

            if (typeof callback !== 'undefined')
                callback(me.loadResult);

        }).fail(function(jqXHR, textStatus, errorThrown) {

            me.loadResult = 'Failed: status = "' + textStatus + '", message = "' + errorThrown + '".';

            console.log(me.loadResult);

            if (typeof callback !== 'undefined')
                callback(me.loadResult);
        });
    }
}
