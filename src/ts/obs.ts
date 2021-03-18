/// <reference path="d/strings.d.ts" />

interface Catalog {

    catalogs: any[];
    languages: Language[];
}

interface Language {
    language: string;   // language code
    title: string;      // localized language name
    direction: string;  // ltr or rtl
    subjects: { [key: string]: Subject; };
}

interface Subject {
    subject: string  // subject
    resources: Resource[];
}

interface Resource {
    identifier: string;
    projects: Project[];
    version: string;
    issued: string;
    modified: string;
    title: string;
    subject: string;
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
    chapters: Chapter[];
}

interface Chapter extends Format {

    identifier: string;
}

class ResourceTypes {

    text: Format[] = [];
    audio: Format[] = [];
    video: Format[] = [];
    other: Format[] = [];
}

class OBS {

    /**
     * {0} = language code
     * {1} = Anglicized language name
     * {2} = Localized language name
     * @type {string}
     */
    static lang_h2: string = '<h2 class="language-h2" data-lang-code="{0}"><strong><span class="plus"></span> {0}{1} / {2}</strong></h2>\n';

    static subject_h3: string = '<h3 class="subject-h3" data-lang-code="{0}"><span class="plus"></span> {1}</h3>\n';

    static chapters_h3: string = '<h3 class="chapters-h3">&ensp;<span class="plus"></span></h3>';

    /**
     * {0} = Resource type name (Text, Audio, Video)
     * @type {string}
     */
    static res_type_desc: string = '<p style="display: none"><strong><em>{0}</em></strong></p>\n';

    /**
     * {0} = Resource URL
     * {1} = Resource description
     * @type {string}
     */
    static res_li: string = '<li><a href=' + '"{0}" style="text-decoration: none;">{1}</a></li>\n';

    static res_ul: string = '<ul style="margin: 16px 0; display: none"></ul>';

    /**
     * {0} = font awesome class
     * {1} = title
     * {2} = type
     * {3} = size
     * @type {string}
     */
    static description: string = '<i class="fa {0}" aria-hidden="true"></i>&ensp;{1}&nbsp;<span style="color: #606060">({2}{3})</span>';

    /**
     * {0} = size string, and zipped if applicable
     * @type {string}
     */
    static size_span = '&nbsp;<span style="color: #606060">{0}</span>';

    testString: string;
    loadResult: string;
    languages: { [key: string]: Language; } = {};

    /**
     * Class constructor
     * @param {string[]} urls
     * @param {Function} callback An optional callback function, mainly for unit testing
     */
    constructor(urls: string[], callback?: Function) {

        // this is for unit testing
        if (urls.length > 0 && urls[0] === 'test') {
            this.testString = 'Test success.';
            return;
        }

        // load the url now
        let me = this;
        let urlResults = [];
        let error = null;

        let finish = function () {
            if (! error) {
                let data = [].concat.apply([], urlResults);
                me.extractOBS(data);
                me.loadResult = 'Successfully loaded catalog data.';
            } else {
                me.loadResult = error;
            }
            console.log(me.loadResult);
            if (typeof callback !== 'undefined')
                callback(me.loadResult);
        };

        urls.forEach(function (url) {
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function (data) {
                urlResults.push(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                error = 'Failed: status = "' + textStatus + '", message = "' + errorThrown + '".';
                urlResults.push(error);
                console.log(error);
            }).always(function () {
                if (urlResults.length == urls.length) {
                    finish();
                }
            });
        });
    }

    /**
     * Extracts the languages with OBS resources from the catalog
     * @param data The catalog from https://api.door43.org/v3/subjects/Open_Bible_Stories.json
     */
    extractOBS(data: Object[]): void {
        let me = this;
        data.forEach(item => {
            let langId = item['language'];
            let subjectStr = item['subject'];
            if (! (langId in me.languages)) {
                me.languages[langId] = <Language> {
                    language: langId,
                    title: item['title'],
                    direction: item['direction'],
                    subjects: {},
                };
            }
            me.languages[langId].subjects[subjectStr] = <Subject> {
                subject: subjectStr.replace(/_/g, ' '),
                resources: <Resource[]> item["resources"],
            };
        });
    }

