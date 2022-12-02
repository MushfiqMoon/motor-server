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
        const userCollection = client.db('motor').collection('user')
        const productCollection = client.db('motor').collection('product')
        const orderCollection = client.db('motor').collection('order')


        // Category API
        app.get('/api/category', async (req, res) => {
            const query = {}
            const cursor = motoCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });



        // Product API
        app.post('/api/add/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.post('/api/product/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const update = { $set: { advertise: true } };
            const options = {};
            const result = await productCollection.updateOne(query, update, options);
            res.send(result);
        });

        app.post('/api/product/report/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const update = { $set: { report: true } };
            const options = {};
            const result = await productCollection.updateOne(query, update, options);
            res.send(result);
        });
        app.post('/api/product/wishlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const update = { $set: { wishlist: true } };
            const options = {};
            const result = await productCollection.updateOne(query, update, options);
            res.send(result);
        });

        app.get('/api/all/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/api/product/:catId', async (req, res) => {
            const id = req.params.catId;
            const query = ({ "category_id": id });
            const result = await productCollection.find(query).toArray()
            res.send(result);
        });

        app.get('/api/product/', async (req, res) => {

            let query = {}
            if (req.query.email) {
                query = {
                    seller_email: req.query.email
                }
            }
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/api/product/single/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        app.delete('/api/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });



        // Order API
        app.post('/api/add/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        app.get('/api/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = ({ "buyer_email": id });
            console.log(query)
            const result = await orderCollection.find(query).toArray()
            res.send(result);
        });


        // User API
        app.get('/api/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/api/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.put('/api/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }

            const option = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updateDoc, option);
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