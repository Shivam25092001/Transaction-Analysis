import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import router from './routes/trans.routes.js'
import path from 'path';
import errhandle from './middlewares/error.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, './public')));
app.use('/api', router);
app.get('/', (req, res) => {
    res.send('Hello World!');
});


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});


//Middleware for errors
app.use(errhandle);



//connect to mongodb
mongoose
  .connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
    )
  .then((data) => {
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  })
  .catch((error) => {
    console.log(`Error: ${error.message}`);
    console.log(`Shutting down server due to unhandeled promise Rejection`);

    server.close(() => {
      process.exit(1);
    });
  });
