
 

 function cartUpdate(){
 const totalNo = document.getElementsByClassName('item-count');
  let count=0;
  let totalVal = 0;
  for(let i of totalNo){
    count += +i.value;
    price = +i.parentElement.previousElementSibling.textContent * i.value;
    i.parentElement.previousElementSibling.previousElementSibling.textContent = price;
    totalVal += price;
  }
  const cartVal = document.getElementById('cart-number');
  cartVal.textContent = count;
  
  document.getElementById('total-value').textContent = totalVal.toFixed(2);

 }
 function removeItem(event){
  const parEle = event.target.parentNode.parentNode;
  parEle.remove();
  const totalVal = document.getElementById('total-value');
  const price = event.target.parentNode.previousElementSibling.textContent;
  totalVal.textContent = +totalVal.textContent - +price;
  cartUpdate();
 }


function closeCart(){
  const sect = document.getElementById('cart');
  sect.style.display='none';
}
function showCart(){
   const sect = document.getElementById('cart');
   sect.style.display='flex';
}

//SHOW PRODUCT
function getDetails(){
  axios.get('http://localhost:3000/shop')
  .then((res) => {
    let data = res.data.product;
    for(let i of data){
      if(i.category == 'music'){
        const parEle = document.getElementById(`${i.category}-content`);
        showProduct(i,parEle);
      }else if(i.category == 'merch'){
        const parEle = document.getElementById(`${i.category}-content`);
        showProduct(i,parEle);
    }
  }
  })
  .catch(err => console.log(err));
}
function showProduct(prod,parEle){
  const div = document.createElement('div');
  div.id = prod.id;
  div.className = prod.name;
  div.innerHTML=`<h3>${prod.name}</h3>`;
  const divImg = document.createElement('div');
  divImg.className='image-container';
  divImg.innerHTML = `<img class="prod-images"  src=${prod.img}>`;
  div.appendChild(divImg);

  const prodDetail = document.createElement('div');
  prodDetail.className='product-details';
  prodDetail.innerHTML=`<span>$<span>${prod.price}</span></span><button class="add-to-cart">ADD TO CART</button>`;
  div.appendChild(prodDetail);
 
  parEle.appendChild(div);
}

//CART
function getCart(){
  axios.get('http://localhost:3000/cart')
  .then((res) =>{
    for(let prod of res.data.cartproducts)
    {
      const id = prod.cartitem.productId;
      const quantity = prod.cartitem.quantity;
      const name = prod.name;
      const img = prod.img;
      const price = prod.price;
      addCartDetail(id,quantity,name,img,price);
    }
  })
  .catch(err => console.log(err));
}
function addToCart(event){
  if(event.target.className == "add-to-cart"){
   const id = event.target.parentNode.parentNode.id;
   const name = event.target.parentNode.parentNode.className;
   const img = event.target.parentNode.previousElementSibling.firstChild.src;
   const price = event.target.previousElementSibling.lastChild.textContent;
   const obj={id};
   axios.post('http://localhost:3000/cart',obj)
   .then(res => {
   const quantity = res.data.newCartProduct;
   if(quantity>1){
     document.getElementById(`item-${name}-count`).value = quantity;
   }else{
    showNotification(name);
    addCartDetail(id,quantity,name,img,price)
   .catch(err=> console.log(err));
  }
  } )
 }
}
function addCartDetail(id,quantity,name,img,price){
  const cartItem = document.getElementById('cart-items');

  const div = document.createElement('div');
  div.className = 'cart-row';
  div.id = `in-cart-${id}`;
  div.innerHTML =
    `<span class="cart-item cart-column">
    <img class="cart-img" src='${img}'>
    <span>${name}</span>
    </span>
    <span class="cart-price cart-column-hidden" hidden>
    ${price}</span>
    <span class="cart-price cart-column">${price}</span>
    <span class="cart-quantity cart-column">
    <button onclick="removeItem(event)">REMOVE</button>
    <input id="item-${name}-count" onchange="cartUpdate()" type="number" value='${quantity}'>
    </span>
    </div>`;
  cartItem.appendChild(div);
  cartUpdate();
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

//ADD PRODUCT
function prodDetail(event){
  const name= document.getElementById('name').value;
  const img = document.getElementById('image').value;
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value;
  const obj = {name,img,price,category};
  axios.post('http://localhost:3000/add-product',obj)
  .then(res => console.log(res))
  .catch(err => console.log(err));
}