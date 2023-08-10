import { kebabCase, addPurchase } from "./src/utils";
import { useStyle } from "./src/components/styles";
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img class = "image_dash" src="./src/assets/dash3.JPG" alt="summer">
    <div>
      <form onsubmit="event.preventDefault();" role="search">
        <label for="search">Search for stuff</label>
        <input id="search" type="search" placeholder="Search..." autofocus required />
        <button class="searchButton" type="submit">Go</button>    
        </form>
    </div>
      <div class="events flex items-center justify-center flex-wrap"> 
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  // Sample hardcoded event data
  /*const eventData = {
    id: 1,
    description: 'Sample event description.',
    img: './src/assets/untold4.1.png',
    name: 'Sample Event',
    ticketCategories: [
      { id: 1, description: 'General Admission' },
      { id: 2, description: 'VIP' },
    ],
  };
  // Create the event card element
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');
  // Create the event content markup
  const contentMarkup = `
    <header>
      <h2 class="event-title text-2xl font-bold">${eventData.name}</h2>
    </header>
    <div class="content">
      <img src="${eventData.img}" alt="${eventData.name}" class="event-image w-full height-200 rounded object-cover mb-4">
      <p class="description text-gray-700">${eventData.description}</p>
      <button class="eventButton" type="button">Place order</button>
    </div>
  `;

  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  // Append the event card to the events container
  eventsContainer.appendChild(eventCard);*/

  fetchEvents().then((data) => {
    console.log(data);
     createEventsCard(data);
  });
}

async function fetchEvents() {
  const response = await fetch('https://localhost:44394/api/Event/GetAll');
  const data = await response.json();
  return data;
}

const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events';
  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach(event => {
      eventsDiv.appendChild(createEvent(event));
    });
  }
};

const createEvent = (eventData) => {
  /*const title = "Untold";//kebabCase(eventData.eventType.name);
  const eventElement = createEventElement(eventData, title);
  return eventElement;*/

  const { id, name, description, ticketCategories, eventType, venue } = eventData;
  const eventDiv = document.createElement('div');
  const eventWrapperClasses = useStyle('eventWrapper');

};

/*const createEventElement = (eventData, title) => {
  const { id, name, description, ticketCategories, eventType, venue } = eventData;
  const eventDiv = document.createElement('div');
  const eventWrapperClasses = useStyle('eventWrapper');
  const actionsWrapperClasses = useStyle('actionsWrapper');
  const quantityClasses = useStyle('quantity');
  const inputClasses = useStyle('input');
  const quantityActionsClasses = useStyle('quantityActions');
  const increaseBtnClasses = useStyle('increaseBtn');
  const decreaseBtnClasses = useStyle('decreaseBtn');
  const addToCartBtnClasses = useStyle('addToCartBtn');

  eventDiv.classList.add(...eventWrapperClasses);

  const contentMarkup = `
    <header>
        <h2 class="event-title text-2xl font-bold">${name}</h2>
    </header>
    <div class="content">
      <img src="./src/assets/untold4.1.png" alt="${name}" class="event-image w-full height-200 rounded object-cover mb-4">
      <p class="description text-gray-700">${description}</p>
    </div>
  `;

  eventDiv.innerHTML = contentMarkup;

  const actions = document.createElement('div');
  actions.classList.add(...actionsWrapperClasses);

  const categoriesOptions = ticketCategories.map(
    (ticketCategory) =>
      `<option value=${ticketCategory.id}>${ticketCategory.description}</option>`
  );

  const ticketTypeMarkup = `
    <h2 class="text-lg font-bold mb-2">Choose Ticket Type:</h2>
    <select id="ticketType" name="ticketType" class="select ${title}-ticket-type border border-gray-300 rounded py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      ${categoriesOptions.join('\n')}
    </select>
  `;
  actions.innerHTML = ticketTypeMarkup;

  const quantity = document.createElement('div');
  quantity.classList.add(...quantityClasses);

  const input = document.createElement('input');
  input.classList.add(...inputClasses);
  input.type = 'number';
  input.min = '0';
  input.value = '0';

  input.addEventListener('blur', () => {
    if (!input.value) {
      input.value = 0;
    }
  });

  input.addEventListener('input', () => {
    const currentQuantity = parseInt(input.value);
    if (currentQuantity > 0) {
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });
  
  quantity.appendChild(input);

  const quantityActions = document.createElement('div');
  quantityActions.classList.add(...quantityActionsClasses);

  const increase = document.createElement('button');
  increase.classList.add(...increaseBtnClasses);
  increase.innerText = '+';
  increase.addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
    const currentQuantity = parseInt(input.value);
    if (currentQuantity > 0) {
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  const decrease = document.createElement('button');
  decrease.classList.add(...decreaseBtnClasses);
  decrease.innerText = '-';
  decrease.addEventListener('click', () => {
    const currentValue = parseInt(input.value);
    if (currentValue > 0) {
      input.value = currentValue - 1;
    }
    const currentQuantity = parseInt(input.value);
    if (currentQuantity > 0) {
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  quantityActions.appendChild(increase);
  quantityActions.appendChild(decrease);

  quantity.appendChild(quantityActions);
  actions.appendChild(quantity);
  eventDiv.appendChild(actions);

  // Create the event footer with "Add To Cart" button
  const eventFooter = document.createElement('footer');
  const addToCart = document.createElement('button');
  addToCart.classList.add(...addToCartBtnClasses);
  addToCart.innerText = 'Add To Cart';
  addToCart.disabled = true;

  addToCart.addEventListener('click', () => {
    handleAddToCart(title, id, input, addToCart);
  });
  eventFooter.appendChild(addToCart);
  eventDiv.appendChild(eventFooter);

  return eventDiv;

}*/

function createEventsCard(data){


  const eventsDiv = document.querySelector('.events');

  //const src = ['./src/assets/ec.png','./src/assets/untold4.1.png','./src/assets/untold4.1.png','./src/assets/untold4.1.png','./src/assets/untold4.1.png'];
  //data.image = src;
  data.forEach(event =>{

    const eventCard = document.createElement('div');

    eventCard.classList.add('event-card');

    const image = document.createElement('img');
    image.src = './src/assets/ec.png';
    eventCard.appendChild(image);

    const name = document.createElement('h2');
    name.textContent = event.eventName;
    eventCard.appendChild(name);

    const description = document.createElement('p');
    description.textContent = event.eventDescription;
    eventCard.appendChild(description);

    const ticketCategories = document.createElement('p');
    ticketCategories.textContent = event.ticketCategory[0].description;
    eventCard.appendChild(ticketCategories);

    const eventType = document.createElement('p');
    eventType.textContent = `Type: ${event.eventType}`;
    eventCard.appendChild(eventType);

    const venue = document.createElement('p');
    venue.textContent = `Venue: ${event.venue}`;
    eventCard.appendChild(venue);

    const button = document.createElement('button');
    button.classList.add('event-button');
    button.textContent = 'Purchase tickets';
    eventCard.appendChild(button);

    
    eventsDiv.appendChild(eventCard);

    return eventsDiv;
  })
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
