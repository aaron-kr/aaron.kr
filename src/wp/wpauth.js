const API_ROUTE = 'https://aaron.kr/content/wp-json/jwt-auth/v1/token';

export const wplogin = async (data) => {
	let token;
	// Use fetch() to query the WordPress REST API
	const response = await fetch(API_ROUTE, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			username: data.username,
			password: data.pass
		}),
	});
	const resObj = await response.json();
	token = resObj.token ? resObj.token : null;

	// Set token in sessionStorage
	sessionStorage.setItem('wpToken', token);

	return resObj;
}

export const wplogout = () => {
	// Remove token from sessionStorage
	sessionStorage.removeItem('wpToken');
}