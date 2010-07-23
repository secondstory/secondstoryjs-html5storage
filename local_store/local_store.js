steal.plugins("jquery/model/store", 
              "jquery/model", 
              "jquery/lang/json").then(function($) {
  function hasLocalAndSessionStorageSupport() {
    try {
      return ((('localStorage'   in window) && window['localStorage']   !== null) &&
              (('sessionStorage' in window) && window['sessionStorage'] !== null));
    } catch(e) {
      return false;
    }
  }

  if (!hasLocalAndSessionStorageSupport()) { 
    $.Model.Store.extend("SS.Model.LocalStore", {}, {});

    //@steal-remove-start
    steal.dev.log("WARNING: The current browser does not support HTML5 Local & Session Storage");
    //@steal-remove-end
  } else {
    $.Class.extend("SS.Model.LocalStore", 
    {
    },
    {
      storageMethod: "localStorage",
      
      // jQuery's parseJSON will check for native JSON.parse support first
      parseJSON:     $.parseJSON,
			
			// Try to use the native JSON stringify first
      toJSON:        function(data) {
			  return window.JSON && window.JSON.stringify 
			    ? window.JSON.stringify
				  : $.toJSON;
      }(),
      
      init: function(klass) {
        this.storingClass     = klass;
        this.storageNamespace = klass.underscoredName + ".";
        this.storage          = window[this.storageMethod];
	    },
	    
      findOne: function(id) {
        if (id && this.storage[this.storageNamespace + id]) {
          var parsedJSON = this.parseJSON(this.storage[this.storageNamespace + id]);
          return new this.storingClass(parsedJSON);
        } else {
          return null;
        }
	    },
	    
      create: function(obj, id){
		    id = id || obj[obj.Class.id];
        this.storage[this.storageNamespace + id] = this.toJSON(obj.attrs());
	    },
	    
      destroy: function(id){
        delete this.storage[this.storageNamespace + id];
	    },
	    
      find: function(f){
        var instances = [];
        
        var i         = -1, 
            len       = this.storage.length,
            prefixReg = new RegExp(this.storageNamespace.replace(/\./g, "\\."));
            
        while ( ++i < len ) { 
          var key = this.storage.key(i);
          
          if (key.match(prefixReg)) {
            var value = this.findOne(key.replace(prefixReg, ""));
            if (!f || f(value)) {
              instances.push(value);
            } 
          }
        }
        
        return instances;
      },
      
      clear: function(){
        var i         = -1,
            len       = this.storage.length,
            prefixReg = new RegExp(this.storageNamespace.replace(/\./g, "\\.")),
            toRemove  = [];
            
        while (++i < len) { 
          var key = this.storage.key(i);
          if (key.match(prefixReg)) {
            toRemove.push(key);
          }
        }
        
        for (var j = 0; j < toRemove.length; j++) {
          delete this.storage[toRemove[j]];
        }
      },
      
      isEmpty: function() {
		    return !this.storage.length;
		  }
    });
  }
});
