
// MYSQL CONNECTION

// const mysql = require("mysql2");
// // require("dotenv").config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("MySQL connection error:", err.message);
//   } else {
//     console.log("Connected to MySQL");
//     connection.release();
//   }
// });

// module.exports = pool.promise();


const mongoose = require("mongoose");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secret_name = "MongoDB-post-it-cluster";  
const region = "eu-west-2"; 

const client = new SecretsManagerClient({ region: region });

async function getMongoDBCredentials() {
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT",
    })
  );
  return JSON.parse(response.SecretString);
}

async function connectToMongoDB() {
  try {
    const credentials = await getMongoDBCredentials(); 
    const mongoURI = credentials.MONGO_URI;  

    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);  
  }
}

module.exports = { connectToMongoDB };

