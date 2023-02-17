const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'accounts-payable';
const collectionName = 'invoices';
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
// Create a new invoice
app.post('/api/invoices', async (req, res) => {
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
    res.status(500).send('Error creating invoice');
  }
});

// Get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const client = await MongoClient.connect(url,{
      useUnifiedTopology:true, useNewUrlParser:true
    });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const invoices = await collection.find({}).toArray();
    client.close();
    res.send(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting invoices');
  }
});

//send root html
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'invoice.html'));
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

