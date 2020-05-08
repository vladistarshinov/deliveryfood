// day #4

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
      category = document.querySelector('.category'),
      inputSearch = document.querySelector('.input-search'),
      modalBody = document.querySelector('.modal-body'),
      modalPrice = document.querySelector('.modal-pricetag'),
      buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('Delivery');

const message = {
  fail: 'Введите логин'
};

const cart = [];

const loadCart = () => {
    if (localStorage.getItem(login)) {
      cart.push(...JSON.parse(localStorage.getItem(login)));
    }
};


const saveCart = () => {
    localStorage.setItem(login, JSON.stringify(cart));
};

const getData = async (url) => {
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ошибка по адресу ${url}, 
                      статус ошибки ${response.status}!`)
    }

    return await response.json();
};

const valid = str => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
/*   if (!nameReg.test(str)) {
    if (str.length < 20) console.log('длинная строка')
  } */
  return nameReg.test(str);
};
valid();

const toggleModal = () => {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = () => {
    modalAuth.classList.toggle('is-open');
    loginInput.style.borderColor = '';
    document.querySelector('.label-auth > span').style.color = 'black';
    document.querySelector('.label-auth > span').textContent = "Логин";

};


const authorized = () => {

  const  logout = () => {
      login = null;
      cart.length = 0;
      localStorage.removeItem('Delivery');
      buttonAuth.style.display = '';
      userName.style.display = '';
      buttonOut.style.display = '';
      cartButton.style.display = '';
      buttonOut.removeEventListener('click', logout);
      checkAuth();
      returnMain();
  };

  console.log('Авторизован!');

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logout);
  loadCart();
};

const notAuthorized = () => {
  console.log('Не авторизован!');

    const logIn = event => {
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
};

const checkAuth = () => login ? authorized() : notAuthorized();

const createCardRestaurant = restaurant => {

  const { 
          image, 
          kitchen, 
          name, 
          price, 
          products, 
          stars, 
          time_of_delivery: timeOfDelivery 
        } = restaurant;

  const card = document.createElement('a');
  card.classList = 'card card-restaurant';
  card.products = products;  
  card.menu = [name, stars, price, kitchen];   

  card.insertAdjacentHTML('beforeend', `
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
  `);

  cardsRestaurants.insertAdjacentElement('beforeend', card);
};

const createCardGood = ({description, id, image, name, price}) => {

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
            <button class="button button-primary button-add-cart" id="${id}">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price card-price-bold">${price} ₽</strong>
          </div>
        </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
};

const openGoods = event => {
    const target = event.target;

    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
        if (login) {

          const [ name, stars, price, kitchen ] = restaurant.menu;

          cardsMenu.textContent = '';
          containerPromo.classList.add('hide');
          restaurants.classList.add('hide'); 
          menu.classList.remove('hide');

          restaurantTitle.textContent = name;
          rating.textContent = stars;
          priceFrom.textContent = `От ${price} ₽`;
          category.textContent = kitchen;

          getData(`./db/${restaurant.products}`)
            .then(data => data.forEach(createCardGood));

        } else {
          toggleModalAuth();
        }
    }

};

const returnMain = () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide'); 
  menu.classList.add('hide');
};

const addToCart = event => {
    const target = event.target;

    const buttonAddToCart = target.closest('.button-add-cart');

   if (buttonAddToCart) {
      const card = target.closest('.card'),
            title = card.querySelector('.card-title-reg').textContent,
            cost = card.querySelector('.card-price').textContent,
            id = buttonAddToCart.id;
      
      const food = cart.find(item => item.id === id);

        if (food) {
            food.count += 1;
        } else {
            cart.push({
              id,
              title,
              cost,
              count: 1
            });
        }
      
   }

   saveCart();
  
};

const renderCart = () => {
    modalBody.textContent = '';

    cart.forEach(({ id, title, cost, count }) => {
        const itemCart = `
            <div class="food-row">
              <span class="food-name">${title}</span>
              <strong class="food-price">${cost}</strong>
              <div class="food-counter">
                <button class="counter-button counter-minus" data-id="${id}">-</button>
                <span class="counter">${count}</span>
                <button class="counter-button counter-plus" data-id="${id}">+</button>
              </div>
            </div>
        `;

        modalBody.insertAdjacentHTML('afterbegin', itemCart);
    });

    const totalPrice = cart.reduce((result, item) => {
        return result + (parseFloat(item.cost) * item.count);
    }, 0);

    modalPrice.textContent = totalPrice + ' ₽';

};

const changeCount = event => {
    const target = event.target;

    if (target.classList.contains('counter-button')) {
        const food = cart.find(item => item.id === target.dataset.id);

        if (target.classList.contains('counter-minus')) {
            food.count--;

            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1);
            }
        }
        
        if (target.classList.contains('counter-plus')) food.count++;

        renderCart();
    }

    saveCart();

};

function init() {
  
    getData('./db/partners.json').then(data => {
      data.forEach(createCardRestaurant)
    });

    cartButton.addEventListener('click', renderCart);
    cartButton.addEventListener('click', toggleModal);

    modalBody.addEventListener('click', changeCount);

    cardsMenu.addEventListener('click', addToCart);
    buttonClearCart.addEventListener('click', () => {
        cart.length = 0;
        renderCart();
    });
    close.addEventListener('click', toggleModal);


    cardsRestaurants.addEventListener('click', openGoods);
    logo.addEventListener('click', returnMain);

    inputSearch.addEventListener('keydown', event => {
        if (event.keyCode === 13) {
            const target = event.target; // event.target.value === InputSearch.value
            const value = target.value.toLowerCase().trim();

            if (!value || value.length < 3) {
                target.style.backgroundColor = 'tomato';
                setTimeout(() => target.style.backgroundColor = ''
                , 1000);
                return;
            }

            target.value = '';
            const goods = [];

            getData('./db/partners.json')
                .then((data) => {
                    const products = data.map(item => item.products);

                    products.forEach(product => {
                        getData(`./db/${product}`)
                            .then(data => {
                                goods.push(...data);

                                const searchGoods = goods
                                    .filter(item => item.name.toLowerCase().includes(value));

                                cardsMenu.textContent = '';
                                containerPromo.classList.add('hide');
                                restaurants.classList.add('hide'); 
                                menu.classList.remove('hide');

                                restaurantTitle.textContent = 'Результат поиска';
                                rating.textContent = '';
                                priceFrom.textContent = '';
                                category.textContent = '';

                                return searchGoods;

                            }).then(data => data.forEach(createCardGood));
                    });
                });
        }
    });

    checkAuth();

    new Swiper('.swiper-container', {
    loop: true,
    autoplay: true
    }) 

}

init();
