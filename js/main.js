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
      cardsMenu = document.querySelector('.cards-menu'),
      restaurantTitle = document.querySelector('.restaurant-title'),
      rating = document.querySelector('.rating'),
      priceFrom = document.querySelector('.price'),
      category = document.querySelector('.category');

let login = localStorage.getItem('Delivery');

const message = {
  fail: 'Введите логин'
};

const getData = async function(url) {
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ошибка по адресу ${url}, 
                      статус ошибки ${response.status}!`)
    }

    return await response.json();
};

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
/*   if (!nameReg.test(str)) {
    if (str.length < 20) console.log('длинная строка')
  } */
  return nameReg.test(str);
}
valid();

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
      returnMain();
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
      if (valid(loginInput.value.trim())) {
        
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
        document.querySelector('.label-auth > span').textContent = message.fail;
        document.querySelector('.label-auth > span').style.color = 'red';
        loginInput.value = '';
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


function createCardRestaurant(restaurant) {

  const { 
          image, 
          kitchen, 
          name, 
          price, 
          products, 
          stars, 
          time_of_delivery: timeOfDelivery 
        } = restaurant;

  const card = `
      <a class="card card-restaurant" 
        data-products="${products}"
        data-menu="${[name, stars, price, kitchen]}"
      >
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);
}

function createCardGood({description, id, image, name, price}) {

    const card= document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
          </div>
          <div class="card-info">
            <div class="ingredients">${description}
            </div>
          </div>
          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
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

          cardsMenu.textContent = '';
          containerPromo.classList.add('hide');
          restaurants.classList.add('hide'); 
          menu.classList.remove('hide');

          const menuInfo = restaurant.dataset.menu.split(',');

          const [ name, stars, price, kitchen ] = menuInfo;

          restaurantTitle.textContent = name;
          rating.textContent = stars;
          priceFrom.textContent = `От ${price} ₽`;
          category.textContent = kitchen;

          getData(`./db/${restaurant.dataset.products}`).then(function(data) {
            data.forEach(createCardGood);
          });

        } else {
          toggleModalAuth();
        }
    }

}

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide'); 
  menu.classList.add('hide');
}

function init() {
  
    getData('./db/partners.json').then(function(data) {
      data.forEach(createCardRestaurant)
    });

    cartButton.addEventListener("click", toggleModal);
    close.addEventListener("click", toggleModal);

    cardsRestaurants.addEventListener('click', openGoods);
    logo.addEventListener('click', returnMain);

    checkAuth();

    new Swiper('.swiper-container', {
    loop: true,
    autoplay: true
    }) 

}

init();
