let cartCount = 0;

//ADD PRODUCT
function prodDetail(event){
  event.preventDefault();
  const name= document.getElementById('name').value;
  const img = document.getElementById('image').value;
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value;
  const token = localStorage.getItem('ecommerce');
  const obj = {name,img,price,category};
  axios.post('http://3.105.195.179:3000/add-product',obj,{ headers:{"Authorization":token}})
  .then(res => {
    document.getElementById('name').value = '';
     document.getElementById('image').value = '';
    document.getElementById('price').value = '';
    document.getElementById('category').value = '';
  })
  .catch(err => console.log(err));
}

function getDetails(){
  axios.get('http://3.105.195.179:3000/shop')
  .then((res)=>{
    let musiccount = res.data.musiccount;
    let merchcount = res.data.merchcount;
    let limit = 2;
    let musictotalpages = Math.ceil(musiccount/limit);
    let merchtotalpages = Math.ceil(merchcount/limit);
    const pageMusic = document.getElementById('pagination-music')
    for(let i=1;i<=musictotalpages;i++)
    {
      const button = document.createElement('button');
      button.className = 'music-pages';
      button.textContent= i;
      button.setAttribute('onclick',"getProducts('music',event.target.textContent)")
      pageMusic.appendChild(button);
    }
    getProducts('music',1);
    const pageMerch = document.getElementById('pagination-merch')
    for(let i=1;i<=merchtotalpages;i++)
    {
      const button = document.createElement('button');
      button.className = 'merch-pages';
      button.textContent = i;
      button.setAttribute('onclick',"getProducts('merch',event.target.textContent)")
      pageMerch.appendChild(button);
    }
    getProducts('merch',1);
   
  })
}


function getProducts(){
  let parEle='';
  const list = document.getElementById(`store-content`).childNodes ;
  for(let i = list.length -1;i>=0;i--){
    list[i].remove();
  }
  const token = localStorage.getItem('ecommerce');
  axios.get(`http://3.105.195.179:3000/shop/products`,{ headers:{"Authorization":token}})
  .then((res) => {
    let data = res.data.product;
    
    for(let i of data)
      showProduct(i);
  })
  .catch(err => console.log(err));
}
function showProduct(prod){
  const parEle = document.getElementById(`store-content`);
  const div = document.createElement('div');
  div.id = prod._id;
  div.className = prod.title;
  div.innerHTML=`<h3>${prod.title}</h3>`;
  const divImg = document.createElement('div');
  divImg.className='image-container';
  divImg.innerHTML = `<img class="prod-images"  src=${prod.imageUrl}>`;
  div.appendChild(divImg);

  const prodDetail = document.createElement('div');
  prodDetail.className='product-details';
  prodDetail.innerHTML=`<span>$<span>${prod.price}</span></span><button class="add-to-cart">ADD TO CART</button>`;
  div.appendChild(prodDetail);
 
  parEle.appendChild(div);
}

//CART
function getCart(){
  const token = localStorage.getItem('ecommerce');
  axios.get('http://3.105.195.179:3000/cart',{ headers:{"Authorization":token}})
  .then((res) =>{
    for(let prod of res.data.cartproducts)
    {
      const id = prod.productId._id;
      const quantity = prod.quantity;
      const name = prod.productId.title;
      const img = prod.productId.imageUrl;
      const price = prod.productId.price;
      cartCount += quantity;
      addCartDetail(id,quantity,name,img,price);
    }
    cartUpdate(cartCount);
  })
  .catch(err => console.log(err));
}
function addToCart(event){
  let obj={};
  let id;
  let nameProd;
  let img;
  let price;
  let count = 1;
  if(event.target.className == "add-to-cart"){
    id = event.target.parentNode.parentNode.id;
    nameProd = event.target.parentNode.parentNode.className;
   img = event.target.parentNode.previousElementSibling.firstChild.src;
   price = event.target.previousElementSibling.lastChild.textContent;
   obj={id,count};
   showNotification(nameProd);
  }
  else{
    id = event.target.dataset.prodid;
    const prevVal = event.target.dataset.prevval;
    val = event.target.value;
    img = event.target.parentNode.parentNode.firstChild.firstElementChild.src;
    nameProd = event.target.parentNode.parentNode.firstChild.lastElementChild.textContent;
    count = val - prevVal;
    obj={id,count};
  }
  const token = localStorage.getItem('ecommerce');
   axios.post('http://3.105.195.179:3000/cart',obj,{ headers:{"Authorization":token}})
   .then(res => {
    cartCount = 0;
    document.getElementById('cart-items').innerHTML='';
    getCart();
  })
  .catch(err=> console.log(err));
 }
 
