import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);       //this will make sure that all the routes in post routes will start from /posts
app.use('/users', userRoutes);

app.get('/',(req,res)=>{
    res.send('APP IS RUNNING')
})

const PORT = process.env.PORT || 5000;
// const CONNECTION_URL = 'mongodb+srv://avm121104:TjRz61J0IXujSjJK@tourguide.hnvlqvm.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)))
    .catch((error) => console.log(error.message));


// mongoose.set('useFindAndModify',false); //used to remove the warnings in the console