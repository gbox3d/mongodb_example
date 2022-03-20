const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017'; // Connection URL
// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

(async () => {

    try {

        let result = await client.connect();

        if(result) {
            console.log('connect success ' + result.s.url)
        }
        else {
            console.log('error')
        }

        let testCollection = client.db('myTestDB').collection('promise_test')

        result = await testCollection.count()

        console.log('count : ' + result)


        result = await testCollection.insertOne({
            at: new Date(),
            msg: 'hello'
        })

        console.log(`inser count ${result.result.n}`)

        result = await testCollection.find().toArray()

        console.log(result)
    }
    catch (e) {
        console.log(e);
    }

    client.close()

})()

