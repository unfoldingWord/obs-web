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
    quality: string;
    size: number;
    url: string;
}


class OBS {

    /**
     * {0} = language code
     * {1} = Localized language name
     * @type {string}
     */
    lang_h2: string = '<h2><strong>+ {0} ({1})</strong></h2>\n';

    /**
     * {0} = Resource type name (Text, Audio, Video)
     * @type {string}
     */
    res_type_desc: string = '<p style="display: none"><strong><em>{0}</em></strong></p>\n';

    /**
     * {0} = Resource URL
     * {1} = Resource description
     * @type {string}
     */
    static res_li: string = '<li><a href=' + '"{0}">{1}</a></li>\n';

    static res_ul: string = '<ul style="margin: 16px 0; display: none"></ul>';


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

        // sort the languages by id
        this.languages.sort(function(a: Language, b: Language) { return a.identifier.localeCompare(b.identifier); });
    }

    /**
     * Builds the language accordion and inserts it into the page
     */
    buildDiv(): void {

        let $container = $('body').find('#published-languages');

        for (let i = 0; i < this.languages.length; i++) {

            let $div = $('<div></div>');
            let lang: Language = this.languages[i];
            $div.append(this.lang_h2.format(lang.identifier, lang.title));

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


            if (res_types['text'].length > 0) {
                $div.append(this.res_type_desc.format('Text'));
                $div.append(OBS.getList(res_types['text']));
            }

            if (res_types['audio'].length > 0) {
                $div.append(this.res_type_desc.format('Audio'));
                $div.append(OBS.getList(res_types['audio']));
            }

            if (res_types['video'].length > 0) {
                $div.append(this.res_type_desc.format('Video'));
                $div.append(OBS.getList(res_types['video']));
            }

            $container.append($div);
        }

        // activate the accordion animation
        let $h2 = $container.find('h2');
        $h2.css('cursor','pointer');
        $h2.click(function() {$(this).nextUntil('h2').slideToggle();});
    }

    /**
     * Gets a friendly description of the format
     * @param {Format} fmt
     * @returns {string}
     */
    private static getDescription(fmt: Format): string {

        let format_string = fmt.format;
        let size_string = OBS.getSize(fmt.size);

        if (format_string.indexOf('application/pdf') > -1) {
            return '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&ensp;PDF (' + size_string + ')';
        }

        let is_zipped = format_string.indexOf('application/zip') > -1;
        let return_val = '';

        if (format_string.indexOf('text/markdown') > -1) {
            return_val = '<i class="fa fa-file-text-o" aria-hidden="true"></i>&ensp;Markdown';
        }
        else if (format_string.indexOf('text/html') > -1) {
            return_val = '<i class="fa fa-globe" aria-hidden="true"></i>&ensp;HTML';
        }
        else if (format_string.indexOf('text/usfm') > -1) {
            return_val = '<i class="fa fa-file-text" aria-hidden="true"></i>&ensp;USFM';
        }
        else if (format_string.indexOf('audio/mp3') > -1) {
            return_val = '<i class="fa fa-file-audio-o" aria-hidden="true"></i>&ensp;MP3';
        }
        else if (format_string.indexOf('video/mp4') > -1) {
            return_val = '<i class="fa fa-file-video-o" aria-hidden="true"></i>&ensp;MP4';
        }

        if (fmt.quality) {
            return_val += ' &ndash; ' + fmt.quality;
        }

        if (is_zipped) {
            return return_val + ' (' + size_string + ' zipped)';
        }

        return return_val + ' (' + size_string + ')';
    }

    private static getSize(file_size: number): string {

        if (file_size < 1000) {
            return file_size.toLocaleString() + ' Bytes';
        }

        let kb = file_size / 1024;
        if (kb < 1000) {
            return kb.toFixed(1).toLocaleString() + ' KB';
        }

        let mb = kb / 1024;
        if (mb < 1000) {
            return mb.toFixed(1).toLocaleString() + ' MB';
        }

        let gb = mb / 1024;
        if (gb < 1000) {
            return gb.toFixed(1).toLocaleString() + ' GB';
        }
    }

    private static getList(res_type: Format[]): JQuery {

        let $ul: JQuery = $(OBS.res_ul);

        for (let n = 0; n < res_type.length; n++) {

            let fmt: Format = res_type[n];
            let $li = $(OBS.res_li.format(fmt.url, OBS.getDescription(fmt)));
            $ul.append($li);
        }

        return $ul;
    }
}