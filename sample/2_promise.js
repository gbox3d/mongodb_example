const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017'; // Connection URL
// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });


client.connect()
    .then(_ => {
        console.log("Connected successfully to server");

        //collection 지정 , 없으면 만들어짐 
        return client.db('myTestDB').collection('promise_test').insertOne({
            at: new Date(),
            msg: 'hello'
        })
    })
    .then(_ => {
        console.log('insert complete')
    })
    // .then(_=> {
    //     console.log("Connected successfully to server");
    // })
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        client.close()
    })

