const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-onjpk5k-shard-00-00.xskcn3u.mongodb.net:27017,ac-onjpk5k-shard-00-01.xskcn3u.mongodb.net:27017,ac-onjpk5k-shard-00-02.xskcn3u.mongodb.net:27017/?ssl=true&replicaSet=atlas-g07jbs-shard-0&authSource=admin&retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const usersCollection = client.db("usersDb").collection('users')

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.post('/allUsers', async(req,res)=> {
        const users = req.body 
        const result = await usersCollection.insertOne(users)
        res.send(result)

    })

    app.get('/users', async(req,res)=> {
        const result = await usersCollection.find().toArray()
        res.send(result)

    })

    app.delete('/users/:id', async(req,res)=> {

        const id = req.params.id 
        const query = { _id : new ObjectId(id)}
        const result = await usersCollection.deleteOne(query)
        res.send(result)

    })

    app.get('/users/:id', async(req,res)=> {

        const id = req.query.id
        console.log(id)
        const query = {_id : new ObjectId(id)}
        const result = usersCollection.findOne(query)
        res.send(result)
    })
    





    app.put('/users/:id', async(req,res)=> {

       
        const id = req.params.id
        const filter = { _id : new ObjectId(id)}
        const options = { upsert : true}
        const users = req.body 
        const updateUser = {

            $set : {
                name : users.name ,
               email : users.email,
               number : users.number ,
               id : users.id

            }
        }

        const result = await usersCollection.updateOne(filter,updateUser,options)
        res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);










app.get('/', (req,res)=> {
    res.send('User management  server is running')
})

app.listen(port, ()=>{
     console.log(`user management server is running on port : ${port} `)
})