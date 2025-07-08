import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './modules/index.module'; 

const app = express();
const PORT = 5050;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use("/uploads", express.static("uploads"));
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}...`);
});
