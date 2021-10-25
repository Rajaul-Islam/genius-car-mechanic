const express = require('express');
const ObjectId=require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const cors = require('cors')

require('dotenv').config()
const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhm74.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');
        // get api 

        app.get('/services',async(req,res)=>{
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        //  post api 
        app.post('/services', async (req, res) => {
            const service =req.body;
            console.log('hit the post api',service);
            // res.send('post hited')
            const result=await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //get single service
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id;
            console.log('getting specific item',id);
            const query ={_id: ObjectId(id)};
            const service=await servicesCollection.findOne(query);
            res.json(service);
        })
        //delete api
        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('this is car mechanic hmm kaj kore')
    console.log('this is server', port)
})



app.listen(port, () => {
    console.log('running genius server on port ki kaj hoise mia ', port)
})