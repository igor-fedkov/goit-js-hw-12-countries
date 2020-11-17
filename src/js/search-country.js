import fetchCountries from'./fetchCountries';
import countriesListTpl from '../templates/countries-list-items.hbs'
import countryDescriptionTpl from '../templates/country-description.hbs'

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

const inputFieldEl = document.querySelector('#name-country-input');
const countriesListEl = document.querySelector('#contries-list');
const countryDescriptionContainer = document.querySelector('#country-description-container');

const debounce = require('lodash.debounce');

let countriesData = [];

inputFieldEl.addEventListener('input', () => fetchCountriesDebounce(inputFieldEl.value));
countriesListEl.addEventListener('click', onListCountrisClick);

const fetchCountriesDebounce = debounce((value) => {
	if (value.length === 0) {
		return;
	}
	fetchCountries(value)
		.then(data => {
			processData(data);
		})
		.catch(error => {
			console.log(error);
		})
}, 500);
	
function processData (data) {
	if (data === undefined) {
			createErrorNotify("Try to change the request text!");
			return;
		}
		if (data.length === 1) {
			clearObjects();
			createCountryDescription(data[0]);
			return;
		}

		if (data.length > 10) {
			createErrorNotify("Too many matches found. Please enter a more specific query!");
		}
		else {
			createListCountries(data);
			countriesData = [...data];
		}
}

const createListCountries = data => {
	const markup = countriesListTpl(data);
	clearObjects();
	countriesListEl.insertAdjacentHTML('beforeend', markup);
};

const createCountryDescription = country => {
	const markup = countryDescriptionTpl(country);
	countryDescriptionContainer.insertAdjacentHTML('beforeend', markup);
}

const clearObjects = () => {
	countriesListEl.innerHTML = '';
	countryDescriptionContainer.innerHTML = '';
}

function createErrorNotify(text) {
  error({
		text: text,
		sticker: false,
		minHeight: '40px',
		maxTextHeight: null,
		closer: false,
  });
}

function onListCountrisClick(event) {
	event.preventDefault();

	const target = event.target;
	if (target.nodeName !== "A") return;

	countryDescriptionContainer.innerHTML = '';

	const country = countriesData.find(({ name }) => name === target.textContent);
	createCountryDescription(country);
}