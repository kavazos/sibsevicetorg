(async ()=>{
  try{
    const res = await fetch('http://localhost:3000/api/auth/register',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email:'testuser@example.com', password:'Testpass123', name:'Test User'})
    });
    console.log('status', res.status);
    console.log('set-cookie', res.headers.get('set-cookie'));
    console.log('body', await res.text());
  } catch(e){
    console.error('error', e);
  }
})();
