// copied from Backbone.js's setup
(function(root, factory) {

  // Set up _.normalize_nested_params appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'exports'], function(_, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root._.normalize_nested_params = factory(root, exports, _);
    });

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root._.normalize_nested_params = factory(root, root._);
  }

}(this, function(root, _) {
  // Enable test enviroment
  if (root.location && root.location.search.match(/debug_normalize_nested_params/)) {
    root.is_debug = true;
  }

  var normalize_nested_params = function(obj, full_key, val) {
    obj = obj || {};
    var is_write = !_.isUndefined(val);
    if (root.is_debug) { console.log("Current process ", JSON.stringify(obj), full_key, val || "[current opreator is read]"); }

    // Match "content[ab][][sv]"
    var key_regexp = /^[\w]+(\[\w*\])*$/;

    // Validate full_key's format
    if (!full_key.match(key_regexp)) { alert('"' + full_key + '" dont match regexp ' + key_regexp + ' , e.g. contents[][style]'); }

    var full_key_split_result = full_key.split("[");
    full_key_split_result = _.map(full_key_split_result, function(key1) {
      key1 = key1.replace(/\]$/, '');
      // Match array index annotation, e.g. [] or [3], default is 0.
      if (key1.match(/\d+/) || (key1 === '')) { key1 = parseInt(key1, 10) || 0; }
      return key1;
    });

    var max_idx = full_key_split_result.length - 1;
    var current_node = obj;
    _.each(full_key_split_result, function(key1, idx1) {
      if (root.is_debug) { console.log("[Loop over]", JSON.stringify(obj), ",", key1); }

      if ((idx1 === 0) && _.isNumber(key1)) {
        throw new Error("First key should not be an Array!");
      }

      // 1. Set the next key's default value
      if (is_write && ((idx1 + 1) <= max_idx)) {
        var key2 = full_key_split_result[idx1 + 1];
        if (_.isNumber(key2)) { current_node[key1] = current_node[key1] || []; }
        if (_.isString(key2)) { current_node[key1] = current_node[key1] || {}; }
      }

      // 2. Set the value in the last child node.
      if (idx1 === max_idx) {
        if (is_write) {
          current_node[key1] = val; // set through array index or hash key.
        } else {
          val = current_node[key1]; // support read operator
        }
      } else {
        current_node = current_node[key1];
      }
    });

    return val;
  };

  // Test Cases
  if (root.is_debug) {
    obj = {};
    normalize_nested_params(obj, "contents[][style]", 'bold');
    normalize_nested_params(obj, "document[tags][1]", "ruby");
    normalize_nested_params(obj, "document[tags][2]", "open");
    normalize_nested_params(obj, "document[description][text]", "vim");
    normalize_nested_params(obj, "id", 23232);
    normalize_nested_params(obj, "verb", "POST");
    normalize_nested_params(obj, "document[narray][][]", 1);
    normalize_nested_params(obj, "document[narray][1]", [2,3]);
    normalize_nested_params(obj, "document[narray][2]", 4);
    normalize_nested_params(obj, "document[narray][0]", 5);
    console.log("[Result]", JSON.stringify(obj));
    console.log("[Result]", normalize_nested_params(obj, "document[tags][0]"));
    console.log("[Result]", normalize_nested_params(obj, "document[tags][1]"));
  }

  return normalize_nested_params;

}));
