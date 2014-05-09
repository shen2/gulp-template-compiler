'use strict';

var through = require('through');
var path = require('path');
var gutil = require('gulp-util');

module.exports = function(compiler) {
  return through(function(file) {
    if (file.isNull()) {
      return this.queue(file);
    }

    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError('gulp-template-compiler', 'Streaming not supported'));
    }

    var contents = file.contents.toString();
    var compiled = null;
    try {
      compiled = compiler(contents).toString();
    }
    catch (err) {
      return this.emit('error', err);
    }

    file.contents = new Buffer(compiled);
    file.path = gutil.replaceExtension(file.path, '.js');

    this.queue(file);
  });
};
