steal.plugins("ss/model/html5_store/simple", 
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
    SS.Model.HTML5Store.Simple.extend("SS.Model.HTML5Store.Local", {}, {});

    //@steal-remove-start
    steal.dev.log("WARNING: The current browser does not support HTML5 Local & Session Storage");
    //@steal-remove-end
  } else {
    $.Class.extend("SS.Model.HTML5Store.Local", 
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
        this.setStoringClass(klass);
        this.storage          = window[this.storageMethod];
	    },

      setStoringClass: function(klass) {
        this.storingClass     = klass;
        this.storageNamespace = (klass._fullName || klass.underscoredName) + ".";
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
	    
      push: function(obj, id){
        this.create(obj, id);
	    },

      destroy: function(id){
        delete this.storage[this.storageNamespace + id];
	    },
	    
      remove: function(id){
        this.destroy(id);
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
