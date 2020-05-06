const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}


// day #1 Authorization

const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      loginForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('Delivery');

const message = {
  fail: 'Введите логин'
};

function toggleModalAuth() {
    modalAuth.classList.toggle('is-open');
    loginInput.style.borderColor = '';
    document.querySelector('.label-auth > span').style.color = 'black';
    document.querySelector('.label-auth > span').textContent = "Логин";
}


function authorized() {

  function logout() {
      login = null;
      localStorage.removeItem('Delivery');
      buttonAuth.style.display = '';
      userName.style.display = '';
      buttonOut.style.display = '';
      buttonOut.removeEventListener('click', logout);

      checkAuth();
  }

  console.log('Авторизован!');

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logout);
}

function notAuthorized() {
  console.log('Не авторизован!');

    function logIn(event) {
      event.preventDefault();
      if(loginInput.value != 0) {
        login = loginInput.value;
        localStorage.setItem('Delivery', login);
   
        toggleModalAuth();

        buttonAuth.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        loginForm.removeEventListener('submit', logIn);
        loginForm.reset();

        checkAuth(); 
      } else {
        loginInput.style.borderColor = 'red';
        document.querySelector('.label-auth > span').textContent = "Введите логин";
        document.querySelector('.label-auth > span').style.color = 'red';
      }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    loginForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if(login) {
      authorized();
  } else {
      notAuthorized();
  }
}

checkAuth();

