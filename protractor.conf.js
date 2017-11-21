'use strict';

// Protractor configuration
var config = {
  specs: ['modules/*/tests/e2e/*.js'],

  onPrepare: function () {
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter());
  }

  /*jasmineNodeOpts: {
    defaultTimeoutInterval: 20000
  }*/
};

/*
* directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
   // 'browserName': 'firefox'
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    print: function () {} // remove dots for each test
  },

  onPrepare: function () {
    const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter());
},


  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['signup_test.js','login_test.js'],
 // specs: ['facultyportal_test.js'],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 20000
  }
* */

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
