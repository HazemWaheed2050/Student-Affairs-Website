function toggle(selector) {
    let e = document.querySelector(selector);
    e.classList.toggle("hide");
}

function validateEmail(email) {
    const exp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return exp.test(email);
}

function validatePhoneNumber(phone_number) {
    const exp = /^(?:\+20|0)?1[0125]\d{8}$/;
    return exp.test(phone_number);
}

function validateID(id){
    const exp = /^[0-9]+$/;
    return exp.test(id);
}