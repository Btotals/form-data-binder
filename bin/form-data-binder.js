(function(){
  var pathDelimiter, pathValidationRegex, formDataBinder, root, ref$;
  pathDelimiter = '.';
  pathValidationRegex = /^[a-zA-Z0-9.[\]]+$/;
  formDataBinder = {
    f2d: function(selector, data){
      var nameValuePairs;
      data == null && (data = {});
      nameValuePairs = $(selector).serializeArray();
      return this.buildData(nameValuePairs, data);
    },
    buildData: function(pairs, data){
      var i$, len$, pair;
      for (i$ = 0, len$ = pairs.length; i$ < len$; ++i$) {
        pair = pairs[i$];
        this.setDataValue(pair.name, pair.value, data);
      }
      return data;
    },
    setDataValue: function(path, value, data){
      var levels, obj, i$, len$, i, level, matches, __all__, attr, index, results$ = [];
      path = path.trim();
      if (!pathValidationRegex.test(path)) {
        throw new Error("path: '" + path + "'' is invalid");
      }
      levels = path.split(pathDelimiter);
      obj = data;
      for (i$ = 0, len$ = levels.length; i$ < len$; ++i$) {
        i = i$;
        level = levels[i$];
        matches = level.match(/(.+)\[(\d+)\]$/);
        if (!matches) {
          results$.push(obj = this.setObjectValue(obj, level, value, this.getNextLevel(levels, i)));
        } else {
          __all__ = matches[0], attr = matches[1], index = matches[2];
          results$.push(obj = this.setArrayValue(obj, attr, index, value, this.getNextLevel(levels, i)));
        }
      }
      return results$;
    },
    getNextLevel: function(levels, i){
      if (i === levels.length - 1) {
        return null;
      } else {
        return {};
      }
    },
    setObjectValue: function(obj, attr, value, nextLevel){
      if (nextLevel) {
        return obj[attr] || (obj[attr] = nextLevel);
      } else {
        if (obj[attr] != null) {
          throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr]);
        }
        return obj[attr] = value;
      }
    },
    setArrayValue: function(obj, attr, index, value, nextLevel){
      var ref$;
      if (nextLevel) {
        return this.setArrayValueToIndex(obj, attr, index, nextLevel);
      } else {
        if (((ref$ = obj[attr]) != null ? ref$[index] : void 8) != null) {
          throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr][index]);
        }
        return this.setArrayValueToIndex(obj, attr, index, value);
      }
    },
    setArrayValueToIndex: function(obj, attr, index, value){
      var array, i$, ref$, len$, i;
      if (obj[attr] != null && !Array.isArray(obj[attr])) {
        throw new Error(attr + " of object: " + obj + " should be an array");
      }
      array = obj[attr] || (obj[attr] = []);
      for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        if (typeof array[i] === 'undefined') {
          array[i] = null;
        }
      }
      return array[index] || (array[index] = value);
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = index - 1; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    },
    d2f: function(data, selector){
      var form;
      form = $(selector);
      this.setFormWithData(form, data, '');
    },
    setFormWithData: function(form, data, path){
      if (Array.isArray(data)) {
        this.setFromWithArray(form, data, path);
      } else {
        this.setFormWithObject(form, data, path);
      }
    },
    setFromWithArray: function(form, data, path){
      var container, amountOfArrayItemsNeedAdded, button, i$, ref$, len$, i, index, value, newPath;
      container = $(form).find("[name=\"" + path + "\"]");
      if (!container.hasClass('array-container')) {
        throw new Error(path + " is an array but can't find its array-container");
      }
      amountOfArrayItemsNeedAdded = data.length - parseInt(container.attr('data-a-plus-length'));
      button = $(container).children('button.at-plus.add-array-item');
      for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        this.clickingButtonToAddArrayItem(button);
      }
      for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
        index = i$;
        value = data[i$];
        newPath = path + "[" + index + "]";
        if ($(form).find("[name=\"" + newPath + "\"]").length === 0) {
          throw new Error("can't find " + newPath);
        }
        this.setFormWithData(form, value, newPath);
      }
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 1, to$ = amountOfArrayItemsNeedAdded; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    },
    setFormWithObject: function(form, data, path){
      var key, value, newPath;
      if (typeof data !== 'object') {
        $(form).find("[name=\"" + path + "\"]").val(data);
      } else {
        for (key in data) {
          value = data[key];
          newPath = path === ''
            ? key
            : path + "." + key;
          if ($(form).find("[name=\"" + newPath + "\"]").length === 0) {
            throw new Error("can't find " + newPath);
          }
          this.setFormWithData(form, value, newPath);
        }
      }
    }
  };
  if (typeof define != 'undefined' && define !== null) {
    define('form-data-binder', [], function(){
      return formDataBinder;
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formDataBinder = formDataBinder;
  }
}).call(this);