function addCartDetail(id,quantity,name,img,price){
  const cartItem = document.getElementById('cart-items');
  const div = document.createElement('div');
  div.className = 'cart-row';
  div.setAttribute('data-prodid',id);
  div.id = `in-cart-${id}`;
  div.innerHTML =  `<span class="cart-item cart-column">
    <img class="cart-img" src='${img}'>
    <span>${name}</span>
    </span>
    <span class="cart-price cart-column" data-price=${price}>${price}</span>
    <span class="cart-quantity cart-column">
    <input id="item-${name}-count" onchange="addToCart(event)" type="number"  step='1' min='1' data-prevval=${quantity} data-prodid='${id}' value='${quantity}'>
    <button  onclick="removeItem(event)">REMOVE</button>
    </span>
    </div>`;
  cartItem.appendChild(div);
}

function showNotification(name){
    const notif = document.createElement('div');
    notif.innerHTML=`<h4>${name} is added to Cart</h4>`;
    notif.id = 'notification';
    const notifcontainer = document.getElementById('item-added');
    notifcontainer.appendChild(notif);
    setTimeout(()=>{
     notif.remove();
    },2000);
}
function cartUpdate(cartCount){
  let totalprice = 0;
  const cartVal = document.getElementById('cart-number');
  cartVal.textContent = cartCount;
  const priceList = document.getElementsByClassName('cart-price cart-column');
  for(let i=1;i<priceList.length;i++){
    let itemprice = priceList[i].textContent;
    totalprice += +itemprice;
  }
   document.getElementById('total-value').textContent = totalprice;
 }

 function removeItem(event){
  const parEle = event.target.parentNode.parentNode;
  const id = event.target.previousElementSibling.dataset.prodid;
  const itemCount = event.target.previousElementSibling.value;
  const token = localStorage.getItem('ecommerce');
   axios.delete(`http://3.105.195.179:3000/cart/delete/${id}`,{ headers:{"Authorization":token}})
   .then(()=>{
    parEle.remove();
    cartCount = cartCount - itemCount;
    cartUpdate(cartCount);
   })
   .catch(err => console.log(err));
 }

 function purchase(){
  const token = localStorage.getItem('ecommerce');
  const price = document.getElementById('total-value').innerText;
  const obj = {price};

  axios.post('http://3.105.195.179:3000/order/payment',obj,{ headers:{"Authorization":token}})
  .then((res) => {
         var options = {
    "key": res.data.key,
    "orderid": res.data.orderid,
    "amount": res.data.amount*100,
   "name": "Ecommerce",
   "description": "To purchase book",
   "image": "img/logo.png",
   "handler": function (response) {
     const paymentid = response.razorpay_payment_id;
     const orderid = res.data.orderid;
      const div = document.getElementById('purchase-content');
      div.innerHTML=`<h6>Order has been successfully placed.</h6>
      <h6>Your order id is ${orderid}</h6>
      <button id="purchase-button" onclick="document.getElementById('purchase').style.display='none'">OK</button>`;
      document.getElementById('purchase').style.display='block';
      const list = document.getElementById('cart-items').childNodes;
      for(let i = list.length-1;i>=0;i--)
      list[i].remove();
      document.getElementById('total-value').textContent = 0;
      document.getElementById('cart-number').textContent = 0;
   },
   "prefill": {
       "name": "ABC", // pass customer name
       "email": 'A@A.COM',// customer email
       "contact": '+919123456780' //customer phone no.
   },
   "notes": {
       "address": "address" //customer address 
   },
   "theme": {
       "color": "#15b8f3" // screen color
   }
};
const propay= new Razorpay(options);
   propay.open();
})
.catch(err => console.log(err))
}


function getOrderDetails(){
  const token = localStorage.getItem('ecommerce');
  axios.get('http://3.105.195.179:3000/order/order-details',{ headers:{"Authorization":token}})
  .then(res => {
    const data = res.data.orderdetails;
    for(let order of data){
      const id = order._id;
      const child = document.createElement('ul');
      for(let prod of order.products){
        const img = prod.items.imageUrl;
        const price = prod.items.price;
        const quantity = prod.quantity;
        const name = prod.items.title;
        const div = document.createElement('li');
          div.innerHTML=`<span class='order-header'>
          <span>PRODUCT</span><span>QUANTITY</span><span>PRICE</span></span>
          <span class="order-prod-detail">
                        <img class="order-img" src=${img}>
                        <span class='order-name'>${name}</span>
                        <span class="order-quantity">${quantity}</span>
                        <span class="order-price">${price}</span>
                        </span>`;
          child.appendChild(div);
      }
      const parDiv = document.createElement('div');
      parDiv.innerHTML = `<h3>ORDER ID. - ${id}</h3>`;
      parDiv.className = 'order-list';
      parDiv.appendChild(child);
      const parEle = document.getElementById('order-content');
      parEle.appendChild(parDiv);
    }
  })
  .catch(err => console.log(err));
}

function logOut(){
  localStorage.setItem('ecommerce','');
  window.location.href="http://3.105.195.179:3000/login";
}