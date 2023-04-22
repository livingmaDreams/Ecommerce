
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    },
    cart: {
        type: [{productId:{type: schema.Types.ObjectId,ref: 'Product',required:true},
            quantity:{type:Number,required:true}}]
    }
});

userSchema.methods.addToCart = function(product) {
    let cartProductIndex;
       
            if(this.cart != ''){
                
             cartProductIndex = this.cart.findIndex(cp => {
                return cp.productId.toString() === product._id.toString();
            })
             }
            let newQuantity = 1;
            let updatedItems = [...this.cart];
            if(cartProductIndex>=0){
               newQuantity = this.cart[cartProductIndex].quantity + 1;
               updatedItems[cartProductIndex].quantity = newQuantity;
            }else{
                updatedItems.push({
                    productId : product._id,
                    quantity: newQuantity
                })
            }
            this.cart = updatedItems;
            return this.save();
         }

userSchema.methods.deleteItem = function (id){
                    const updatedCart = this.cart.filter (i => i.productId.toString() != id.toString());
                    this.cart = updatedCart;
                    return this.save();
}

userSchema.methods.clearCart = function (){
    this.cart = [];
    return this.save();
}
    


module.exports = mongoose.model('User',userSchema);