    /**
     * Builds the language accordion and inserts it into the page
     * @param {Function} callback An optional callback function
     */
    buildDiv(callback?: Function): void {
        let langnames = {}
        let scripts = document.getElementsByTagName('script');
        let myRoot = '';
        for(let i=0; i < scripts.length; ++i) {
            if (scripts[i].src.indexOf('obs.js') > 0) {
                myRoot = scripts[i].src.replace('js/obs.js', '');
            }
        }
        $.ajax({
            dataType: "json",
            url: myRoot + 'json/langnames.json',
            async: false,
            error: function (xhr, status, error) {
                console.log('Error reading file: json/langnames.json\n\rxhr: ' + xhr + '\n\rstatus: ' + status + '\n\rerror: ' + error);
            },
            success: function (data) {
                console.log('read json/langnames.json successful');
                data.forEach(langname => {
                    langnames[langname["lc"]] = langname;
                })
            }
        });
        let $container = $('body').find('#published-languages');
        $container.empty();
        let me = this;
        Object.keys(me.languages).sort().forEach(langId => {
            let $lang_div = $('<div></div>');
            let lang = me.languages[langId]
            let ang = '';
            if (langId in langnames && 'ang' in langnames[langId] && langnames[langId]['ang'].trim() &&
                langnames[langId]['ang'].toLowerCase() != lang.title.toLowerCase()) {
                ang = ' / ' + langnames[langId].ang;
            }
            $lang_div.append(OBS.lang_h2.format(lang.language, ang, lang.title));

            Object.keys(me.languages[langId].subjects).sort((a: string, b: string) => {
                // List Open Bible Stories first, all others alphabetically
                return (a == "Open_Bible_Stories" ? -1 : (b == "Open_Bible_Stories" ? 1 : a.localeCompare(b)));
            }).forEach(subjectId => {
                let subject = me.languages[langId].subjects[subjectId];

                if (subject.resources.length < 1) return;

                let subjectStr = subject.subject;

                let res: Resource = subject.resources[0];

                let $subject_div = $('<div></div>');

                let locale_title = res.title;
                let title = locale_title;
                if (title.replace('Open Bible Stories ', 'OBS ').replace(/ /g, '').toLowerCase() == subjectStr.replace(/ /g, '').toLowerCase())
                    title = subjectStr;
                else if (langId != 'en' && subjectStr.toLowerCase().replace(/ /g, '')
                    != locale_title.toLowerCase().replace(/ /g, ''))
                    title = subjectStr + ' / ' + locale_title;
                let subject_h3 = OBS.subject_h3.format(langId + "-" + subjectId, title);
                $subject_div.append(subject_h3);

                let res_types = OBS.getResources(subject);

                if (res_types.text.length > 0) {
                    $subject_div.append(OBS.res_type_desc.format('Text'));
                    $subject_div.append(OBS.getList(res_types.text, res.title));
                }

                if (res_types.audio.length > 0) {
                    $subject_div.append(OBS.res_type_desc.format('Audio'));
                    $subject_div.append(OBS.getList(res_types.audio, res.title));
                }

                if (res_types.video.length > 0) {
                    $subject_div.append(OBS.res_type_desc.format('Video'));
                    $subject_div.append(OBS.getList(res_types.video, res.title));
                }

                if (res_types.other.length > 0) {
                    $subject_div.append(OBS.res_type_desc.format('Other'));
                    $subject_div.append(OBS.getList(res_types.other, res.title));
                }

                $lang_div.append($subject_div);
            });

            $container.append($lang_div);
        });

        // activate the accordion animation
        let $h2 = $container.find('h2');
        $h2.css('cursor', 'pointer');
        $h2.click(function () {
            $(this).nextUntil('h2').slideToggle();
            $(this).find('span').toggleClass('minus');
        });
        $h2.nextUntil('h2').slideUp();

        let $h3 = $container.find('h3');
        $h3.css('cursor', 'pointer');
        $h3.click(function () {
            $(this).nextUntil('h3').slideToggle();
            $(this).find('span').toggleClass('minus');
        });

        if (typeof callback !== 'undefined')
            callback();
    }

