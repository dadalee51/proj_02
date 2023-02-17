var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017', {
   useUnifiedTopology:true, useNewUrlParser:true
 },function(err,db){
  if(!err){
   console.log('You are connected!');
  };
  db.close();
 });

