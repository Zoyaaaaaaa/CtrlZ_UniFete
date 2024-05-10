const mongoose=require("mongoose");
// const initData=require("./data.js");
const initData2=require("./eventdata.js");
const Committee=require("../models/commitees.js");
const MONGO_URL="mongodb://127.0.0.1:27017/unifete";
const Event=require("../models/events.js");
main()
.then(()=>{
console.log("MongoDb is successfully connected");
})
.catch((err)=>{
console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
     await Event.insertMany(initData2.data);
     console.log("Data was initialized in Event");
    // await Committee.deleteMany({});
    // console.log("deleted !")
//   await Committee.insertMany(initData.data);
//   console.log("Data was initialized in Committee");
};

initDB();