const END_POINT_FOR_COUNTRY_SEARCH = "https://restcountries.eu";

function fetchCountries(searchQuery) {
	const url = `${END_POINT_FOR_COUNTRY_SEARCH}/rest/v2/name/${searchQuery}`;

	return fetch(url)
		.then(response => {
			if (response.ok) {
				return Promise.resolve(response);
			}
			return Promise.reject(new Error(response.statusText));
		})
		.then(response => response.json())
		.catch (error => {
			console.log(error);
		});
}

export default fetchCountries;