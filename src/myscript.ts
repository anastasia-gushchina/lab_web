
function page_loading() {
    if (localStorage.getItem("in-system") == "true") {
        //user is in system

        if (localStorage.getItem("role") == "2") {
            //it is admin

        }
        if (localStorage.getItem("role") == "1") {
            //it is master

        }
    }
    else {

    }
}

/*<li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" me href="#" id="user-name" role="button"
        data-bs-toggle="dropdown" aria-expanded="false">
        Имя
      </a>
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
        <li><a class="dropdown-item" href="#" >Настройки</a></li>
        <li><hr class="dropdown-divider"> </li>
        <li><a class="dropdown-item" href="#" onclick="logout()">Выйти</a></li>
      </ul>
    </li> */

function set_name() {
    document.getElementById("user-name").textContent=localStorage.getItem("name");
}

function logout() {
    localStorage.setItem("in-system", "false");
    if (window.location.pathname.includes("lk"))window.location.replace("/");
    else
    window.location.reload();
}
function check_autorization() {
    return localStorage.getItem("in-system") == "true";
}
function autorization(login = "", password = "") {
    var xhr = new XMLHttpRequest();

    //get data
    if (login === "") login = (<HTMLInputElement>document.getElementById("floatingInput")).value;
    if (password === "") password = (<HTMLInputElement>document.getElementById("floatingPassword")).value;

    //send data
    xhr.open('POST', '/info?login=' + login);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(`{"login": "${login}", "password": "${password}"}`);
    xhr.onreadystatechange = func;

    //recieve answer
    function func() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText != undefined && xhr.responseText != "") {
                    document.getElementById("pass_warning").textContent = "";
                    // send page
                    let val = JSON.parse(xhr.responseText)[0];
                    // let send_page = new XMLHttpRequest();

                    if (val.role > 1) {
                        //admin
                        // send_page.open("GET","/lk/admin");

                        window.location.replace("/lk/admin");
                    }
                    else
                        if (val.role > 0) {
                            //master
                            //send_page.open("GET","/lk/master");

                            window.location.replace("/lk/master");
                        }
                        else {
                            //client
                            // send_page.open("GET","/lk/client");

                            window.location.replace("/lk/client");
                        }

                    //user is in system now
                    localStorage.setItem("in-system", "true");
                    localStorage.setItem("name", val.name);
                    localStorage.setItem("role", val.role);
                    // send_page.send();
                }
                else {
                    //wrong login or password
                    document.getElementById("pass_warning").textContent = "Неверный логин или пароль";
                }
            }
            else {

                document.getElementById("pass_warning").textContent = "Произошла ошибка на сервере";
            }
        }
    }
}
function registration() {
    var xhr = new XMLHttpRequest();
    var login = document.getElementById("sign-email").nodeValue;
    var password = document.getElementById("sign-password").nodeValue;
    var ok = true;
    //checking correctness of login
    if (login.match(/^[a-z][a-z0-9]*?([-_][a-z0-9]+){0,2}$/i) || login.match(/^\+7[0-9]{10}$/i)) {
        //ok
        document.getElementById("sign-email").className =
            document.getElementById("sign-email").className.replace
                (/(?:^|\s)is_invalid(?!\S)/g, '');
        document.getElementById("label_sign_email").nodeValue = "Email/Номер телефона";
        document.getElementById("pass_sign_warning").nodeValue = "";
    }
    else {
        //not correct
        document.getElementById("sign-email").className += "is_invalid";
        document.getElementById("label_sign_email").nodeValue = "Некорректное значение";
        document.getElementById("pass_sign_warning").nodeValue = "Пример: my_mail@yandex.ru \n +79991234567\n";
        ok = false;
    }
    //checking correctness of password
    if (password.length >= 6) {
        document.getElementById("sign-password").className =
            document.getElementById("sign-password").className.replace
                (/(?:^|\s)is_invalid(?!\S)/g, '');
        document.getElementById("label_sign_password").nodeValue = "Пароль";
    }
    else {
        document.getElementById("sign-password").className += "is_invalid";
        document.getElementById("label_sign_password").nodeValue = "Некорректное значение";
        document.getElementById("pass_sign_warning").nodeValue += "Пароль должен содержать минимум 6 символов";
        ok = false;
    }

    //check if this user already exist




    //send email
    if (ok) {



        //open window for entering code

        //close modal window

    }
}

function registration_end() {
    //add to DB

    //autorization
    // autorization(login, password);

}