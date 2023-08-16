import { kebabCase, addPurchase } from "./src/utils";
import { useStyle } from "./src/components/styles";
import { data } from "autoprefixer";
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {

  return `
  <div id="content">
  <div class="slideshow-container">
    <div class="slide fade">
      <div class="numberText">1 / 3</div>
      <img class ="imageSlide" src="src/assets/untold10.png" alt="untold">
    </div>
    <div class="slide fade">
      <div class="numberText">2 / 3</div>
      <img class ="imageSlide" src="./src/assets/ec.jpeg" alt="electric">
    </div>
    <div class="slide fade">
      <div class="numberText">3 / 3</div>
      <img class ="imageSlide" src="src/assets/Wine Festival3.png" alt="electric">
    </div>
  </div>
  <div style="text-align:center">
  <span class="dot" onclick="currentSlide(1)"></span>
  <span class="dot" onclick="currentSlide(2)"></span>
  <span class="dot" onclick="currentSlide(3)"></span>
  </div>
  <div class= "filter">
    <form onsubmit="event.preventDefault();" role="search">
      <label class="searchLabel" for="search">Search for stuff</label>
      <input class="searchInput" id="search" type="search" placeholder="Search event..." autofocus required />
      <button class="searchButton" type="submit">Go</button>
    </form>
  </div>
  <div class="events flex items-center justify-center flex-wrap">
  </div>
</div>

  `;
}

document.addEventListener("DOMContentLoaded", function () {

  let slideIndex = 0;
  showSlides();
  console.log(slideIndex);
  function showSlides() {

    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 3000);
  }
});

function getOrdersPageTemplate() {
  return `
      <div id="content">
        <div class="table-container">
          <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
        </div>
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

  document.addEventListener("DOMContentLoaded", function () {

    let slideIndex = 0;
    showSlides();
   
    function showSlides() {
  
      let i;
      let slides = document.getElementsByClassName("slide");
      let dots = document.getElementsByClassName("dot");
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1 }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
      setTimeout(showSlides, 3000);
    }
  });

  setUpFilterEvents();
  createFilterUI();

  fetchEvents().then((data) => {
    console.log(data);
    addEvents(data);
  });
}

async function fetchEvents() {
  const response = await fetch('https://localhost:44394/api/Event/GetAll');
  const data = await response.json();
  return data;
}

const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events found';
  if (events.length) {
    eventsDiv.innerHTML = '';
    events.forEach(event => {
      const img = `./src/assets/${event.eventName}.png`;
      eventsDiv.appendChild(createEventsCard(event.eventName, img, event.eventDescription, event.eventType, event.venue, event.eventId, event.ticketCategory));
    });
  }
};

const addEventsFilter = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events found';
  if (events.length) {
    eventsDiv.innerHTML = '';
    events.forEach(event => {
      const img = `./src/assets/${event.eventName}.png`;
      eventsDiv.appendChild(createEventsCard(event.eventName, img, event.eventDescription, event.eventType, event.venue.location, event.eventId, event.ticketCategories));
    });
  }
};

function createEventsCard(eventName, img, eventDescription, eventTypeData, venueData, eventId, ticketCategory) {

  const eventCard = document.createElement('div');

  const name = document.createElement('h2');
  name.textContent = eventName;
  name.classList.add('eventName');
  eventCard.appendChild(name);

  eventCard.classList.add(`event-card`);
  eventCard.classList.add(`id-${eventId}`);

  const image = document.createElement('img');
  image.src = img;
  eventCard.appendChild(image);

  const description = document.createElement('p');
  description.textContent = eventDescription;
  eventCard.appendChild(description);

  const eventType = document.createElement('p');
  eventType.textContent = `Type: ${eventTypeData}`;
  eventCard.appendChild(eventType);

  const venue = document.createElement('p');
  venue.textContent = `Venue: ${venueData}`;
  eventCard.appendChild(venue);

  const ticketsCategory = document.createElement('div');
  const ticketCategoryLabel = document.createElement('label');
  ticketCategoryLabel.classList.add('ticketLabel')
  ticketCategoryLabel.textContent = 'Select ticket category: ';
  const ticketCategorySelect = document.createElement('select');
  ticketCategorySelect.classList.add('select-style');
  if (ticketCategory && ticketCategory.length > 0) {
    ticketCategory.forEach(category => {
      const option = document.createElement('option');
      option.value = category.ticketCategoryId;
      option.textContent = category.description + " " + category.price + "RON";
      ticketCategorySelect.append(option);
    });
    ticketsCategory.appendChild(ticketCategoryLabel);
    ticketCategoryLabel.appendChild(ticketCategorySelect);
    eventCard.appendChild(ticketsCategory);
  }

  const inputTicket = document.createElement('div');
  const ticketsLabel = document.createElement('label');
  ticketsLabel.textContent = 'Number of Tickets: ';
  const ticketsInput = document.createElement('input');
  ticketsInput.classList.add('input-style');
  ticketsInput.classList.add(`idInput-${eventId}`);
  ticketsInput.type = 'number';
  ticketsInput.value = 1;

  ticketsInput.addEventListener('input', () => {
    if (ticketsInput.value < 1) {
      ticketsInput.value = 1;
    }
  });

  if (ticketCategory.length > 0) {

    const plusButton = document.createElement('button');
    plusButton.classList.add('quantity-button-plus');
    plusButton.classList.add(`idPlus-${eventId}`);
    plusButton.textContent = "+";
    const minusButton = document.createElement('button');
    minusButton.classList.add('quantity-button-minus');
    minusButton.classList.add(`idMinus-${eventId}`);
    minusButton.textContent = "-";


    inputTicket.appendChild(ticketsLabel);
    inputTicket.appendChild(minusButton);
    inputTicket.appendChild(ticketsInput);
    inputTicket.appendChild(plusButton);
    eventCard.appendChild(inputTicket);
  }

  const addToCart = document.createElement('button');
  addToCart.classList.add('event-button');
  addToCart.textContent = 'Purchase tickets';
  eventCard.appendChild(addToCart);

  addToCart.addEventListener('click', () => {

    const eventIdPost = eventId;
    const selectedCategoryId = ticketCategorySelect.value;
    const numberOfTickets = parseInt(ticketsInput.value);

    const requestData = {
      eventId: eventIdPost,
      ticketCategoryId: selectedCategoryId,
      numberOfTickets: numberOfTickets
    };

    fetch('http://localhost:8080/api/orders/addOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Purchase request successful:', data);
      })
      .catch(error => {
        console.error('Error making purchase request:', error);
      });

      ticketsInput.value = 1;
      ticketCategorySelect.selectedIndex = 0;
  });

  const minusButton = eventCard.querySelector(`.idMinus-${eventId}`);
  const plusButton = eventCard.querySelector(`.idPlus-${eventId}`);
  const ticketInput = eventCard.querySelector(`.idInput-${eventId}`);

  minusButton.addEventListener('click', () => {
    if (ticketInput.value > 1) {
      ticketInput.value = parseInt(ticketInput.value) - 1;
    }
  });

  plusButton.addEventListener('click', () => {
    ticketInput.value = parseInt(ticketInput.value) + 1;
  });
  return eventCard;
}

function liveSearch() {
  const searchInput = document.querySelector(".searchInput");
  const eventsDiv = document.querySelector('.events');

  if (searchInput) {
    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue !== "") {
      const allEventCards = eventsDiv.querySelectorAll('.event-card');

      allEventCards.forEach(eventCard => {
        const eventName = eventCard.querySelector('.eventName').textContent.toLowerCase();
        const isMatch = eventName.includes(searchValue);
        eventCard.style.display = isMatch ? "block" : "none";
      });
    } else {
      const allEventCards = eventsDiv.querySelectorAll('.event-card');
      allEventCards.forEach(eventCard => {
        eventCard.style.display = "block";
      });
    }
  }
}

function setUpFilterEvents() {
  const nameSearchInput = document.querySelector('#search');

  if (nameSearchInput) {
    const searchInterval = 500;
    nameSearchInput.addEventListener('keyup', () => {
      setTimeout(liveSearch, searchInterval);
    });
  }
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  fetchOrder().then((data) => {
    console.log(data);
    createOrdersTable(data);
  });
}

async function fetchOrder() {
  const response = await fetch('http://localhost:8080/api/orders');
  const data = await response.json();
  return data;
}

function createOrdersTable(data) {

  console.log(data);

  const tableContainer = document.querySelector('.table-container');

  const table = document.createElement('table');
  table.classList.add('data-table');

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const columnNames = ['Event', 'Ordered at', 'Ticket category', 'Number of tickets', 'Total price'];
  columnNames.forEach(column => {
    const th = document.createElement('th');
    th.textContent = column;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach(rowData => {
    const row = document.createElement('tr');
    columnNames.forEach(column => {
      const cell = document.createElement('td');
      if (column === 'Event') {
        cell.textContent = rowData.eventId;
      } else if (column === 'Ordered at') {
        cell.textContent = new Date(rowData.timestamp).toLocaleDateString();
      } else if (column === 'Ticket category') {
        cell.textContent = rowData.ticketCategoryId;
      } else if (column === 'Number of tickets') {
        cell.textContent = rowData.numberOfTickets;
      } else if (column === 'Total price') {
        cell.textContent = rowData.totalPrice;
      }
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  tableContainer.appendChild(table);

}

async function fetchEventsWithFilters(venueId, eventType) {

  const response = await fetch(`http://localhost:8080/api/events?venueId=${venueId}&eventType=${eventType}`);
  const data = await response.json();
  console.log(data);
  return data;
}



