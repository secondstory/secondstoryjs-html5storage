steal.plugins('ss/model/local_store').then(function($){

  SS.Model.LocalStore.extend("SS.Model.SessionStore", {
    storageMethod: "sessionStorage"
  });
  
});
