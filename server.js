const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantItemRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
connectDB();

const app = express();


app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, 
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 24 * 60 * 60 * 1000, 
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/restaurant-items", restaurantRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
