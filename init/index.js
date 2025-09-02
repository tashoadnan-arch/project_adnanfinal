const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main().then((res)=>{
    console.log("connected to db");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);

}

const initDB=async ()=>{
    await Listing.deleteMany({});
    const newData = initData.data.map((obj)=>({...obj,owner: ("68ac70f1a9b26e14269d32d6")}));
    await Listing.insertMany(newData);//initData.data

    console.log("data was initialized");
};

initDB();