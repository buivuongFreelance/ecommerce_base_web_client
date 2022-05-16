import axios from 'axios';
import { auth } from '../stores.js';

export const testBasicScanModel = (domain, { token, deviceId }) => {

	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'test/basicScan', { deviceId }, {
				timeout: 50000,
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

export const getAmountNotifications = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'notifications/all', {
				timeout: 50000,
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

export const getFaqs = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'faqs', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const removeNotification = (
	domain,
	{ token, id }
) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(
				domain + 'notification/' + id,
				{
					timeout: 50000,
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

export const updateNotificationRead = (
	domain,
	{ token, id }
) => {
	return new Promise((resolve, reject) => {
		axios
			.put(
				domain + 'notification/' + id,
				null,
				{
					timeout: 50000,
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

export const listNotification = (domain, { token, offset, limit }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'notifications',
				{ offset, limit },
				{
					timeout: 50000,
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
export const removeAllNotification = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(
				domain + 'notificationAll',
				{
					timeout: 50000,
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
export const listQuestionSellerReject = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'questions/sellerReject', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const listQuestionBuyerReject = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'questions/buyerReject', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const listSettings = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'settings/listAll', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const listProvince = (domain, { country_id }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'province/list', {
				countryId: country_id
			}, {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const getCountry = (domain, { id }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'country/' + id, {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const listCountries = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'countries/listAll', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				const newList = [];

				obj.map((l) => {
					newList.push(l);
					// if(l.name === 'Canada'){
					// 	newList.push(l);
					// }

				});

				resolve(newList);
			})
			.catch(reject);
	});
};
export const listState = (domain, { countryId }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'states/byCountry', { countryId }, {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const listCity = (domain, { countryId, stateCode }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'cities/byStateAndCountry', { countryId, stateCode }, {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const getIdCity = (domain, { name }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'city/byName/' + name, {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const listAccessories = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'accessonies/listAll', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const listModel = (domain, { offset, limit, filter, brandId }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'lists',
				{ offset, limit, filter, brandId },
				{
					timeout: 50000,
				}
			)
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const listModelExclude = (domain, { offset, limit, filter, brandId, deviceTags }) => {
	const ids = [];
	deviceTags.map((deviceTag) => {
		ids.push(deviceTag.model_id);
	});
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'listsExclude',
				{ offset, limit, filter, brandId, ids },
				{
					timeout: 50000,
				}
			)
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const listBrand = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'brands/all', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const listCapacity = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'capacities/all', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const listRam = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'rams/all', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
export const listColor = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'colors/all', {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};
