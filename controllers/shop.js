const Product = require('../models/products');
const Order = require('../models/order');
const path = require('path');

module.exports.getProducts = (req,res,next) => {
  // let category = req.params.category;
  // const page = req.query.page;
  // let limit = 2;
  Product.find()
 .then(data => {
  res.status(200).json({product: data})
 })
 .catch(err => console.log(err));
}

exports.getShopPage = (req,res,next) =>{  
  res.sendFile(path.join(__dirname,`../views/shop.html`)); 
}

exports.getOrderPage = (req,res,next) =>{  
  res.sendFile(path.join(__dirname,`../views/order.html`)); 
}

exports.getaboutusPage = (req,res,next) =>{  
  res.sendFile(path.join(__dirname,`../views/aboutus.html`)); 
}

exports.getAddProductPage = (req,res,next) =>{  
  res.sendFile(path.join(__dirname,`../views/addproduct.html`)); 
}



module.exports.addProducts = (req,res,next) =>{
    const name = req.body.name;
    const imageUrl = req.body.img;
    const price = req.body.price;
    const category = req.body.category;

    const product = new Product({title: name,imageUrl : imageUrl,price: price,category: category, userId: req.user._id});

    product.save()
    .then(data => res.status(201).json({newproduct : data}))
    .catch(err => console.log(err));
}

exports.addCart = (req,res,next) =>{
    const prodId = req.body.id;
    Product.findById(prodId)
    .then(product =>{
      return req.user.addToCart(product)
    })
    .then((data) => {
      res.status(200).json({productAdded:'true'})
    })
    .catch(err => console.log(err));
}

exports.getCart = (req,res,next) =>{
req.user
 .populate('cart.productId')
 .then(data => {
  res.json({cartproducts : data.cart})
 })
.catch(err => console.log(err));
}


exports.deleteCartItem = (req,res,next) =>{
   const id = req.params.id;
   req.user
   .deleteItem(id)
   .then(()=>{
    res.json({deletedproduct: id});
   })
   .catch(err => console.log(err));

}
const Razorpay = require('razorpay');

exports.addOrder = async (req,res,next) =>{
  const amount = req.body.price;
  let razorId;
  try{
  var instances = new Razorpay({
        key_id : process.env.RAZORPAY_ID,
        key_secret : process.env.RAZORPAY_SECRET
    })
  const data = await instances.orders.create({amount})
      razorId = data.id;
        const prod = await req.user.populate('cart.productId');
  const products = prod.cart.map(i => {
    return {quantity: i.quantity,items: {...i.productId._doc}}});
  const order = new Order({
    user: { name: req.user.name,userId : req.user._id },
    products: products,
    paymentid: razorId
  })  
  const op = await order.save();
    await req.user.clearCart();
    res.json({orderid: op._id,key: instances.key_id,status: 'success',amount:amount})
}catch(err){
  res.status(403).json({ message: 'Something went wrong', error: err})
  };
}

exports.getOrder = (req,res,next) =>{
  Order.find({
    'user.userId' :  req.user._id
  })
  .then(order =>{
      res.json({orderdetails:order});
  })
  .catch(err => console.log(err));
}
