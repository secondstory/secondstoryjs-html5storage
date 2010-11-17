steal.plugins('ss/model/html5_store/local').then(function($){

  SS.Model.HTML5Store.Local.extend("SS.Model.HTML5Store.Session", {
    storageMethod: "sessionStorage"
  });
  
});
