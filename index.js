const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.get('/foods', async(req, res)=>{
            const query = {}
            const cursor = foodCollection.find(query);
            const foods = await cursor.toArray();
            res.send(foods);
        })
    } 
    finally {
        
    }
}

run().catch(e => console.error(e));


app.get('/', (req,res) =>{
    res.send('food corner server is running')
})

// pass : KbK95YnmzGaqCdDD
// user: Asif

app.listen(port, ()=>{
    console.log(`food corner server running on ${port}`);
})