'use strict';

// Protractor configuration
var config = {
  specs: ['modules/*/tests/e2e/*.js'],

  onPrepare: function () {
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter());
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 20000
  }
};

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
