const Products = require('../models/products');
const Cart = require('../models/cart');

module.exports.getProducts = (req,res,next) => {
 Products.findAll()
 .then(data => res.json({product: data}))
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
    const sign = req.body.sign;

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
        if(sign == 1)
        newQuantity = oldQuantity + 1;
        else
        newQuantity = oldQuantity - 1;
        
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
    console.log(cart);
    return cart.getProducts();
 })
 .then(data => res.json({cartproducts : data}))
.catch(err => console.log(err));
}


exports.deleteCart = (req,res,next) =>{

}