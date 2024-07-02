import express from "express";
import dotenv from "dotenv"

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const PORT = 4000;

app.listen(PORT, ()=>{
    console.log(`PORT RUNNING AT ${PORT}`);
})
