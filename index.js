const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


    // I will show a total of 6 posts in the header section.
    app.get("/filterRoommates", async (req, res) => {
      const result = await roommateCollection.find({ availability: "available" }).limit(6).toArray()
      res.send(result)
    })


    //  Show all posts on the Browse Listing page.
    app.get("/allRoommates", async (req, res) => {
      const result = await roommateCollection.find().toArray()
      res.send(result)
    })


    // Extract a specific post from all posts
    app.get("/allRoommates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await roommateCollection.findOne(query)
      res.send(result)
    })


    // 
    app.get("/roommates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await roommateCollection.findOne(query)
      res.send(result)
    })

    // Get all posts for a specific user by email
    app.get("/my-listings/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { userEmail: email };
        const result = await roommateCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching listings for user:", error);
        res.status(500).send({ message: "Failed to fetch user listings" });
      }
    });

    app.post("/roommates", async (req, res) => {
      const newRoommate = req.body;
      const result = await roommateCollection.insertOne(newRoommate)
      res.send(result)
    })


    app.put("/allRoommates/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatePost = req.body;
      const updateDoc = {
        $set: updatePost
      }
      const result = await roommateCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })


    app.patch("/roommates/:id/like", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $inc: { likeCount: 1 }
      };
      const result = await roommateCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/roommates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roommateCollection.deleteOne(query);
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



app.listen(port, () => {
  console.log(`Find roommate server is running on port ${port}`);
})