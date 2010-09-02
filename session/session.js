steal.plugins('ss/model/html5_store/local').then(function($){

  SS.Model.LocalStore.extend("SS.Model.HTML5Store.Session", {
    storageMethod: "sessionStorage"
  });
  
});
