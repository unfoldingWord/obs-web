/// <reference path="d/jquery.d.ts" />
/// <reference path="d/strings.d.ts" />

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
    projects: Project[];
    version: string;
    issued: string;
    modified: string;
}

interface Project {

    identifier: string;
    title: string;
    formats: Format[];
}

interface Format {

    format: string;
    modified: string;
    size: number;
    url: string;
}

/**
 * {0} = language code
 * {1} = Localized language name
 * @type {string}
 */
const lang_h2 = '<h2><strong>+ {0} ({1})</strong></h2>\n';

/**
 * {0} = Resource type name (Text, Audio, Video)
 * @type {string}
 */
const res_type_desc = '<p><strong><em>{0}</em></strong></p>\n';

/**
 * {0} = Resource URL
 * {1} = Resource description
 * @type {string}
 */
const res_li = '<li><a href="{0}">{1}</a></li>\n';


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

    /**
     * Builds the language accordion and inserts it into the page
     */
    buildDiv(): void {

        let $container = $('body').find('#published-languages');

        for (let i = 0; i < this.languages.length; i++) {

            let $div = $('<div></div>');
            let lang: Language = this.languages[i];
            $div.append(lang_h2.format(lang.identifier, lang.title));

            let res_types = {'text': [], 'audio': [], 'video': []};

            if (!lang.obs_resource) continue;

            let res: Resource = lang.obs_resource;
            for (let j = 0; j < res.projects.length; j++) {

                let proj: Project = res.projects[j];
                for (let k = 0; k < proj.formats.length; k++) {

                    let fmt: Format = proj.formats[k];

                    if (fmt.format.indexOf('audio') > -1) {
                        res_types['audio'].push(fmt);
                    }
                    else if (fmt.format.indexOf('video') > -1) {
                        res_types['video'].push(fmt);
                    }
                    else {
                        res_types['text'].push(fmt);
                    }
                }
            }


            if (res_types['text']) {
                $div.append(res_type_desc.format('Text'));

                let $ul = $('<ul></ul>');
                $div.append($ul);

                for (let n = 0; n < res_types['text'].length; n++) {

                    let fmt: Format = res_types['text'][n];
                    let $li = $(res_li.format(fmt.url, fmt.format));
                    $ul.append($li);
                }

                $container.append($div);
            }
        }
    }
}