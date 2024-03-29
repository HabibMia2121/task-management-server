const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient,ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors({
    origin: [
        // 'http://localhost:5173'
        'https://taskmanagement-9bc84.web.app',
        'https://taskmanagement-9bc84.firebaseapp.com'
    ]
}));
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.soublt0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        //collection here
        const userCollection = client.db('taskManagementDB').collection('users');
        const addTaskCollection = client.db('taskManagementDB').collection('addTasks');

        // ------user collection here-------
        app.get('/total-user', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.post('/user', async (req, res) => {
            const user = req?.body;
            const query = {
                email: user.email
            };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({
                    message: 'user already exists',
                    insertedId: null
                })
            }
            const result = await userCollection.insertOne(user);
            res.send(result)
        })
        app.patch('/user', async (req, res) => {
            const user = req.body;
            const filter = {
                email: user.email
            };
            const updateData = {
                $set: {
                    lastLoginAt: user.lastLoginAt,
                }
            }
            const result = await userCollection.updateOne(filter, updateData);
            res.send(result);

        })
        // ------------addTask Collection here--------------
        app.get('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:new ObjectId(id)}
            const result = await addTaskCollection.findOne(query);
            res.send(result);
        })
        
        app.get('/previous-task/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                email:email
            }
            const result = await addTaskCollection.find(query, {
                sort: {
                    _id: -1
                }
            }).toArray();
            res.send(result);
        })
        
        app.post('/add-task', async (req, res) => {
            const task = req?.body;
            const result = await addTaskCollection.insertOne(task);
            res.send(result);
        })

        app.patch('/todo-update/:id', async (req, res) => {
            const id = req.params.id;
            const todo = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: todo?.title,
                    descriptions: todo?.descriptions,
                    priority: todo?.priority,
                    priority: todo?.priority
                },
            };
            const result = await addTaskCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        app.delete('/task-delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addTaskCollection.deleteOne(query);
            res.send(result);
        })

        



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task management server')
})
app.listen(port, () => {
    console.log(`task management on port ${port}`)
})