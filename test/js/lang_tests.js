'use strict';

describe('LangNames test suite', function() {

    it('Test LangNames constructor', function() {

        var lang_names = new LangNames('test');

        expect(lang_names).toBeTruthy();
        expect(lang_names.testString).toEqual('Test success.');
    });

    it('Test constructor with bad path', function(done) {

        new LangNames('/base/test/data/langnames.bob', function(loadResult) {

            expect(loadResult).toEqual('Failed: status = "error", message = "Not Found".');

            done();
        });
    });

    it('Test constructor with good path', function(done) {

        var lang_names = new LangNames('/base/test/data/langnames.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded langnames data.');
            expect(lang_names.languages.length).toBeGreaterThan(0);
            expect(lang_names.languages[0].lc).toEqual('aa');

            done();
        });
    });

    it('Test language regions', function(done) {

        var lang_names = new LangNames('/base/test/data/langnames.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded langnames data.');

            var regions = {};
            for (var i = 0; i < lang_names.languages.length; i++) {

                if (regions[lang_names.languages[i].lr]) {
                    regions[lang_names.languages[i].lr] += 1;
                }
                else {
                    regions[lang_names.languages[i].lr] = 1;
                }
            }

            console.log(regions);

            done();
        });
    });
});
