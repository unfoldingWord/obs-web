/// <reference path="d/jquery.d.ts" />

class OBS {

    testString: string;
    loadResult: string;

    /**
     * Class constructor
     * @param {string} url
     * @param {Function} callback An optional callback function, mainly for unit testing
     */
    constructor(url: string, callback?: Function) {

        // this is for unit testing
        if (url === 'test') {
            this.testString = 'Test success.';
            console.log(this.loadResult);
            return;
        }

        // load the url now
        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function(data) {

            if (!('languages' in data)) {
                this.loadResult = 'Error loading catalog - "Languages" element not found.';
            }
            else {
                this.loadResult = 'Successfully loaded catalog data.';
            }

            console.log(this.loadResult);

            if (typeof callback !== 'undefined')
                callback(this.loadResult);

        }).fail(function(jqXHR, textStatus, errorThrown) {

            this.loadResult = 'Failed: status = "' + textStatus + '", message = "' + errorThrown + '".';

            console.log(this.loadResult);

            if (typeof callback !== 'undefined')
                callback(this.loadResult);
        });

    }

    /**
     * Extracts the OBS records from the catalog
     * @param data The catalog from https://api.door43.org/v3/catalog.json
     */
    extractOBS(data: any): void {

    }
}