const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;

//middle wares
//travexUser
//tY4b6HURmjDIQexs
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER),
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ksontsm.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      const serviceCollection = client.db('traveX').collection('services');
      const reviewsCollection=client.db('traveX').collection('reviews');

      app.get('/services',async(req,res)=>{
        const query={}
        const cursor = serviceCollection.find(query);
        const services=await cursor.toArray();
        res.send(services);
      });
      app.get('/homeServices',async(req,res)=>{
        const query={}
        const cursor=serviceCollection.find(query).limit(3);
        const homeServices=await cursor.toArray();
        res.send(homeServices);
    });

    app.get('/service-details/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const cursor=serviceCollection.findOne(query);
        const serviceDetails=await cursor;
        res.send(serviceDetails);
    });
    // app.get('/reviews',async(req,res)=>{
    //  let query={};
    //  if(req.query.email){
    //     query={reviewer:req.query.email}
    //  }
    //  const cursor=reviewsCollection.find(query);
    //  const myReviews=await cursor.toArray();
    //  res.send(myReviews)
    // });
    app.get('/reviews/:id',async(req,res)=>{
        const id=req.params.id;
        const query={service:id};
        const cursor=reviewsCollection.find(query);
        const reviewDetails=await cursor.toArray();
        res.send(reviewDetails);
    });



    app.post('/reviews',async(req,res)=>{
        const review=req.body;
        const result=await reviewsCollection.insertOne(review);
        res.send(result);

    })

    }
    finally{

    }
}

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('TraveX Server running')
})
app.listen(port,()=>{
    console.log(`TravelX server running on port ${port}`)
})