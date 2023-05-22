function toggleClass(selector) {
  let e = document.querySelector(selector);
  e.classList.toggle("hide");
}

function showSuccessMessage(message) {
  const cont = document.querySelector("#notification-container");

  cont.classList.remove("hide");
  cont.classList.remove("error-msg");
  cont.classList.add("success-msg");
  cont.querySelector("#notification-text").innerHTML = message;
}

function showErrorMessage(message) {
  const cont = document.querySelector("#notification-container");

  cont.classList.remove("hide");
  cont.classList.remove("success-msg");
  cont.classList.add("error-msg");
  cont.querySelector("#notification-text").innerText = message;
}


