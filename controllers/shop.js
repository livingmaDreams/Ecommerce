const Products = require('../models/products');
const Cart = require('../models/cart');
const sequelize = require('../util/database');
const { or } = require('sequelize');


exports.getDetails = (req,res,next) =>{
  let musiccount,merchcount;
Products.count({where:{category:'music'}})
  .then(musiccount =>{
    musiccount = musiccount;
    return Products.count({where:{category:'merch'}})
  .then(merchcount => res.json({musiccount:musiccount,merchcount:merchcount}))
  .catch(err => console.log(err));
  })

 

}
module.exports.getProducts = (req,res,next) => {
  let category = req.params.category;
  const page = req.query.page;
  let limit = 2;
  Products.findAll({
    where:{
      category: category
    },
  offset:((page-1)*limit),
  limit : limit,
 })
 .then(data => res.json({product: data,category:category}))
 .catch(err => console.log(err));
}

module.exports.addProducts = (req,res,next) =>{
    const name = req.body.name;
    const imageSrc = req.body.img;
    const price = req.body.price;
    const category = req.body.category;
    Products.create({
        img: imageSrc,
        price: price,
        name: name,
        category: category,
    })
    .then(data => res.status(201).json({newproduct : data}))
    .catch(err => console.log(err));
}

exports.addCart = (req,res,next) =>{
    const id = req.body.id;
    const count = req.body.count;

    let fetchedCart;
  let newQuantity = 1;
  let oldQuantity ;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: id } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {    
        oldQuantity = product.cartitem.quantity;
        newQuantity = oldQuantity + count;
        return product;
      }
      return Products.findByPk(id);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then((data) => {
      res.json({newquantity: newQuantity,oldquantity : oldQuantity})
    })
    .catch(err => console.log(err));
}

exports.getCart = (req,res,next) =>{
req.user
 .getCart()
 .then(cart =>{
    return cart.getProducts();
 })
 .then(data => res.json({cartproducts : data}))
.catch(err => console.log(err));
}


exports.deleteCart = (req,res,next) =>{
   const id = req.params.id;
   req.user
   .getCart()
   .then(cart => {
    return cart.getProducts({where:{id:id}})
   })
   .then(products =>{
    let product = products[0];
    return product.cartitem.destroy();
   })
   .then(()=>{
    res.json({deletedproduct: id});
   })
   .catch(err => console.log(err));
   

}

exports.addOrder = (req,res,next) =>{
 let orderId;
  req.user
  .getCart()
   .then(cart => {
    return cart.getProducts();
   })
   .then(products =>{
    return req.user.createOrder()
    .then(order =>{
        orderId = order.id;
      order.addProducts(
        products.map(product =>{
        product.orderitem = {quantity: product.cartitem.quantity};
        return product;
      })
      )
    })
   })
  .then(data => res.json({orderid: orderId ,status: 'success'}))
  .catch(err => console.log(err));
}
