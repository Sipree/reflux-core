module.exports = function(config) {
    config.set({
        logLevel: 'LOG_DEBUG',

        reporters: ['spec'],

        singleRun : true,
        autoWatch : false,

        browsers: ['PhantomJS'],

        frameworks: [
            'mocha',
            'browserify'
        ],

        files: [
            '../shims/phantomjs-shims.js',
            '../*.spec.js'
        ],

        preprocessors: {
            '../shims/phantomjs-shims.js': ['browserify'],
            '../*.spec.js': ['browserify']
        },

        browserify: {
            debug: true
        }
    });
};
