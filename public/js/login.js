
document.getElementById('form-loginPage').addEventListener('submit',login);

async function login(event){
   const mail = event.target.mail.value;
   const password = event.target.password.value;
   const error = document.getElementById('error')
   
   const obj = {mail,password};
   try{
   const res = await axios.post('http://3.105.195.179:3000/login',obj);
     const token = res.data.token;
      if(res.status == 200){ 
        localStorage.setItem('ecommerce',token);
       window.location.href = 'http://3.105.195.179:3000/shop';
      }
    }
   catch(err){
     if(err.response.status == 404){
        error.value="*User not found*"
        error.style.display = 'block';
       }
     if(err.response.status == 401){
        error.value="*Wrong password*"
        error.style.display = 'block';
       } 
       if(err.response.status == 500){
        error.value="*Something went wrong*"
        error.style.display = 'block';
       } 
     };
     document.getElementById('mail').value='';
     document.getElementById('password').value='';
      setTimeout(()=>{
       error.style.display = 'none';
      },2000);
}
