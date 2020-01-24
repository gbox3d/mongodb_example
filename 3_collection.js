const MongoDB = require('mongodb')

const MongoClient = MongoDB.MongoClient;


const repl = require('repl')


const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myTestDB';
const collectionName = "test";

var _testDBObj;

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the Server
client.connect(function (err) {
    //   assert.equal(null, err);
    if (err) {
        console.log(err)
    }
    else
    {
        console.log("Connected successfully to server");
        _testDBObj = client.db(dbName);

    }
        
    //   const db = client.db(dbName);
    //   client.close();
});

let repl_context = repl.start({
    prompt: 'Node.js via stdin> ',
    input: process.stdin,
    output: process.stdout
}).context;

repl_context.theApp = {
    find: () => {
        // const db = client.db(dbName);
        // Get the documents collection
        const collection = _testDBObj.collection(collectionName);
        // Find some documents
        collection.find({}).toArray((err,docs)=> {
            if(err) {
                console.log(err)
            }
            else {
                console.log(docs)
            }
        });
    },
    insert : (msg)=> {
        // const db = client.db(dbName);
        // Get the documents collection
        const collection = _testDBObj.collection(collectionName);

        collection.insertOne({
            at: new Date(),
            msg: msg
        }).then(_=> {
            console.log( `insert complete ${_.insertedCount}` )
        })
        .catch(err=> {
            console.log(`inset error ${err}`)
        })


        // , (err, result) => {
        //     if(err) {
        //         console.log(err)
        //     }
        //     else {
        //         console.log( `ok..${result.insertedCount}` )
        //     }
        // }
    },
    update : (_id,msg) => {
        _testDBObj.collection(collectionName).updateOne({
            _id : MongoDB.ObjectId(_id)
        },{
            $set : {
                msg : msg
            }
        }).then((_)=> {
            console.log( `update complete ${_.matchedCount}` )
            // console.log(_)
        })

    },
    remove : (_id) => {

        console.log(_id)
        _testDBObj.collection(collectionName).deleteOne({_id: MongoDB.ObjectId(_id)},(err,result)=> {
            if(err) {
                console.log(err)
            }
            else {
                console.log( ` remoce count : ${result.deletedCount} ` )
            }

        })

    },
    close : ()=> {
        client.close()
    } 
}