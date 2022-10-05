require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const routesApi = require("./routes/api");
const path = require('path');
const PORT =  process.env.PORT || 8084 ;
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get("/",(req, res)=>{
    const html_file = path.join(__dirname, '/pages/index.html')
    res.sendFile(html_file);
    
});
app.get("*",(req, res)=>{
    res.sendFile(path.join(__dirname, '/pages/lost.html'))
})
app.use("/database",routesApi);

app.listen(PORT, (e)=>{
    if (e) {
        throw e
    }
    console.log(`Server runnig in http://localhost:${PORT}`);
});