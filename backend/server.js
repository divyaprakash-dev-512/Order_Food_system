require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
const MongoDb = require('./config/db');

const RoutesApi = require('./Routes/AuthRoute');
const foodRoutes = require("./Routes/FoodRoutes");
const orderRoutes = require("./Routes/OrderRoutes");
const paymentRoute = require('./Routes/paymentRoute');
const favoriteRoutes = require('./Routes/Favorite')

app.use(express.json())
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use('/api',RoutesApi)
app.use("/api", foodRoutes);
app.use("/api", orderRoutes);
app.use('/api/pay',paymentRoute);
app.use('/api/',favoriteRoutes);

MongoDb();


const port = process.env.PORT || 5533;
app.listen(port,()=> {
    console.log("Server is working well")
});
