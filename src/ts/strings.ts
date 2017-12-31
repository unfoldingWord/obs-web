
interface String {

    format(...args:string[]): string;
    endsWith(suffix: string): boolean;
    startsWith(prefix: string): boolean;
    toInt(): number;
    toFloat(): number;
    getHostName(): string;
}

/**
 * Replace placeholders ({0}, {1}, etc) with the corresponding arg
 * @param {string} args The strings to substitute
 * @returns {string}
 */
String.prototype.format = function(...args:string[]): string {

    let s: string = this;

    for (let i = 0; i < args.length; i++) {
        const reg = new RegExp('\\{' + i + '\\}', 'g');
        s = s.replace(reg, args[i]);
    }

    return s;
};

/**
 * Does the string end with suffix?
 * @param {string} suffix
 * @returns {boolean}
 */
String.prototype.endsWith = function (suffix) {
    const s: string = this;
    return (s.substr(s.length - suffix.length) === suffix);
};

/**
 * Does the string begin with prefix?
 * @param {string} prefix
 * @returns {boolean}
 */
String.prototype.startsWith = function(prefix) {
    const s: string = this;
    return (s.substr(0, prefix.length) === prefix);
};

/**
 * Converts the string to an integer
 * @returns {number}
 */
String.prototype.toInt = function() {
    const s: string = this;
    return parseInt(s);
};

/**
 * Converts the string to a float
 * @returns {number}
 */
String.prototype.toFloat = function() {
    const s: string = this;
    return parseFloat(s);
};

String.prototype.getHostName = function() {

    let hostname: string;

    // find and remove protocol
    if (this.indexOf("://") > -1) {
        hostname = this.split('/')[2];
    }
    else {
        hostname = this.split('/')[0];
    }

    // find and remove port number
    hostname = hostname.split(':')[0];

    // find and remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};