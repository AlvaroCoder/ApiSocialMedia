require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const routesApi = require("./routes/api");
const PORT =  process.env.PORT || 8084 ;


app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use("/database",routesApi);

app.listen(PORT, (e)=>{
    if (e) {
        throw e
    }
    console.log(`Server runnig in http://localhost:${PORT}`);
});