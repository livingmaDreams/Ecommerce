let cartCount = 0;


function getDetails(){
  axios.get('http://localhost:3000/shop')
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
//SHOW PRODUCT
function getProducts(category,page){
  let parEle='';
  const list = document.getElementById(`${category}-content`).childNodes ;
  for(let i = list.length -1;i>=0;i--){
    list[i].remove();
  }
 
  axios.get(`http://localhost:3000/shop/${category}?page=${page}`)
  .then((res) => {
    let data = res.data.product;
    let category = res.data.category;
    if(category == 'music')
     parEle = document.getElementById(`${category}-content`); 
  else
     parEle = document.getElementById(`${category}-content`);

    for(let i of data)
      showProduct(i,parEle);
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
  let count =1;
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
   axios.post('http://localhost:3000/cart',obj)
   .then(res => {
   const newquantity = res.data.newquantity;
   let oldquantity = (res.data.oldquantity)?res.data.oldquantity:0;
   if(!oldquantity)
    addCartDetail(id,newquantity,nameProd,img,price);
    
    const diff = newquantity - oldquantity;
   cartCount += diff;
   document.getElementById(`item-${nameProd}-count`).value = newquantity;
   document.getElementById(`item-${nameProd}-count`).dataset.prevval = newquantity;
   price = document.getElementById(`in-cart-${id}`).childNodes[2].dataset.price;
   document.getElementById(`in-cart-${id}`).childNodes[2].textContent = (price*newquantity).toFixed(2);
   cartUpdate(cartCount);
  })
  .catch(err=> console.log(err));
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
   axios.delete(`http://localhost:3000/cart/delete/${id}`)
   .then(()=>{
    parEle.remove();
    cartCount = cartCount - itemCount;
    cartUpdate(cartCount);
   })
   .catch(err => console.log(err));
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