const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'student_credits';
const collectionName = 'credits';
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
MongoClient.connect('mongodb://127.0.0.1:27017', {
   useUnifiedTopology:true, useNewUrlParser:true
 },function(err,db){
  if(!err){
   console.log('Mongodb connection test ok! driver @3.6');
  };
  db.close();
 });
// Create 
app.post('/api/credit', async (req, res) => {
  try {
    const client = await MongoClient.connect(url,{
      useUnifiedTopology:true, useNewUrlParser:true
    });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    client.close();
    res.send(result.ops[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating credit');
  }
});

// Get all 
app.get('/api/credit', async (req, res) => {
  try {
    const client = await MongoClient.connect(url,{
      useUnifiedTopology:true, useNewUrlParser:true
    });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const credits = await collection.find({}).toArray();
    client.close();
    res.send(credits);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting credits');
  }
});

// Delete specified entry 
app.delete('/api/credit/:id', async (req, res) => {
  try {
    const client = await MongoClient.connect(url,{
      useUnifiedTopology:true, useNewUrlParser:true
    });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const credits = await collection.findOneAndDelete({'student_number':req.params.id});
    client.close();
    console.log(credits);
    res.send(`student ${credits.value.student_number} deleted.`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting credits');
  }
});

//send root html
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

