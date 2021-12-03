import axios from 'axios';
import { getStrAddressBill, getStrAddressShip } from '../functions.js';
import { auth } from '../stores.js';

export const apiTestScanBuyerReject = (domain, { token, transactionCode }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'test/scanBuyerReject', { transactionCode }, {
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

export const apiTestScanBuyerConfirm = (domain, { token, transactionCode }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'test/scanBuyerConfirm', { transactionCode }, {
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

export const apiTestScanSellerConfirm = (domain, { token, transactionCode }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'test/scanSellerConfirm', { transactionCode }, {
				timeout: 20000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				const sh = Object.assign({}, obj.shipping);
				const bl = Object.assign({}, obj.billing);
				obj.shipping.address = getStrAddressShip(sh);
				obj.billing.address = getStrAddressBill(bl);
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

export const getShippingAndBilling = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'shippingAndBilling', {
				timeout: 20000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				const sh = Object.assign({}, obj.shipping);
				const bl = Object.assign({}, obj.billing);
				obj.shipping.address = getStrAddressShip(sh);
				obj.billing.address = getStrAddressBill(bl);
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

export const getPaymentHistory = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'paymentHistory', {
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

export const createShipping = (
	domain,
	{
		token,
		firstName,
		lastName,
		address,
		city,
		postalCode,
		country,
		province,
		phoneNumber,
		extension,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'shipping/create',
				{
					firstName,
					lastName,
					address,
					city,
					postalCode,
					country,
					phoneNumber,
					province,
					extension,
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

export const updateShipping = (
	domain,
	{
		token,
		id,
		firstName,
		lastName,
		address,
		city,
		postalCode,
		country,
		province,
		phoneNumber,
		extension,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.put(
				domain + 'shipping/update/' + id,
				{
					firstName,
					lastName,
					address,
					city,
					postalCode,
					country,
					phoneNumber,
					province,
					extension,
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

export const createBilling = (
	domain,
	{
		token,
		firstName,
		lastName,
		address,
		city,
		postalCode,
		country,
		phoneNumber,
		extension,
		province,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'billing/create',
				{
					firstName,
					lastName,
					address,
					city,
					postalCode,
					country,
					phoneNumber,
					extension,
					province
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

export const updateBilling = (
	domain,
	{
		token,
		id,
		firstName,
		lastName,
		address,
		city,
		postalCode,
		country,
		phoneNumber,
		province,
		extension,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.put(
				domain + 'billing/update/' + id,
				{
					firstName,
					lastName,
					address,
					city,
					postalCode,
					country,
					phoneNumber,
					province,
					extension,
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

export const createOrder = (
	domain,
	{
		token,
		listCart,
		listConfirm,
		firstNameShip,
		lastNameShip,
		addressShip,
		cityShip,
		provinceShip,
		postalCodeShip,
		phoneShip,
		countryShip,
		firstNameBill,
		lastNameBill,
		addressBill,
		cityBill,
		provinceBill,
		postalCodeBill,
		phoneBill,
		countryBill,
		totalShipping,
		totalCheckout,
		cardNumber,
		cardName,
		cvc,
		exp,
		amountInfo,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'order/create',
				{
					token,
					listCart: listCart,
					listConfirm,
					firstNameShip,
					lastNameShip,
					addressShip,
					cityShip,
					provinceShip,
					postalCodeShip,
					phoneShip,
					countryShip,
					firstNameBill,
					lastNameBill,
					addressBill,
					cityBill,
					provinceBill,
					postalCodeBill,
					phoneBill,
					countryBill,
					totalShipping,
					totalCheckout,
					cardNumber,
					cardName,
					cvc,
					exp,
					amountInfo,
				},
				{
					timeout: 100000,
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

export const confirmOrder = (
	domain,
	{
		token,
		listCart,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'order/confirm',
				{
					token,
					listCart: listCart,
				},
				{
					timeout: 100000,
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

export const listOrder = (domain, { token, limit, offset, sort, filter }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'orders',
				{ token, limit, offset, sort, filter },
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

export const detailOrder = (domain, { token, orderId }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(
				domain + 'order/' + orderId,
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
export const detailTransaction = (domain, { token, id }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(
				domain + 'transaction/' + id,
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
export const detailSale = (domain, { token, id }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(
				domain + 'orderSeller/' + id,
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
export const listOrderSelling = (domain, { token, limit, offset, filter, sort }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'order/sellings',
				{ token, limit, offset, filter, sort },
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
export const listTransactionsSeller = (domain, { token, limit, offset, filter, sort }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'transactions/seller',
				{ token, limit, offset, filter, sort },
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
export const validationAddress = (domain, { token, keyword }) => {
	return new Promise((resolve, reject) => {

		const params = new URLSearchParams();
		params.append('Key', token);
		params.append('SearchTerm', keyword);
		axios
			.post(
				domain + 'AutoComplete/v1.00/json3.ws',
				params,
				{
					timeout: 20000,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				}
			)
			.then((response) => {
				const { Items } = response.data;
				resolve(Items);
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
export const createPickup = (
	domain,
	{
		token,
		id,
		objPickup
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'transactions/pickup/create',
				{
					id,
					objPickup
				},
				{
					timeout: 100000,
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
export const createPickupPurchase = (
	domain,
	{
		token,
		id,
		objPickup
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'transactions/pickup/purchase/create',
				{
					id,
					objPickup
				},
				{
					timeout: 100000,
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
export const shipments = (domain, { token, address_from, address_to, parcels }) => {
	const tempAddressTo = {
		city: "Dallas",
		country: "US",
		email: "hiepnguyen@gmail.com",
		name: "Vnng Company",
		phone: "2232233232",
		state: "TX",
		street1: "5907 Wisdom Creek Dr",
		zip: "75249"
	}
	const tempAddressFrom = {
		city: "Mobile",
		country: "US",
		email: "hiepnguyen@gmail.com",
		name: "Vnng Company",
		phone: "2232233232",
		state: "AL",
		street1: "856 S Dearborn St",
		zip: "36603"
	}
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'shipments',
				{
					"address_from": tempAddressFrom,
					"address_to": tempAddressTo,
					"parcels": parcels,
					"async": false
				},
				{
					headers: {
						Authorization: 'ShippoToken ' + token,
					},
				}
			)
			.then((response) => {
				const { obj } = response.data;
				if (response.data.rates) {
					const rates = response.data.rates;
					rates.map((rate) => {
						rate.provider = 'Canada Post';
					});
				}
				resolve(response);
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
export const sellerPayShipping = (
	domain,
	{
		token,
		orderId,
		selectedRate,
		shipping,
		billing,
		cardNumber,
		cardName,
		cvc,
		exp,
		amountCad,
		amountInfo
	}
) => {
	return new Promise((resolve, reject) => {
		selectedRate.amountCad = amountCad;
		axios
			.post(
				domain + 'order/sellerPayShipping',
				{
					token,
					orderId,
					selectedRate,
					shipping,
					billing,
					cardNumber,
					cardName,
					cvc,
					exp,
					amountInfo
				},
				{
					timeout: 100000,
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
export const submitPasscode = (
	domain,
	{
		token,
		passcode,
		id
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'passcodeSubmit',
				{
					token,
					passcode,
					id
				},
				{
					timeout: 100000,
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
export const buyerReceived = (
	domain,
	{
		token,
		id
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'buyerReceived',
				{
					token,
					id
				},
				{
					timeout: 100000,
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
export const shippingFakeStatus = (
	domain,
	{
		token,
		id,
		status,
		isExchange
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'shipping/fakeStatus',
				{
					id, status, isExchange
				},
				{
					timeout: 100000,
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
export const transactionPickup = (
	domain,
	{
		token,
		id
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'transactions/pickup',
				{
					token,
					id
				},
				{
					timeout: 100000,
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
export const transactionPickupPurchase = (
	domain,
	{
		token,
		id
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'transactions/purchase/pickup',
				{
					token,
					id
				},
				{
					timeout: 100000,
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
