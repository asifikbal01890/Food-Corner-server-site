const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh3xqbm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const foodCollection = client.db('foodCorner').collection('foods');
        const reviewCollection = client.db('foodCorner').collection('reviewer');

        app.get('/foods', async(req, res)=>{
            const query = {}
            const cursor = foodCollection.find(query).sort( { "price": 1 } );
            const foods = await cursor.toArray();
            res.send(foods);
        })

        app.get('/foodsLimit', async(req, res)=>{
            const query = {}
            const cursor = foodCollection.find(query);
            const foodsLimit = await cursor.limit(3).toArray();
            res.send(foodsLimit);
        })

        app.get('/foods/:id', async(req, res)=>{
            id = req.params.id;
            const query = { _id : ObjectId(id)}
            const food = await foodCollection.findOne(query);
            res.send(food);
        })
        app.post('/foods', async(req,res)=>{
            const foods = req.body;
            const result = await foodCollection.insertOne(foods);
            res.send(result);
        })

        // review api

        app.get('/reviewer', async(req, res)=>{
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query).sort( { "userrating": 1 } );
            const review = await cursor.toArray();
            res.send(review);
        })

        app.post('/reviewer', async(req,res)=>{
            const reviewer = req.body;
            const result = await reviewCollection.insertOne(reviewer);
            res.send(result);
        })

        app.delete('/reviewer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    } 
    finally {
        
    }
}

run().catch(e => console.error(e));


app.get('/', (req,res) =>{
    res.send('food corner server is running')
})


app.listen(port, ()=>{
    console.log(`food corner server running on ${port}`);
})