import Sequelize from "sequelize"
import dotenv from dotenv

// dotenv.config()


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    host : process.env.DB_HOST,
    dialect : "mysql",
}) 

sequelize.authenticated().then(()=> console.log("Database connected")).catch((err)=>{
    console.log(err);
})

export default sequelize