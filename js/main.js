// day #2

const cartButton = document.querySelector('#cart-button'),
      modal = document.querySelector('.modal'),
      close = document.querySelector('.close'),
      buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      loginForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      cardsRestaurants = document.querySelector('.cards-restaurants'),
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('Delivery');

const message = {
  fail: 'Введите логин'
};

function toggleModal() {
  modal.classList.toggle("is-open");
}

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
      if (loginInput.value.trim()) {
        
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

function createCardRestaurant() {
  const card = `
      <a class="card card-restaurant">
        <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">Пицца плюс</h3>
            <span class="card-tag tag">50 мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              4.5
            </div>
            <div class="price">От 900 ₽</div>
            <div class="category">Пицца</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);
}

createCardRestaurant();

function createCardGood() {
    const card= document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend', `
        <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">Пицца Везувий</h3>
          </div>
          <div class="card-info">
            <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
              «Халапенье», соус «Тобаско», томаты.
            </div>
          </div>
          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">545 ₽</strong>
          </div>
        </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
    const target = event.target;

    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
        if (login) {
          containerPromo.classList.add('hide');
          restaurants.classList.add('hide'); 
          menu.classList.remove('hide');
  
          cardsMenu.textContent = '';
  
          createCardGood();
        } else {
          toggleModalAuth();
        }
    }

}


cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide'); 
    menu.classList.add('hide');
});

