'use strict';

describe('OBS class test suite', function() {

    beforeEach(function() {

        jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

        loadFixtures('published-languages-fixture.html');

        // verify the fixture loaded successfully
        expect(jQuery('#jasmine-fixtures')).toBeTruthy();
    });

    it('Test OBS constructor', function() {

        var obs = new OBS('test');

        expect(obs).toBeTruthy();
        expect(obs.testString).toEqual('Test success.');
    });

    it('Test constructor with bad path', function(done) {

        new OBS('/base/test/data/catalog.bob', function(loadResult) {

            expect(loadResult).toEqual('Failed: status = "error", message = "Not Found".');

            done();
        });
    });

    it('Test constructor with good path', function(done) {
        testWithAllObsCatalogFiles(function(obs) {
            expect(obs.languages.length).toBeGreaterThan(0);
            expect(obs.languages[0].resources[0].identifier).toEqual('obs');
        }, done);
    });

    it('Test OBS.buildDiv()', function(done) {
        testWithAllObsCatalogFiles(function(obs) {
            obs.buildDiv();
            var html = $('body');
            expect(html).toBeTruthy();
        }, done);
    });

    it('Test no format specified', function(done) {
        testWithAllObsCatalogFiles(function(obs) {
            var english = obs.languages.filter(function(lang) { return lang.language === 'en'; });
            // noinspection JSCheckFunctionSignatures
            expect(english.length).toEqual(1);
            var resources = OBS.getResources(english[0]);
            expect(resources).toHaveProp('other');
            expect(resources.other.length).toBeGreaterThan(0);
        }, done);
    });

    it('Test YouTube format', function(done) {
        testWithAllObsCatalogFiles(function(obs) {
            var english = obs.languages.filter(function(lang) { return lang.language === 'en'; });
            var resources = OBS.getResources(english[0]);
            expect(resources.other.length).toBeGreaterThan(0);

            var youtube = resources.other.filter(function(res) { return res['format'].indexOf('youtube') > -1 });
            expect(youtube.length).toBeGreaterThan(0);
        }, done);
    });

    it('Test YouTube link', function(done) {
        testWithAllObsCatalogFiles(function(obs) {
            obs.buildDiv();
            var html = $('body');
            expect(html).toBeTruthy();
        }, done);
    });

    it('Test audio chapters', function(done) {
        testWithAllObsCatalogFiles(function(obs) {
            var english = obs.languages.filter(function(lang) { return lang.language === 'en'; });
            var resources = OBS.getResources(english[0]);
            expect(resources.audio.length).toBeGreaterThan(0);

            var mp3 = resources.audio[0];
            expect(mp3).toHaveProp('chapters');
            expect(mp3.chapters[0].identifier).toEqual('01');
        }, done);
    });

    it('Test DOCX, ODT and EPUB link', function(done) {
        testWithAllObsCatalogFiles(function(obs) {
            obs.buildDiv();
            var $div = $('body').find('h2[data-lang-code=en]').closest('div');
            var html = $div.html();
            expect(html).toContain('Word Document');
            expect(html).toContain('OpenDocument Text');
            expect(html).toContain('ePub Book');
            html = $('html').html();
        }, done);
    });

    it('Test OBS.getFormatFromFields', function(done) {
        var url = "https://filedn.com/lD0GfuMvTstXgqaJfpLL87S/en/obs/v8/320/en_obs_01.mp4";
        var result = OBS.getFormatFromFields({ url: url, quality: '64kbps' })
        var expectedResult = "video/mp4";
        expect(result).toEqual(expectedResult);

        var url = "https://filedn.com/lD0GfuMvTstXgqaJfpLL87S/en/obs/v8/320/en_obs_01.zip";
        var result = OBS.getFormatFromFields({ url: url, quality: '3gp' })
        var expectedResult = "application/zip; content=video/3gp";
        expect(result).toEqual(expectedResult);

        var url = "https://filedn.com/lD0GfuMvTstXgqaJfpLL87S/en/obs/v8/320/en_obs_01.html?q=query";
        var result = OBS.getFormatFromFields({ url: url })
        var expectedResult = "text/html";
        expect(result).toEqual(expectedResult);

        var url = "https://filedn.com/lD0GfuMvTstXgqaJfpLL87S/en/obs/v8/320/en_obs_01";
        var result = OBS.getFormatFromFields({ url: url })
        var expectedResult = "en_obs_01";
        expect(result).toEqual(expectedResult);

        var url = "https://filedn.com/lD0GfuMvTstXgqaJfpLL87S/en/obs/v8/320/en_obs_01.1.2";
        var result = OBS.getFormatFromFields({ url: url })
        var expectedResult = "2";
        expect(result).toEqual(expectedResult);

        done();
    });
});

var obsCatalogFiles = [
    '/base/test/data/Open_Bible_Stories_v4.json',
    '/base/test/data/Open_Bible_Stories_v7.json',
    '/base/test/data/Open_Bible_Stories_v8.json',
];

function testWithAllObsCatalogFiles(callback, done) {
    obsCatalogFiles.forEach(function(obsCatalogFile, idx, array) {
        jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
        loadFixtures('published-languages-fixture.html');
        expect(jQuery('#jasmine-fixtures')).toBeTruthy();
        var obs = new OBS(obsCatalogFile, function(loadResult) {
            expect(loadResult).toEqual('Successfully loaded catalog data.');
            callback(obs);
            if (idx === array.length - 1) {
                done();
            }
        });
    });
}