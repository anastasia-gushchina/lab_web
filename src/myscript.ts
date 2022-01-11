function autorization(login:string, password:string){
    var xhr = new XMLHttpRequest();
    xhr.open('POST','?login');
    xhr.send(login+" "+password);
    xhr.onreadystatechange = func;
    function func(){
        if(xhr.readyState === 4){
            

        }
    }
}