function createFilterUI() {

  let cnt = 0;

  const filterDiv = document.querySelector('.filter');

  const eventTypeDropdown = document.createElement('select');
  eventTypeDropdown.id = 'eventTypeFilter';

  const eventTypes = ['Choose event type', 'Festival de muzica', 'Sport', 'Bauturi'];
  eventTypes.forEach(eventType => {
    const option = document.createElement('option');
    option.value = eventType;
    option.textContent = eventType;
    eventTypeDropdown.appendChild(option);
  });
  const venueDropdown = document.createElement('select');

  const venues = ['Choose venue', 'Aleea Stadionului 2, Cluj-Napoca', 'Bontida Castle, Cluj-Napoca', 'Central Park, Cluj-Napoca', 'Intre Lacuri, Cluj-Napoca'];
  venues.forEach(venue => {
    const option = document.createElement('option');
    option.value = cnt;
    option.textContent = venue;
    cnt++;
    venueDropdown.appendChild(option);
  });

  venueDropdown.id = 'venueFilter';
  eventTypeDropdown.addEventListener('change', applyFilters);
  venueDropdown.addEventListener('change', applyFilters);

  filterDiv.appendChild(eventTypeDropdown);
  filterDiv.appendChild(venueDropdown);
}

function applyFilters() {

  const eventTypeFilter = document.getElementById('eventTypeFilter').value;
  const venueFilter = document.getElementById('venueFilter').value;

  fetchEventsWithFilters(venueFilter, eventTypeFilter).then(data => {

    if (venueFilter == 0 || eventTypeFilter == 'Choose event type') {
      fetchEvents().then((data) => {
        console.log(data);
        addEvents(data);
      });
    } else {
      addEventsFilter(data);
    }
  })
    .catch(error => {
      console.error('Error fetching data with filters:', error);
    });
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