    static getResources(subject: Subject): ResourceTypes {

        let res_types = new ResourceTypes();

        if (subject.resources.length < 1)
            return res_types;

        let res: Resource = subject.resources[0];
        for (let j = 0; j < res.projects.length; j++) {

            let proj: Project = res.projects[j];
            for (let k = 0; k < proj.formats.length; k++) {

                let fmt: Format = proj.formats[k];

                if (! fmt.format) {
                    fmt.format = OBS.getFormatFromFields(fmt);
                }

                // sort chapters
                if ('chapters' in fmt) {
                    fmt.chapters.sort( (a: Chapter, b: Chapter)=>{return a.identifier.localeCompare(b.identifier)});
                }

                if (fmt.format.indexOf('audio') > -1) {
                    res_types.audio.push(fmt);
                }
                else if (fmt.format.indexOf('video') > -1) {
                    res_types.video.push(fmt);
                }
                else if (
                    fmt.format.indexOf('markdown') > -1 ||
                    fmt.format.indexOf('pdf') > -1 ||
                    fmt.format.indexOf('docx') > -1 ||
                    fmt.format.indexOf('odt') > -1 ||
                    fmt.format.indexOf('epub') > -1 ||
                    fmt.format.indexOf('door43') > -1
                ) {
                    res_types.text.push(fmt);
                }
                else if (
                    fmt.format.indexOf('youtube') > -1 ||
                    fmt.format.indexOf('bloom') > - 1
                ) {
                    res_types.other.push(fmt);
                }
                else {
                    res_types.other.push(fmt);
                }
            }
        }

        return res_types;
    }

