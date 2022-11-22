function closeCart(){
   const sect = document.getElementById('cart');
   sect.style.display='none';
}
function showCart(){
    const sect = document.getElementById('cart');
    sect.style.display='flex';
 }
 function addToCart(event){
   const albumId = event.target.parentNode.parentNode.id;
   const prodDetail = event.target.parentNode;
   const price = prodDetail.firstElementChild.firstElementChild.textContent;
   const imgDetail = prodDetail.previousElementSibling;
   const img = imgDetail.firstElementChild.src;
   const name = imgDetail.previousElementSibling.textContent;
   addCartDetail(albumId,name,img,price);
 }

 function addCartDetail(id,name,img,price,totalprice){
   const cartList = document.getElementById(`in-cart-${id}`);
   if(cartList)
   alert('This Item is already added to Cart');
   else{
   const cartItem = document.getElementById('cart-items');

   const div = document.createElement('div');
   div.className='cart-row';
   div.id = `in-cart-${id}`;

   const imgSpan = document.createElement('span');
   imgSpan.className='cart-item cart-column';

   const image = document.createElement('img');
   image.className='cart-img';
   image.src=img;
   imgSpan.appendChild(image);
   const headSpan = document.createElement('span');
   headSpan.textContent=name;
   imgSpan.appendChild(headSpan);

   div.appendChild(imgSpan);

   const priceSpan = document.createElement('span');
   priceSpan.className='cart-price cart-column';
   priceSpan.textContent=price;
   div.appendChild(priceSpan);

   const quanSpan = document.createElement('span');
   quanSpan.className='cart-quantity cart-column';
   const input = document.createElement('input');
   input.className = 'item-count';
   input.type='text';
   input.value='1';
   quanSpan.appendChild(input);
   const button = document.createElement('button');
   button.textContent='REMOVE';
   button.setAttribute('onclick','removeItem(event)');
   quanSpan.appendChild(button);
   div.appendChild(quanSpan);

   cartItem.appendChild(div);

  const totalVal = document.getElementById('total-value');
  totalVal.textContent = +totalVal.textContent + +price;
  showNotification(name);
  cartUpdate();
   }
 }
 function cartUpdate(){
 const totalNo = document.getElementsByClassName('item-count');
  let count=0;
  for(let i of totalNo)
   count += +i.value;
  const cartVal = document.getElementById('cart-number');
  cartVal.textContent = count;
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
 function removeItem(event){
  const parEle = event.target.parentNode.parentNode;
  parEle.remove();
  const totalVal = document.getElementById('total-value');
  const price = event.target.parentNode.previousElementSibling.textContent;
  totalVal.textContent = +totalVal.textContent - +price;
  cartUpdate();
 }
