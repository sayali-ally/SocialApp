const {MongoClient}=require('mongo');
const url='mongo://localhost:27017';
const database='e-comm';
const client=new MongoClient(url);

async function getData(){
    let result=await client.connect();
    let db=result.db(database);
    let collection=db.collection('products');
    let response=await collectionfind({}).toArray();
    console.log(response);
}
getData();
