const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())


// DB Connection 
const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri);


async function dbConnect() {
    try {
        await client.connect();
        // console.log("Database connected");
    } catch (error) {
        console.log(error.name);
    }
}
dbConnect();


// endpoints
app.get('/', (req, res) => {
    res.send('welcome to Motor')
})

async function run() {
    try {

        // Collections 
        const motoCollection = client.db('motor').collection('category')


        // services API
        app.get('/api/category', async (req, res) => {
            const query = {}
            const cursor = motoCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

    }

    finally {
    }
}
run().catch(error => console.error(error));


// status check
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})