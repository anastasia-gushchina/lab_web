function page_loading() { }
function autorization(login = "", password = "") {
    var xhr = new XMLHttpRequest();
    if (login === "")
        login = document.getElementById("floatingInput").nodeValue;
    if (password === "")
        password = document.getElementById("floatingPassword").nodeValue;
    xhr.open('POST', '/info?login');
    xhr.send(login + " " + password);
    xhr.onreadystatechange = func;
    function func() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // send page
                var val = JSON.parse(xhr.responseText);
                if (val.role > 1) {
                    //admin
                }
                else if (val.role > 0) {
                    //master
                }
                else {
                    //client
                }
            }
            else {
                //wrong login or password
                document.getElementById("pass_warning").textContent = "Неверный логин или пароль";
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
            document.getElementById("sign-email").className.replace(/(?:^|\s)is_invalid(?!\S)/g, '');
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
            document.getElementById("sign-password").className.replace(/(?:^|\s)is_invalid(?!\S)/g, '');
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
//# sourceMappingURL=myscript.js.map