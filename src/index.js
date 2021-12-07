import './css/styles.css';
import 'animate.css'; 
import countriesCard from './templates/countries.hbs';
import countriesSearch from './templates/countries-flags.hbs';
import fetchCountries from './fetchCountries.js';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300; 

const refs = {
    inputSearchBox: document.getElementById('search-box'),
    countryListUl: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.inputSearchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    e.preventDefault();

    const searchQuery = refs.inputSearchBox.value.trim();

    if (searchQuery === '') {
        return refs.countryInfo.innerHTML = '', refs.countryListUl.innerHTML = '';
    } 
 
    fetchCountries(searchQuery)
        .then(renderCountriesCard)
        .catch(onFetchError);
}
 
function renderCountriesCard(countries) {
    const markup = countriesCard(countries);
    const markupSearch = countriesSearch(countries);
   
    console.log(countries.length) 
 
    if (countries.length === 1) {
        refs.countryInfo.innerHTML = markup;
        refs.countryListUl.innerHTML = '';
       
    } else if (10 < countries.length > 1) {
        
        refs.countryListUl.innerHTML = markupSearch;
        refs.countryInfo.innerHTML = '';

    } else if(countries.length > 10 && refs.inputSearchBox.value.trim() !== ''){
        onFetchInfo();
    }  else {
        refs.countryListUl.innerHTML = markupSearch;
    } 
}

function onFetchError() {
    Notiflix.Report.failure(
        'Failure',
        "Oops, there is no country with that name.",
        'Okay',
    );
} 
    
function onFetchInfo() {
    Notiflix.Report.warning(
  'Warning',
  "Too many matches found. Please enter a more specific name.",
  'Okay',
);
}
