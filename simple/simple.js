/**
 * Provides simple storage for browsers that do not support HTML5 Local & Session Storage
 * Based on jQuery.Model.Store from JavaScriptMVC
 */
jQuery.Class.extend("SS.Model.HTML5Store.Simple", /* @prototype */ {
	/**
	 * 
	 * @param {Object} klass
	 */
	init: function( klass ) {
		this._data = {};
		this.setStoringClass(klass);
	},
	/**
	 * 
	 * @param {Object} klass
	 */
	setStoringClass: function( klass ) {
		this.storing_class = klass;
	},
	/**
	 * 
	 * @param {Object} id
	 */
	findOne: function( id ) {
		return id ? this._data[id] : null;
	},
	/**
	 * 
	 * @param {Object} obj
	 */
	create: function( obj ) {
		var id = obj[obj.Class.id];
		this._data[id] = obj;
	},
	/**
	 * 
	 * @param {Object} obj
	 */
	push: function( obj ) {
		return this.create(obj);
	},
	/**
	 * 
	 * @param {Object} id
	 */
	destroy: function( id ) {
		delete this._data[id];
	},
	/**
	 * 
	 * @param {Object} id
	 */
	remove: function( id ) {
		return this.destroy(id);
	},
	/**
	 * Finds instances using a test function.  If no test function is provided returns all instances.
	 * @param {Function} f
	 * @return {Array}
	 */
	find: function( f ) {
		var instances = [];
		for ( var id in this._data ) {
			var inst = this._data[id];
			if (!f || f(inst) ) instances.push(inst);
		}
		return instances;
	},
	/**
	 * Clears instances
	 */
	clear: function() {
		this._data = {};
	},
	/**
	 * Returns if there is no instances
	 * @return {Boolean}
	 */
	isEmpty: function() {
		return !this.find().length;
	}
});
