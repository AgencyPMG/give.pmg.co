// Karma configuration
// Generated on Wed Oct 30 2013 11:36:12 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: 'public',


    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],

    // list of files / patterns to load in the browser
    files: [
      'scripts/test-main.js',
      'components/jquery/jquery.js',
/*
      'public/components/bootstrap/dist/scripts/bootstrap.min.js',
      'public/components/underscore/underscore-min.js',
*/
      {pattern: 'components/bootstrap/dist/**/*.js', included: false},
      {pattern: 'components/underscore*/*.js', included: false},
      {pattern: 'components/jquery*/**/*.js', included: false},
      {pattern: 'components/require*/*.js', included: false},
      {pattern: 'scripts/**/*.js', included: false},
      {pattern: 'scripts/template/**/*.html', included: false}
    ],


    // list of files to exclude
    exclude: [
        
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome', 'Firefox'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    preprocessors: {},
    
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};