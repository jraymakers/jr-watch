var _ = require('underscore');
var chokidar = require('chokidar');

module.exports = function (opts, cb) {
  var debounceTime = opts.debounceTime > 0 ? opts.debounceTime : 500;
  var watcher = chokidar.watch(opts.path || opts.paths, opts.options);
  if (opts.onAll) {
    watcher.on('all', /*_.debounce(*/opts.onAll/*, debounceTime)*/);
  }
  if (opts.onAdd) {
    watcher.on('add', _.debounce(opts.onAdd, debounceTime));
  }
  if (opts.onChange) {
    watcher.on('change', _.debounce(opts.onChange, debounceTime));
  }
  if (opts.onRemove) {
    watcher.on('unlink', _.debounce(opts.onRemove, debounceTime));
  }
  if (opts.onError) {
    watcher.on('error', opts.onError);
  }
  cb(null, {
    stop: function () {
      watcher.close();
    }
  });
};