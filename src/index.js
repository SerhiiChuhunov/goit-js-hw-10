import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    div: document.querySelector('.country-info')
};

const DEBOUNCE_DELAY = 300;
refs.input.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));

function onInputValue(e) {
    let inputValue = e.target.value.trim();
    
    cleanInnerHTML();  
    
    if (!inputValue) {
        return;
    }
    
    fetchCountries(inputValue)
    .then(renderCountryCard)
    .catch(onError);
}

function renderCountryCard(country) {
    if (country.length >= 10) {
        onWarning();
        return;
    } else if (country.length === 1) {
        createOneCountry(country);
        return;
    }
        createCounties(country);
}

function createOneCountry(country) {
  let leng = country.map(el => el.languages.map(element => element.name).join(', '));

  const card = country.map(elem =>
    `<div class="card">
        <img class="img" src = ${elem.flags.svg} alt = ${elem.name} width = 50> 
        <span class="text-title">${elem.name}</span>
          <ul>
            <li class="item"> Capital: <span class="text">${elem.capital}</span></li>
            <li class="item"> Population: <span class="text">${elem.population}</span></li>
            <li class="item"> Languages: <span class="text">${leng}</span></li>
          </ul>
    </div>`
  );
  refs.div.innerHTML = card;
}

function createCounties(country) {
  const cards = country.map(elem =>
      `<li><img class="img" src = ${elem.flags.svg} alt = ${elem.name} width = 50> <span class="text">${elem.name}</span> </li>`
  );
  refs.list.innerHTML = cards;
}

function cleanInnerHTML() {
  refs.list.innerHTML = '';
  refs.div.innerHTML = '';
}

const onWarning = () => {
  Notify.info('Too many matches found. Please enter a more specific name', {
    timeout: 2000,
  });
};

export const onError = () => {
  Notify.failure('Oops, there is no country with that name', {
    timeout: 2000,
  });
};