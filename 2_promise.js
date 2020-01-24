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




// (new Promise((resolve, reject) => {

//     // Use connect method to connect to the Server
//     client.connect(function (err) {

//         if (err) {
//             //접속실패
//             reject(err);
//         }
//         else {
//             //접속 성공
//             console.log("Connected successfully to server");
//             resolve({
//                 client: client
//             })
//         }
//     });

// }))
//     .then(_ => new Promise((resolve, reject) => {
//         // Database Name
//         const dbName = 'myTestDB';
//         const db = _.client.db(dbName);

//         //collection 지정 , 없으면 만들어짐 
//         const _col = db.collection('test');

//         _col.insertOne({
//             at: new Date(),
//             msg: 'hello'
//         }, (err, result) => {

//             if (err) {
//                 console.log(err)
//                 reject(err)
//             }
//             else {
//                 resolve(result);
//             }

//         });

//     }))
//     .then(_ => {
//         console.log('insert ok', _.insertedCount)
//         // console.log('comsole',_);
//     })
//     .catch((_) => {
//         console.log('error catched ', _)

//     })
//     .finally( ()=> {
//         console.log('close connection');
//         // console.log(_)
//         client.close();
//         // process.exit()
//     })