    /**
     * Get the file extension of a URL (including if it has query params) without the preceeding dot
     * @param {string} url
     * @returns {string}
     */
    private static getUrlExt(url: string): string {
        return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf(".")+1)
    }

    /**
     * Get the format from the Format fields, such based on the URL file extension or quality
     * @param {Fields} fmt 
     * @returns {string}
     */
    private static getFormatFromFields(fmt: Format): string {
        if (!fmt.url)
            return '';
        var ext = OBS.getUrlExt(fmt.url.toLowerCase());
        switch (ext) {
            case '3gp':
                return 'video/3gp';
            case 'html':
                return 'text/html';
            case 'md':
                return 'text/markdown';
            case 'mp3':
                return 'audio/mp3';
            case 'mp4':
                return 'video/mp4';
            case 'pdf':
                return 'application/pdf';
            case 'txt':
                return 'text/txt';
            case 'usfm':
                return 'text/usfm';
            case 'doc':
                return 'application/doc';
            case 'docx':
                return 'application/docx';
            case 'epub':
                return 'application/epub';
            case 'odt':
                return 'applicaiton/odt';
            case 'zip':
                if (fmt.quality) {
                    switch (fmt.quality.toLowerCase()) {
                        case '3gp':
                            return 'application/zip; content=video/3gp';
                        case 'mp4':
                            return 'application/zip; content=video/mp4';
                        case 'mp3':
                            return 'application/zip; content=audio/mp3';
                    }
                }
                return 'application/zip';
            default:
                if (fmt.url.toLowerCase().indexOf('door43.org/u/door43-catalog') > -1)
                    return 'door43';
                else if (fmt.url.toLowerCase().indexOf('youtube') > -1)
                    return 'youtube';
                else if (fmt.url.toLowerCase().indexOf('bloom') > -1)
                    return 'bloom';
                else if (ext)
                    return ext;
                else
                    return fmt.url.getHostName();
        }
    }

    /**
     * Gets a friendly description of the format
     * @param {Format|Chapter} fmt
     * @param {string} title
     *
     * @returns {string}
     */
    private static getDescription(fmt: Format | Chapter): string {
        let title = fmt.url.split(/[\\/]/).pop();

        if (!fmt.format) {
            fmt.format = OBS.getFormatFromFields(fmt);
        }

        let fmt_description: string;
        let fmt_class: string;

        let format_parts = fmt.format.split(' ');
        let format_map = {};
        format_parts.forEach(part => {
            part = part.replace(/\s*;*$/, '');
            let key_value = part.split('=');
            if (key_value.length == 2) {
                format_map[key_value[0]] = key_value[1];
            } else if (!format_map['mime']) {
                format_map['mime'] = part;
            }
        });

        let is_zipped = (format_map['mime'] == 'application/zip');
        let mime = format_map['mime'];
        if (is_zipped && 'content' in format_map) {
            mime = format_map['content'];
        }

        let mime_parts = mime.split('/');
        let show_size = true;
        switch (mime_parts[mime_parts.length - 1]) {
            case 'pdf':
                fmt_description = 'PDF';
                fmt_class = 'fa-file-pdf-o';
                break;
            case 'youtube':
                title = 'YouTube';
                show_size = false;
                fmt_class = 'fa-youtube';
                fmt_description = 'Website'
                break;
            case 'bloom':
                title = 'Bloom Shell Book';
                show_size = false;
                fmt_description = 'Website';
                fmt_class = 'fa-book';
                break;
            case 'door43':
                title = 'View on Door43.org'
                fmt_description = 'Website';
                fmt_class = 'fa-globe';
                show_size = false;
                break;
            case 'docx':
                fmt_description = 'Word Document';
                fmt_class = 'fa-file-word-o';
                break;
            case 'odt':
                fmt_description = 'OpenDocument Text';
                fmt_class = 'fa-file-text-o';
                break;
            case 'epub':
                fmt_description = 'ePub Book';
                fmt_class = 'fa-book';
                break;
            case 'markdown':
            case 'md':
                fmt_description = 'Markdown';
                fmt_class = 'fa-file-text-o';
                break;
            case 'html':
                fmt_description = 'HTML';
                fmt_class = 'fa-code';
                break;
            case 'usfm':
                fmt_description = 'USFM';
                fmt_class = 'fa-file-text';
                break;
            case 'mp3':
                fmt_description = 'MP3';
                fmt_class = 'fa-file-audio-o';
                break;
            case 'mp4':
                fmt_description = 'MP4';
                fmt_class = 'fa-file-video-o';
                break;
            case '3gp':
            case '3gpp':
                fmt_description = '3GP';
                fmt_class = 'fa-file-video-o';
                break;
            default:
                fmt_description = fmt.format;
                fmt_class = 'fa-file-o';
                break;
        }

        if (fmt.quality && fmt.quality != fmt_description) {
            fmt_description += '&nbsp;&ndash;&nbsp;' + fmt.quality;
        }

        let size_string = ''
        if (show_size) {
            size_string = OBS.getSize(fmt.size);
        }

        if (is_zipped) {
            size_string += ' zipped';
        }
        if (size_string) {
            size_string = ', ' + size_string;
        }

        if ('identifier' in fmt) {
            title = '<span style="color: #606060">Chapter&nbsp;' + parseInt((<Chapter>fmt).identifier).toLocaleString() + ':</span> ' + title
        }

        return OBS.description.format(fmt_class, title, fmt_description, size_string);
    }

    private static getSize(file_size: number): string {

        if (file_size === 0) {
            return '';
        }

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

    private static getList(res_type: Format[], title: string): JQuery {

        let $ul: JQuery = $(OBS.res_ul);

        for (let n = 0; n < res_type.length; n++) {

            let fmt: Format = res_type[n];

            let description = OBS.getDescription(fmt);
            if (description == null)
                continue;

            let $li = $(OBS.res_li.format(fmt.url, description));

            if (('chapters' in fmt) && (fmt.chapters.length > 0)) {
                $li.append(OBS.chapters_h3);

                let $chapter_ul: JQuery = $(OBS.res_ul);

                for (let m = 0; m < fmt.chapters.length; m++) {

                    let chap: Chapter = fmt.chapters[m];

                    let chap_description = OBS.getDescription(chap);
                    if (chap_description == null)
                        continue;

                    let $chap_li = $(OBS.res_li.format(chap.url, chap_description));
                    $chapter_ul.append($chap_li);
                }

                $li.append($chapter_ul);
            }

            $ul.append($li);
        }

        return $ul;
    }
}
