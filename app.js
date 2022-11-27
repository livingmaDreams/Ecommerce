const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const path = require('path');

var cors = require('cors');
app.use(cors());

app.use((req,res,next)=>{
    User.findByPk(1)
    .then((user)=> {
        req.user = user;
        next();
    })
    .catch(err => console.log(err)); 
})

const addproductRouter = require('./routes/addproduct.js')
app.use('/add-product',addproductRouter)

const shopRouter = require('./routes/shop.js');
app.use('/shop',shopRouter);

const cartRouter = require('./routes/cart');
app.use('/cart',cartRouter);

const purchaseRouter = require('./routes/purchase')
app.use('/purchase',purchaseRouter);


const Product = require('./models/products');
const User = require('./models/users');
const Cart = require('./models/cart');
const CartItem = require('./models/cartitem');
const Order = require('./models/order');
const OrderItem = require('./models/orderitem')

User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart ,{through: CartItem});
Cart.belongsToMany(Product,{through:CartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through: OrderItem});
Product.belongsToMany(Order,{through: OrderItem});

const sequelize = require('./util/database')
sequelize
.sync()
.then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Dream', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    user.getCart()
    .then(res => {
        if(res == null)
         user.createCart().then(user => {
            return user;
         })
    })
  })
.then((user)=> {
    app.listen(3000)})
.catch(err => console.log(err));
