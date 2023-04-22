const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();


const bodyParser = require('body-parser');
app.use(bodyParser.json());

const path = require('path');

var cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname,'public')));



const signupRouter = require('./routes/signup.js')
app.use('/signup',signupRouter);

const loginRouter = require('./routes/login.js');
app.use('/login',loginRouter);

const addproductRouter = require('./routes/addproduct.js')
app.use('/add-product',addproductRouter)

const shopRouter = require('./routes/shop.js');
app.use('/shop',shopRouter);

const aboutusRouter = require('./routes/aboutus.js');
app.use('/aboutus',aboutusRouter);

const cartRouter = require('./routes/cart');
app.use('/cart',cartRouter);

const purchaseRouter = require('./routes/purchase')
app.use('/order',purchaseRouter);

const forgotpasswordRouter = require('./routes/forgotpassword.js');
app.use('/forgotpassword',forgotpasswordRouter);




const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Deep:Asdf%40123@cluster0.foriuln.mongodb.net/ecommerce?retryWrites=true&w=majority')
.then(() => app.listen(3000))
.catch(err => console.log(err));

