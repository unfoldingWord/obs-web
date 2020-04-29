# OBS Website Code

## Priority #1 - User-friendly Library Page

Target location: [https://openbiblestories.com/library](https://openbiblestories.com/library)

Hosting location: [https://account.squarespace.com/](https://account.squarespace.com/)

#### OBS Formats for download:

* PDF
* DOCX
* ODT
* EPUB
* MD
* MP3 (high and low quality) (individual files and zip)
* MP4 (high and low quality) (individual files and zip)
* 3GP

#### User interface recommendations

See http://openchannelmedia.org/ for an example

* Use world map to separate languages by continent for natural, easy discovery by end-users.
* Use accordion to show/hide resources per language
* Keep alignment of language and its resources compact, not spread across entire page or taking up lots of screen real estate (i.e. the current uW OBS page is consistently reported as confusing and not user friendly)
* Include file size information so users can gauge their ability to download and therefore choose the optimal time or format. 

## Priority #2  - View of what is coming soon in the pipeline

* Perhaps a sidebar or a separate page. It would be helpful for people to be aware of what is coming. This could improve collaboration to bring things past the finish line. It could reduce redundancy occurring in isolation, etc.
* Provide language name, link to view translation status on d43, contact info of contributors, etc.

## Perhaps unrelated, but needed:

* Validation process whereby qualified expert in language group verifies that the OBS PDF is accurate, complete and no issues exist with typeface or layout.
* Way to upload/publish audio & video to door43 so it can be on the OBS site.

## Other Documentation

[http://api-info.readthedocs.io/en/latest/door43.html](http://api-info.readthedocs.io/en/latest/door43.html)

[https://api.door43.org/v3/catalog.json](https://api.door43.org/v3/catalog.json)

https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv


## Developing, Building & Testing

### To Setup the Development Environment:

##### Clone the repo:

```
  $ git clone git@github.com:unfoldingword-dev/obs-web.git
```

##### Install node.js:

  You can install nodejs and npm easily with apt install, just run the following commands on Ubuntu.

```
  $ sudo apt install nodejs
  $ sudo apt install npm
```

  or with brew on Mac:

```
  $ brew install nodejs
  $ brew install npm
```

  For other OSs, go to the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/)

#### Install yarn:

  After installing node, this project will need yarn too, so just run the following command.

```
  $ npm install -g yarn
```

#### Load the dependencies:

```
  $ cd obs-web
  $ yarn install --frozen-lockfile
```

If you modify the package.json file to add/update dependencies, run:

```
  $ yarn install
```

#### Edit the source files:

  Edit the files in the `src/` directory.

### To Build:

  Build by running:

```
  $ yarn build
```

  This will build the minified js and css files in the `build/` directory.

### To View the OBS Library Page Locally:

  Run the following to get the http-server going on port 8081:

```
  $ yarn start
```

  and go to [http://127.0.0.1:8081](http://127.0.0.1:8081).

  If you desire a different port, just use, for example:

```
  $ yarn start --port=8888
```

  where `8888` is the port that will be used, and [http://127.0.0.1:8888](http://127.0.0.1:8888) is where you can view the html page.

### To Run Unit Tests:

  To run the unit tests, using karma, run:

```
  $ yarn test
```

  Add your tests to the js files in the `test/js/` directory.

