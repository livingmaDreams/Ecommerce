document.getElementById('form-changepassword-page').addEventListener('submit', changePassword);

function changePassword(event){
  event.preventDefault();
  const pwd = event.target.password.value;
  const pwdR = event.target.reenterPassword.value;
  let urlFull = location.href.split('?');
  let url = urlFull[0].split('/');
  let id = url[url.length -1];

  if(pwd !== pwdR)
  {
     event.target.error.value="Passwords doesn't match";
     event.target.error.style.display = 'block';
  }
  else{
     const obj ={pwd,id};
     axios.post('http://3.105.195.179:3000/forgotpassword/resetpassword',obj)
     .then(res => window.location.href='http://3.105.195.179:3000/login')
     .catch(err => console.log(err));
  }
}