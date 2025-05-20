const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())


const uri = `mongodb+srv://${process.env.ROOMMATE_USER}:${process.env.ROOMMATE_PASSWORD}@cluster0.8earouo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const roommateCollection = client.db("find_roommate").collection("roommates")

    // const showLimitRoommate = db.collection.find("find_roommate").limit(6)

    app.get("/roommates", async(req, res) => {
        const result = await roommateCollection.find({Availability: "available"}).limit(6).toArray()
        res.send(result)
    })

    app.post("/roommates", async(req, res) => {
    const newRoommate = req.body;
    console.log(newRoommate);
    const result = await roommateCollection.insertOne(newRoommate)
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


app.get("/", (req, res) => {
    res.send("Hello world")
})



app.listen( port, () => {
    console.log(`Find roommate server is running on port ${port}`);
})