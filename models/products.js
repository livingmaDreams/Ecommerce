// const Sequelize = require('sequelize');


// const sequelize = require('../util/database');

// const Products = sequelize.define('product',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     img: Sequelize.TEXT('long'),
//     price: Sequelize.FLOAT,
//     name: Sequelize.STRING,
//     category: Sequelize.STRING
// });

// module.exports = Products;


// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');
// class Product{
//     constructor(title,imageUrl,price,category,userId){
//         this.title=title;
//         this.price=price;
//         this.category=category;
//         this.imageUrl = imageUrl;
//         this.userId = userId;
//     }

//     save(){
//        const db = getDb();
//        return db.collection('product').insertOne(this)
//        .then(res => console.log(res))
//        .catch(err => console.log(err))  

//     }

//     static fetchAll(){
//         const db = getDb();
//         return db.collection('product').find().toArray()
//         .then(res => {
//             return res
//         })
//        .catch(err => console.log(err)) 

//     }
    
//     static findById(id){
//         const db = getDb();
//         return db.collection('product').findOne({_id: new mongodb.ObjectId(id)})
//         .then(res => {
//             return res
//         })
//         .catch(err => console.log(err))   
//     }
   
// }

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl : {
        type: String,
        required: true 
    },
    category: {
        type: String,
        required: true
    },
    userId :{
        type: schema.Types.ObjectId,
       ref: 'User',
        required: true
    }
});



module.exports = mongoose.model('Product',productSchema);