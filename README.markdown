normalize_nested_params.js
================================
[![Build Status](https://img.shields.io/travis/17zuoye/normalize_nested_params/master.svg?style=flat)](https://travis-ci.org/17zuoye/normalize_nested_params)

Original idea comes from Rack::Utils#normalize_nested_params, see it at http://rack.rubyforge.org/doc/Rack/Utils.html

This function is binding to underscore.js's namespace.

e.g.
```javascript
_.normalize_nested_params(obj, "contents[][style]", 'bold') #=> {"contents":[{"style":"bold"}]}
_.normalize_nested_params(obj, "contents[][style]")         #=> 'bold'
```

See more examples in Test Cases.

Run tests, add "debug_normalize_nested_params" to location search string


Copyright
--------------------------------
MIT. David Chen at 17zuoye.
