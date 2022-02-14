const express = require("express");
const app = express();
const cors = require("cors");
const PORT =  process.env.PORT || 8084 ;
const routesApi = require("./routes/api");

//Middlewares
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Api routes
app.get("/",(req,res)=>{
    res.status(200).sendFile(__dirname+"/Paginas/Home.html",(e)=>{
        if (e) {
            throw e
        }
    })
});

//Styles Pages
app.get("/Maqueta.css",(req,res)=>{
    res.sendFile(__dirname+"/CSS/Maqueta.css")
});

app.use("/database",routesApi);

app.listen(PORT, (e)=>{
    if (e) {
        throw e
    }
    console.log(`Server runnig in http://localhost:${PORT}`);
});