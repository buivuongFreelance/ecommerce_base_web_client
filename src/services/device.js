import axios from 'axios';
import { auth } from '../stores.js';

export const lowerPrice = (domain, { token, deviceId, price }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'lowerPrice',
				{ deviceId, price },
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

export const listCompareDevices = (domain, { token, anonymous, ids, name }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'compare',
				{ anonymous, ids, name },
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

export const listSearchPopup = (domain, { token, anonymous, name }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'search/list',
				{ anonymous, name },
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

export const selectDeviceWaitingForScan = (domain, { token, deviceId, deviceScanId }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'waitingForScan/selectScan',
				{ deviceId: deviceId, deviceScanId: deviceScanId },
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

export const listScanHistory = (domain, { token, deviceId }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'scan/history',
				{ deviceId: deviceId },
				{
					timeout: 10000,
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

export const listAccountDevicesExclude = (
	domain,
	{ token, limit, offset, filter, exchangeIds }
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'listExclude',
				{ limit, offset, filter, exchangeIds },
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

export const listWishlist = (domain, { token, anonymous, limit, offset }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'wishlist/list',
				{ anonymous, token, limit, offset },
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

export const listSearch = (
	domain,
	{ token, anonymous, limit, offset, sort, filter, name }
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'search',
				{ anonymous, token, limit, offset, sort, filter, name },
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

export const addWishlist = (domain, { token, anonymous, deviceId }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'wishlist/create',
				{ anonymous, token, deviceId },
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

export const deleteWishlist = (domain, { token, anonymous, id }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'wishlist/remove',
				{ anonymous, token, id },
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

export const availableDetail = (domain, { id, token, anonymous }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'available/' + id,
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

export const relatedList = (domain, { id, limit, brand, token, anonymous }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'relatedList/',
				{
					id,
					limit,
					brand,
					anonymous,
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

export const newList = (domain, { token, anonymous, limit, offset, sort, filter }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'newList',
				{ anonymous, token, limit, offset, sort, filter },
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
export const listFeaturedDevices = (domain, { limit, anonymous, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'featuredList',
				{
					limit,
					anonymous,
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

export const deletePostedDevice = (domain, { token, postedId }) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(domain + 'waitingforscan/' + postedId, {
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

export const updateDevicePosted = (
	domain,
	{
		token,
		availableId,
		salePrice,
		exchangePrice,
		exchangeModel,
		accessories,
		warrantyExpireDate,
		isWarranty,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.put(
				domain + 'waitingforscan/' + availableId,
				{
					salePrice,
					exchangePrice,
					exchangeModel,
					accessories,
					warrantyExpireDate,
					isWarranty,
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

export const updateDeviceWaitingForScan = (
	domain,
	{
		token,
		deviceId,
		salePrice,
		exchangePrice,
		exchangeModel,
		accessories,
		warrantyExpireDate,
		isWarranty,
		isImage
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'waitingforscan',
				{
					deviceId,
					salePrice,
					exchangePrice,
					exchangeModel,
					accessories,
					warrantyExpireDate,
					isWarranty,
					isImage: isImage ? true : false,
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

export const listDeviceImage = (domain, { token, deviceId }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + deviceId + '/images', {
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

export const deleteDeviceImage = (domain, { token, deviceId }) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(domain + 'image/' + deviceId, {
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

export const deleteImage = (domain, { url }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'delete',
				{
					name: url,
				},
				{
					timeout: 20000,
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

export const addDeviceImage = (domain, { token, deviceId, url }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'image/add',
				{
					deviceId,
					url,
					main: null,
					thumbnailUrl: null,
					thumbnailPublicId: null,
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

export const checkImei = (domain, { token, imei }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'check/imei',
				{ imei },
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

export const addDevice = (
	domain,
	{ token, modelId, ramId, capacityId, colorId, physicalGrading, imei }
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'add',
				{ modelId, ramId, capacityId, colorId, physicalGrading, imei },
				{
					timeout: 10000,
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

export const editDevice = (
	domain,
	{ token, id, ramId, capacityId, colorId, physicalGrading }
) => {
	return new Promise((resolve, reject) => {
		axios
			.put(
				domain + 'update/' + id,
				{ ramId, capacityId, colorId, physicalGrading },
				{
					timeout: 10000,
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

export const listDevice = (domain, { token, offset, limit, filter, sort }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'list',
				{ offset, limit, filter, sort },
				{
					timeout: 10000,
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

export const detailDevice = (domain, { token, id }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'detail/' + id, {
				timeout: 10000,
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

export const deleteDevice = (domain, { token, id }) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(domain + id, {
				timeout: 10000,
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

export const listDeviceByDeviceTags = (domain, { token, deviceTags }) => {
	const ids = [];
	deviceTags.map((deviceTag) => {
		ids.push(deviceTag.model_id);
	});

	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'tags/listDevice',
				{ ids },
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

export const listDeviceTags = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(
				domain + 'tags',
				{
					timeout: 10000,
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

export const addDeviceTag = (domain, { token, modelId }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'tags',
				{ modelId },
				{
					timeout: 10000,
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

export const removeDeviceTag = (domain, { token, id }) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(
				domain + 'tags/' + id,
				{
					timeout: 10000,
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
