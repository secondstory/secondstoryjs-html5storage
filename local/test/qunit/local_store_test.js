module("HTML5 Model Store");

$.Model.extend("LocalStoreTestModel", 
{
  setup: function(){
		this.storeType = SS.Model.HTML5Store.Local;
    this._super.apply(this, arguments);
	}
},
{
});

function resetStorage() {
  localStorage.clear();
}

test("Create item in store manually", function(){
  resetStorage();
  
  equals(localStorage.length, 0);
  var testModel = new LocalStoreTestModel({ id: 1, name: "test" });
  
  resetStorage();
  LocalStoreTestModel.store.create(testModel);
  equals(localStorage.length, 1);
});

test("Create item in store via Model", function(){
  resetStorage();
  
  equals(localStorage.length, 0);
  var testModel = new LocalStoreTestModel({ id: 1, name: "test" });
  equals(localStorage.length, 1);
});

test("FindOne item in store", function(){
  resetStorage();
  
  equals(localStorage.length, 0);
  var testModel  = new LocalStoreTestModel({ id: 1, name: "test" });
  var foundModel = LocalStoreTestModel.store.findOne(1);
  equals(foundModel.name, testModel.name);
});

test("Remove item from store", function(){
  resetStorage();
  
  equals(localStorage.length, 0);
  var testModel = new LocalStoreTestModel({ id: 1, name: "test" });
  equals(localStorage.length, 1);
  LocalStoreTestModel.store.destroy(testModel.id);
  equals(localStorage.length, 0);
});

test("Search items in store", function(){
  resetStorage();
  expect(2);
  
  equals(localStorage.length, 0);
  var testModel = new LocalStoreTestModel({ id: 1, name: "test" });
  
  LocalStoreTestModel.store.find(function(foundModel) {
    start();
    equals(foundModel.name, testModel.name);
  });
  stop();
});

test("Clear store", function(){
  resetStorage();
  
  equals(localStorage.length, 0);
  var testModel = new LocalStoreTestModel({ id: 1, name: "test" });
  equals(localStorage.length, 1);
  LocalStoreTestModel.store.clear();
  equals(localStorage.length, 0);
});
