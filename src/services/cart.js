import axios from 'axios';
import { auth } from '../stores.js';

export const confirmCart = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'confirm', null, {
				timeout: 20000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch((error) => {
				let flag = true;
				if (error.response) {
					const { status } = error.response;
					if (status === 401) {
						flag = false;
						auth.set(null);
						location.reload();
					}
				}
				if (flag) {
					reject(error);
				}
			});
	});
};

export const listCart = (domain, { token, anonymous }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'list',
				{ anonymous },
				{
					timeout: 20000,
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch((error) => {
				let flag = true;
				if (error.response) {
					const { status } = error.response;
					if (status === 401) {
						flag = false;
						auth.set(null);
						location.reload();
					}
				}
				if (flag) {
					reject(error);
				}
			});
	});
};

export const addToCart = (domain, { deviceId, token, anonymous, type }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + '/',
				{
					deviceId,
					anonymous,
					type
				},
				{
					timeout: 20000,
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch((error) => {
				let flag = true;
				if (error.response) {
					const { status } = error.response;
					if (status === 401) {
						flag = false;
						auth.set(null);
						location.reload();
					}
				}
				if (flag) {
					reject(error);
				}
			});
	});
};

export const removeCart = (domain, { id, token, anonymous }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'delete',
				{ id, anonymous },
				{
					timeout: 20000,
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch((error) => {
				let flag = true;
				if (error.response) {
					const { status } = error.response;
					if (status === 401) {
						flag = false;
						auth.set(null);
						location.reload();
					}
				}
				if (flag) {
					reject(error);
				}
			});
	});
};

export const syncCart = (domain, { token, anonymous }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'anonymous/sync',
				{ anonymous },
				{
					timeout: 20000,
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch((error) => {
				let flag = true;
				if (error.response) {
					const { status } = error.response;
					if (status === 401) {
						flag = false;
						auth.set(null);
						location.reload();
					}
				}
				if (flag) {
					reject(error);
				}
			});
	});
};

export const syncWishlist = (domain, { token, anonymous }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'wishlist/anonymous/sync',
				{ anonymous },
				{
					timeout: 20000,
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch((error) => {
				let flag = true;
				if (error.response) {
					const { status } = error.response;
					if (status === 401) {
						flag = false;
						auth.set(null);
						location.reload();
					}
				}
				if (flag) {
					reject(error);
				}
			});
	});
};
