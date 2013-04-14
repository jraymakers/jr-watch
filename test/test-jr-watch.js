var async = require('async');
var fse = require('fs-extra');
var jrWatch = require('../');
var path = require('path');

describe('jr-watch', function () {
  
  var testFilesDir = path.join('test', 'files');
  var testFile = path.join(testFilesDir, 'testFile');
  var testFileContents = 'testFileContents';
  var testFileContentsChanged = 'testFileContentsChanged';
  
  afterEach(function (done) {
    fse.remove(testFilesDir, done);
  });
  
  it('should start and stop without errors', function (done) {
    async.waterfall([
      async.apply(jrWatch, {
        path: testFilesDir
      }),
      function (watcher, cb) {
        watcher.stop();
        cb();
      }
    ], done);
  });
  
  it('should detect added files with onAdd', function (done) {
    var savedWatcher;
    async.waterfall([
      async.apply(fse.mkdir, testFilesDir),
      async.apply(jrWatch, {
        path: testFilesDir,
        onAdd: function () {
          savedWatcher.stop();
          done();
        }
      }),
      function (watcher, cb) {
        savedWatcher = watcher;
        cb();
      },
      async.apply(setTimeout, function () {
        fse.outputFile(testFile, testFileContents);
      }, 1000)
    ]);
  });
  
  it('should detect changed files with onChange', function (done) {
    var savedWatcher;
    async.waterfall([
      async.apply(fse.mkdir, testFilesDir),
      async.apply(jrWatch, {
        path: testFilesDir,
        onAdd: function () {
          setTimeout(function () {
            fse.outputFile(testFile, testFileContentsChanged);
          }, 1000);
        },
        onChange: function () {
          savedWatcher.stop();
          done();
        }
      }),
      function (watcher, cb) {
        savedWatcher = watcher;
        cb();
      },
      async.apply(fse.outputFile, testFile, testFileContents)
    ]);
  });
      
  it('should detect removed files with onRemove', function (done) {
    var savedWatcher;
    async.waterfall([
      async.apply(fse.mkdir, testFilesDir),
      async.apply(jrWatch, {
        path: testFilesDir,
        onAdd: function () {
          setTimeout(function () {
            fse.remove(testFile);
          }, 1000);
        },
        onRemove: function () {
          savedWatcher.stop();
          done();
        }
      }),
      function (watcher, cb) {
        savedWatcher = watcher;
        cb();
      },
      async.apply(fse.outputFile, testFile, testFileContents)
    ]);
  });
  
  it('should detect added files with onAll', function (done) {
    var savedWatcher;
    async.waterfall([
      async.apply(fse.mkdir, testFilesDir),
      async.apply(jrWatch, {
        path: testFilesDir,
        onAll: function () {
          savedWatcher.stop();
          done();
        }
      }),
      function (watcher, cb) {
        savedWatcher = watcher;
        cb();
      },
      async.apply(setTimeout, function () {
        fse.outputFile(testFile, testFileContents);
      }, 1000)
    ]);
  });
  
  it('should detect changed files with onAll', function (done) {
    var allCount = 0;
    var savedWatcher;
    async.waterfall([
      async.apply(fse.mkdir, testFilesDir),
      async.apply(jrWatch, {
        path: testFilesDir,
        onAdd: function () {
          setTimeout(function () {
            fse.outputFile(testFile, testFileContentsChanged);
          }, 1000);
        },
        onAll: function () {
          ++allCount;
          if (allCount === 2) {
            savedWatcher.stop();
            done();
          }
        }
      }),
      function (watcher, cb) {
        savedWatcher = watcher;
        cb();
      },
      async.apply(fse.outputFile, testFile, testFileContents)
    ]);
  });
      
  it('should detect removed files with onAll', function (done) {
    var allCount = 0;
    var savedWatcher;
    async.waterfall([
      async.apply(fse.mkdir, testFilesDir),
      async.apply(jrWatch, {
        path: testFilesDir,
        onAdd: function () {
          setTimeout(function () {
            fse.remove(testFile);
          }, 1000);
        },
        onAll: function () {
          ++allCount;
          if (allCount === 2) {
            savedWatcher.stop();
            done();
          }
        }
      }),
      function (watcher, cb) {
        savedWatcher = watcher;
        cb();
      },
      async.apply(fse.outputFile, testFile, testFileContents)
    ]);
  });
  
});