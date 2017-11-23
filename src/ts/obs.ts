/// <reference path="d/jquery.d.ts" />

interface Catalog {

    catalogs: any[];
    languages: Language[];
}

interface Language {

    title: string;
    identifier: string;
    resources: Resource[];
    obs_resource: Resource;
}

interface Resource {

    identifier: string;
}

class OBS {

    testString: string;
    loadResult: string;
    languages: Language[];

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
        let me = this;
        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function(data: Catalog) {

            if (!('languages' in data)) {
                me.loadResult = 'Error loading catalog - "Languages" element not found.';
            }
            else {
                me.loadResult = 'Successfully loaded catalog data.';

                me.extractOBS(data);
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

    /**
     * Extracts the languages with OBS resources from the catalog
     * @param data The catalog from https://api.door43.org/v3/catalog.json
     */
    extractOBS(data: Catalog): void {

        // get languages that have OBS resources
        this.languages = data.languages.filter(function(lang: Language) {
            let found = lang.resources.filter(function(res: Resource) {
                return res.identifier === 'obs';
            });

            return found.length > 0;
        });

        // identify the OBS resources
        for (let i = 0; i < this.languages.length; i++) {
            let found = this.languages[i].resources.filter(function(res: Resource) {
                return res.identifier === 'obs';
            });

            this.languages[i].obs_resource = found[0];
        }
    }
}