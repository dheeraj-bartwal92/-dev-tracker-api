const app = require("./src/app");
const connectDb = require("./src/db/db")

connectDb()
app.listen(process.env.PORT,() => {
    console.log(`Ok bhaijan Dev-Tracker is runnung on port ${process.env.PORT}`);
    
})