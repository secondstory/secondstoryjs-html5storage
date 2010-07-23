steal.plugins('ss/model/session_store', "steal/inflector").then(function($) {

  $.Model.extend("SS.Model",
  {
    fetchMethod: "getJSON",
    
    setup: function(){
		  this.storeType = steal.options.env === 'production' 
		                     ? SS.Model.SessionStore
		                     : $.Model.Store;
      this._super.apply(this, arguments);
      this.addAttr("fullyLoaded", "boolean");
    },

    findOne: function(id, params, success) {
      var cachedModel = this.store.findOne(id);
      if ((typeof cachedModel !== "undefined") && cachedModel) {
        //@steal-remove-start
        if (cachedModel.fullyLoaded) {
          steal.dev.log("CACHE (Hit): " + this.shortName + "#" + cachedModel.id);
        }
        //@steal-remove-end
        cachedModel.loadFully(success);
      } else {
        $[this.fetchMethod](this.apiPath() + '/' + id + '.json', params, this.callback(["wrap", "markAsFullyLoaded", success]));
      }
    },
    
    wrap: function(attributes) {
	    if (!attributes) { return null; }
	    
      var cachedModel = this.store.findOne(attributes.id);
      if ((typeof cachedModel !== "undefined") && cachedModel) {
        return cachedModel;
      } else {
        return this._super(attributes);
      }
    },

    findAll: function(params, success){
      $.extend(params, { itemsPerPage: "all" });
      $[this.fetchMethod](this.apiPath() + ".json", params, this.callback(function(collection) {
        var result = this.wrapMany(collection.list);
        if (typeof success !== "undefined") {
          success(result);
        }
      }));
    },
    
    markAsFullyLoaded: function(modelData) {
      modelData.attr("fullyLoaded", true);
      return modelData;
    },
    
    apiPath: function() {
      return '/srv/' + steal.Inflector.pluralize(this.shortName.toLowerCase());
    }
  },
  {    
    associate: function() { },
    
    loadFully: function(aCallback) {
      if (this.attr("fullyLoaded") === true) {
        aCallback(this);
      } else {
        $[this.Class.fetchMethod](this.Class.apiPath() + '/' + this.id + '.json', {}, this.callback(function(newData) {
          this.attrs(newData);
          this.attr("fullyLoaded", true);
          this.associate();

          // Push updates to backing store
          this.Class.store.destroy(this.id);
          this.Class.store.create(this);
                  
          aCallback(this);
        }));
      }
    }
  }
  );
});
