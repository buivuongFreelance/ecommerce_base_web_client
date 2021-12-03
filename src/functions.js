import voca from 'voca';
import is from 'is_js';
import config from './config';
import { format as dateFormat } from 'date-fns';
import formatCurrency from 'currency.js';
import isPast from 'date-fns/isPast';
import { getIdCity as apiGetIdCity } from "./services/model";
import moment from 'moment';


export const calculatePhysicalGrading = (point) => {
	const number = Number(point);
	if (number === 50) {
		return 'A';
	} if (number === 40) {
		return 'B';
	} if (number === 30) {
		return 'C';
	}
	return 'D';
};

export const sortByAttrObj = (sort, list, attr, attrDb) => {
	let listSort = [];
	if (sort[attr] === 'asc') {
		listSort = list.sort((a, b) => {
			if (a[attrDb] < b[attrDb]) {
				return -1;
			}
			if (a[attrDb] > b[attrDb]) {
				return 1;
			}
			return 0;
		});
	} else {
		listSort = list.sort((a, b) => {
			if (a[attrDb] > b[attrDb]) {
				return -1;
			}
			if (a[attrDb] < b[attrDb]) {
				return 1;
			}
			return 0;
		});
	}
	return listSort;
};

export const filterAndSortTransactions = (list, filter, sort) => {
	let isNotFilter = true;

	let listFilter = [];
	let listFilterTransactionCode = [];
	let listFilterPurchaseNumber = [];
	let listFilterDeviceName = [];
	if (filter) {
		if (filter.transactionCode) {
			isNotFilter = false;
			list.map((l) => {
				if (l.transaction_code.toLowerCase().includes(filter.transactionCode.toLowerCase())) {
					listFilterTransactionCode.push(l);
				}
			});
		} else {
			listFilterTransactionCode = Object.assign([], list);
		}
		if (filter.purchaseNumber) {
			isNotFilter = false;
			listFilterTransactionCode.map((l) => {
				if (l.order_number.toLowerCase().includes(filter.purchaseNumber.toLowerCase())) {
					listFilterPurchaseNumber.push(l);
				} else if (l.sale_number.toLowerCase().includes(filter.purchaseNumber.toLowerCase())) {
					listFilterPurchaseNumber.push(l);
				}
			});
		} else {
			listFilterPurchaseNumber = Object.assign([], listFilterTransactionCode);
		}
		if (filter.deviceName) {
			isNotFilter = false;
			listFilterPurchaseNumber.map((l) => {
				if (l.model.toLowerCase().includes(filter.deviceName.toLowerCase())) {
					listFilterDeviceName.push(l);
				}
			});
		} else {
			listFilterDeviceName = Object.assign([], listFilterPurchaseNumber);
		}
		if (filter.status) {
			isNotFilter = false;
			listFilterDeviceName.map((l) => {
				if (l.status.toLowerCase().includes(filter.status.toLowerCase())) {
					listFilter.push(l);
				}
			});
		} else {
			listFilter = Object.assign([], listFilterDeviceName);
		}
	}
	if (isNotFilter) {
		listFilter = list;
	}

	let listSort = Object.assign([], listFilter);
	if (sort) {
		if (sort.deviceName) {
			listSort = sortByAttrObj(sort, listFilter, 'deviceName', 'model');
		} else if (sort.purchaseNumber) {
			listSort = sortByAttrObj(sort, listFilter, 'purchaseNumber', 'sale_number');

		}
		else if (sort.status) {
			listSort = sortByAttrObj(sort, listFilter, 'status', 'status');
		}
		else if (sort.transactionCode) {
			listSort = sortByAttrObj(sort, listFilter, 'transactionCode', 'transaction_code');
		}
		else {
			listSort = sortByAttrObj(sort, listFilter, 'createdAt', 'created_at');
		}
	}

	return listSort;
};

export const arrPercentHigher = (price, originalPrice) => {
	let arr = [];
	const money10 = formatFixedPrice(Number(formatPercentagePriceReverse(price, 10)) + Number(price));
	const money20 = formatFixedPrice(Number(formatPercentagePriceReverse(price, 20)) + Number(price));
	const money50 = formatFixedPrice(Number(formatPercentagePriceReverse(price, 50)) + Number(price));

	if (Number(money10) < Number(originalPrice)) {
		const percentRemain = 10;
		arr.push({ percent: percentRemain, money: money10 });
	}
	if (Number(money20) < Number(originalPrice)) {
		const percentRemain = 20;
		arr.push({ percent: percentRemain, money: money20 });
	}
	if (Number(money50) < Number(originalPrice)) {
		const percentRemain = 50;
		arr.push({ percent: percentRemain, money: money50 });
	}

	return arr;
};

export const arrPercentLower = (price, originalPrice) => {
	let arr = [];
	const p = formatPercentage(price, originalPrice);

	const recommenedArr = [p - 15, p - 10, p - 5];

	recommenedArr.map((reA) => {
		if (formatPercentagePrice(originalPrice, reA) < Number(originalPrice)) {
			arr.push({ percent: reA, money: formatPercentagePrice(originalPrice, reA) });
		}
	});
	return arr;
};

export const arrPercentLowerDefault = (originalPrice) => {
	let arr = [];
	arr.push({ percent: 10, money: formatPercentagePrice(originalPrice, 10) });
	arr.push({ percent: 20, money: formatPercentagePrice(originalPrice, 20) });
	arr.push({ percent: 50, money: formatPercentagePrice(originalPrice, 50) });
	return arr;
};

export const formatPercentagePrice = (value, percent) => {
	const moneyPercent = (Number(value) * percent / 100);
	return formatFixedPrice(Math.abs(Number(value) - Number(moneyPercent)));
};

export const formatPercentagePriceReverse = (value, percent) => {
	const moneyPercent = (Number(value) * percent / 100);
	return formatFixedPrice(Number(moneyPercent));
};

export const formatPercentageMinusPrice = (value, percent) => {
	const moneyPercent = (Number(value) * percent / 100);
	return formatFixedPrice(-Math.abs(Number(moneyPercent)));
};

export const formatPercentageNotRemain = (value, originalValue) => {
	const percent = Number(value) / originalValue * 100;
	return Number(formatFixedPrice(Math.abs(percent)));
}

export const formatPercentageNotRemainReverse = (value, originalValue) => {
	const percent = originalValue / Number(value) * 100;
	return Number(formatFixedPrice(Math.abs(percent)));
}

export const formatPercentage = (value, originalValue) => {
	const money = value - originalValue;
	const percent = money / originalValue * 100;
	return Number(formatFixedPrice(Math.abs(percent)));
}

export const notificationProposal = (str) => {
	let strArr = str.split("&");
	if (strArr.length === 0) return null;
	const type = strArr[0];
	const name = strArr[1];
	return {
		type, name
	}
}

export const notificationOrder = (str) => {
	let strArr = str.split("&");
	if (strArr.length === 0) return null;
	const type = strArr[0];
	const code = strArr[2];
	return {
		type, code
	}
}
export const notificationTimerTransaction = (str) => {
	let strArr = str.split("&");
	if (strArr.length === 0) return null;
	const type = strArr[0];
	const nameDevice = strArr[1];
	const colorDevice = strArr[2];
	const storageDevice = strArr[3];

	return {
		type, nameDevice, colorDevice, storageDevice
	}
}
export const notificationOrderCancel = (str) => {
	let strArr = str.split("&");
	if (strArr.length === 0) return null;
	const type = strArr[0];
	const orderNumber = strArr[1];
	const orderId = strArr[2];

	return {
		type, orderNumber, orderId
	}
}
export const notificationSaleCancel = (str) => {
	let strArr = str.split("&");
	if (strArr.length === 0) return null;
	const type = strArr[0];
	const saleNumber = strArr[1];
	const saleId = strArr[2];

	return {
		type, saleNumber, saleId
	}
}
export const notificationTimerOrderSeller = (str) => {
	let strArr = str.split("&");
	if (strArr.length === 0) return null;
	const type = strArr[0];
	const saleId = strArr[1];
	const saleNumber = strArr[2];

	return {
		type, saleNumber, saleId
	}
}
export const convertMillisecondsToHours = (ms) => {
	let tempTime = moment.duration(ms);
	let hours = tempTime.hours() + tempTime.minutes();
	return hours;
}
export const notificationTransaction = (str) => {
	let strArr = str.split("&");
	if (strArr.length === 0) return null;
	const type = strArr[0];
	const name = strArr[1];
	return {
		type, name
	}
}

export const notificationProposalForDelete = (str) => {
	let strArr = str.split("/");
	if (strArr.length === 0) return null;
	const cartId = strArr[4];
	return {
		cartId
	}
}

export const maxMoney = (number) => {
	return number - 1;
}

export const arrayPayTransaction = (transactions) => {
	let ids = [];
	for (let i = 0; i < transactions.length; i++) {
		if (transactions[i].invoice_info_seller == null) {
			ids.push(transactions[i].device_id)
		}
	}
	return ids;
}
export const comparePayTransaction = (deviceId, arrPay) => {
	if (arrPay.includes(deviceId))
		return false;
	else return true;
}
export const isSameShippingFunc = (sh, bl) => {
	if (!sh || !bl) return false;
	if (sh.first_name === bl.first_name
		&& sh.last_name === bl.last_name
		&& sh.address === bl.address
		&& sh.phone_number === bl.phone_number

	) {
		return true;
	} else {
		return false;
	}
}

export const isValidAddress = (validation_result) => {
	if (!validation_result) return false;
	if (!validation_result.is_valid) return false;
	if (validation_result.messages.length === 0) return true;
	let flag = true;
	for (var i = 0; i < validation_result.messages.length; i++) {
		const message = validation_result.messages[i];
		if (message.source === 'Shippo Address Validator') {
			flag = false;
			break;
		}
	}
	return flag;
};

export const isValidZip = (zip, zipShippo) => {
	if (!zipShippo) return false;
	const arrZipShippo = zipShippo.split('-');
	if (arrZipShippo.length === 0) return false;
	if (arrZipShippo[0] !== zip) return false;
	return true;
};

export const extractNamesFromQuestions = (questions, ids) => {
	let arrNames = [];
	for (var i = 0; i < questions.length; i++) {
		ids.map((id) => {
			if (id === questions[i].id) {
				arrNames.push(questions[i].name);
			}
		});
	}
	return arrNames;
};

export const extractNamesFromCountries = (countries, id) => {
	let country_code = '';
	for (var i = 0; i < countries.length; i++) {
		if (id === countries[i].id) {
			country_code = countries[i].country_code_alpha2;
		}
	}
	return country_code;
};
export const extractNamesFromCity = (cities, id) => {
	let name = '';
	for (var i = 0; i < cities.length; i++) {
		if (id === cities[i].id) {
			name = cities[i].name;
		}
	}
	return name;
};
export const extractErrors = ({ inner }) => {
	return inner.reduce((acc, err) => {
		return { ...acc, [err.path]: err.message };
	}, {});
};

export const extractError = (error, field) => {
	return error.message;
};

export const extractNameFromEmail = (email) => {
	if (email) {
		const arrSplit = email.split('@');
		return voca.truncate(arrSplit[0], 12);
	}
	return 'noname';
};

export const extractDomainFromEmail = (email) => {
	if (email) {
		const arrSplit = email.split('@');
		return arrSplit[1];
	}
	return '@domain.com';
};

export const checkDeviceType = () => {
	let deviceType = config.desktop;
	if (is.mobile() || is.iphone() || is.androidPhone())
		deviceType = config.isMobile;
	else if (is.tablet() || is.ipad() || is.androidTablet())
		deviceType = config.isTablet;

	if (is.touchDevice() && is.desktop()) deviceType = config.isTablet;
	return deviceType;
};

export const displayDateDefault = (date) => {
	return dateFormat(new Date(date), 'dd/MM/yyyy');
};

export const displayDateTime = (date) => {
	return dateFormat(new Date(date), 'dd/MM/yyyy HH:mm:ss');
};
export const formatFixedPrice = (number) => {
	return parseFloat(Number(number)).toFixed(2);
};

export const convertToUsd = (number, currency) => {
	if (currency === config.usd) {
		return Number(number);
	} else if (currency === config.cad) {
		return Number(number);
	}
};
export const convertCurrency = (number, currency, settings) => {
	if (currency === config.usd) {
		return parseFloat(Number(number) * settings.usd_rate).toFixed(2);
	}
};

export const displayCurrency = (number, currency) => {
	//let prefix = number >= 0 ? '+' : '-';
	//if (number === 0) prefix = '';
	if (currency === config.usd) {
		return (
			//	prefix +
			formatCurrency(Math.abs(Number(number)), {
				precision: 2,
				symbol: '',
			}).format()
		);
	} else if (currency === config.cad) {
		const price = Number(number);
		return (
			//prefix +
			formatCurrency(Math.abs(price), {
				precision: 2,
				symbol: '',
			}).format()
		);
	}
};
export const displayCurrencyNoReverse = (number, currency) => {
	//let prefix = number >= 0 ? '+' : '-';
	//if (number === 0) prefix = '';
	if (currency === config.usd) {
		return (
			//		prefix +
			formatCurrency(Math.abs(Number(number)), {
				precision: 2,
				symbol: '',
			}).format()
		);
	} else if (currency === config.cad) {
		const price = Number(number);
		return (
			//	prefix +
			formatCurrency(Math.abs(price), {
				precision: 2,
				symbol: '',
			}).format()
		);
	}
};

export const displayCurrencyTotal = (number, currency) => {
	//let prefix = number >= 0 ? '' : '-';
	//if (number === 0) prefix = '';
	if (currency === config.usd) {
		return (
			//prefix +
			formatCurrency(Math.abs(Number(number)), {
				precision: 2,
				symbol: '',
			}).format()
		);
	} else if (currency === config.cad) {
		const price = Number(number);
		return (
			//prefix +
			formatCurrency(Math.abs(price), {
				precision: 2,
				symbol: '',
			}).format()
		);
	}
};

export const displayCurrencyReverse = (number, currency) => {
	// let prefix = number >= 0 ? '-' : '+';
	// if (number === 0) prefix = '';
	if (currency === config.usd) {
		return (
			// prefix +
			formatCurrency(Math.abs(Number(number)), {
				precision: 2,
				symbol: '',
			}).format()
		);
	} else if (currency === config.cad) {
		const price = Number(number);
		return (
			// prefix +
			formatCurrency(Math.abs(price), {
				precision: 2,
				symbol: '',
			}).format()
		);
	}
};
export const displayCurrencyReverseCart = (number, currency) => {
	let prefix = number >= 0 ? '-' : '';
	if (number === 0) prefix = '';
	if (currency === config.usd) {
		return (
			prefix +
			formatCurrency(Math.abs(Number(number)), {
				precision: 2,
				symbol: '',
			}).format()
		);
	} else if (currency === config.cad) {
		const price = Number(number);
		return (
			prefix +
			formatCurrency(Math.abs(price), {
				precision: 2,
				symbol: '',
			}).format()
		);
	}
};
export const displayCurrencyDb = (number, currency) => {
	if (currency === config.usd) {
		return parseFloat(Number(number)).toFixed(2);
	} else if (currency === config.cad) {
		const price = Number(number);
		return parseFloat(Number(price)).toFixed(2);
	}
};

export const displayCurrencyDbRound = (number, currency) => {
	if (currency === config.usd) {
		return Math.ceil(Number(number));
	} else if (currency === config.cad) {
		const price = Number(number);
		return Math.ceil(Number(price));
	}
};

export const displayMoneyNoCurrencyNoExchange = (price) => {
	return (
		formatCurrency(Math.abs(price), {
			precision: 2,
			symbol: '',
		}).format()
	);
};

export const displayMoneyNoCurrency = (price) => {
	// let prefix = price >= 0 ? '+' : '-';
	// if (price === 0) prefix = '';
	return (
		// prefix +
		formatCurrency(Math.abs(price), {
			precision: 2,
			symbol: '',
		}).format()
	);
};

export const displayExchangeStr = (number) => {
	if (number < 0) {
		return 'device.youPayPrice';
	} else {
		return 'device.youTakePrice';
	}
};

export const displayExchangeBuyerStr = (number) => {
	if (number >= 0) {
		return 'device.youPayPrice';
	} else {
		return 'device.youTakePrice';
	}
};
export const displayProposalBuyerExchangeStr = (number) => {
	if (number >= 0) {
		return 'cart.exchangePay';
	} else {
		return 'cart.exchangeReceive';
	}
};
export const displayOrderPriceStr = (number) => {
	if (number >= 0) {
		return 'cart.mustExchangePay';
	} else {
		return 'cart.willExchangeReceive';
	}
};
export const displayProposalBuyerExchangeStrReverse = (number) => {
	if (number >= 0) {
		return 'cart.exchangeReceive';
	} else {
		return 'cart.exchangePay';
	}
};


export const displayProposalBuyerStrCart = (number) => {
	if (number < 0) {
		return 'device.youPayPrice';
	} else {
		return 'device.youTakePrice';
	}
};
export const displayProposalSellerStrCart = (number) => {
	if (number < 0) {
		return 'device.youTakePrice';
	} else {
		return 'device.youPayPrice';
	}
};


export const displayProposalBuyerStrDevice = (number) => {
	if (number < 0) {
		return 'proposal.offerOffered';
	} else {
		return 'proposal.offerRequested';
	}
};
export const displayProposalSellerStrDevice = (number) => {
	if (number < 0) {
		return 'proposal.offerRequested';
	} else {
		return 'proposal.offerOffered';
	}
};

export const displayProposalBuyerStrOwner = (number) => {
	if (number < 0) {
		return 'proposal.ownerOffered';
	} else {
		return 'proposal.ownerRequested';
	}
};
export const displayProposalSellerStrOwner = (number) => {
	if (number < 0) {
		return 'proposal.ownerRequested';
	} else {
		return 'proposal.ownerOffered';
	}
};

export const displayProposalBuyerStrAccept = (number) => {
	if (number < 0) {
		return 'device.youPayPrice';
	} else {
		return 'device.youTakePrice';
	}
};
export const displayProposalSellerStrAccept = (number) => {
	if (number < 0) {
		return 'device.youTakePrice';
	} else {
		return 'device.youPayPrice';
	}
};
export const displayDisclaimer = (number) => {
	if (number < 0) {
		return 'device.receive';
	} else {
		return 'device.pay';
	}
};

export const isObjectEmpty = (obj) => {
	return JSON.stringify(obj) === '{}' ? true : false;
};

export const convertArrayPhotoSwipe = (images, keyUrl) => {
	let arr = [];
	for (var i = 0; i < images.length; i++) {
		const image = images[i];
		arr.push({
			src: image[keyUrl],
			w: 800,
			h: 700
		});
	}
	return arr;
}

export const convertArrayToObj = (arr, k, v) => {
	if (arr.length === 0) return null;
	const obj = {};
	for (var i = 0; i < arr.length; i++) {
		const key = arr[i][k];
		const value = arr[i][v];
		obj[key] = value;
	}
	return obj;
}
export const isPastDate = (date) => {
	if (isPast(new Date(date))) {
		return true;
	}
	return false;
};
export const commissionPriceBuyer = (number, ratio) => {
	let num = parseFloat(number);
	if (num === 0) {
		return 5;
	}
	if (num < 50) {
		return 5;
	}
	const addi = (ratio * num) / 100;
	return parseFloat(addi).toFixed(2);
}

export const commissionPriceBuyerExchange = (number, ratio) => {
	let num = parseFloat(number);

	if (num === 0) {
		return 5;
	}
	if (Math.abs(num) < 50) {
		return 5;
	}

	const addi = (ratio * Math.abs(num)) / 100;
	return parseFloat(addi).toFixed(2);
}

export const commissionPriceBuyerTotal = (number, dingtoiFee) => {
	let num = parseFloat(number);
	return parseFloat(num + parseFloat(dingtoiFee)).toFixed(2);
}

export const formatTimestamp = (str) => {
	if (str !== '') {
		const date = new Date(str);
		return (
			date.toLocaleString('default', { month: 'long' }) +
			' ' +
			date.getDate() +
			'/' +
			date.getFullYear() +
			' ' +
			date.getHours() +
			':' +
			date.getMinutes() +
			':' +
			date.getSeconds()
		);
	}
	return null;
};


export const millisToMinutesAndSeconds = (millis) => {
	const seconds = ((millis % 60000) / 1000).toFixed(0);
	return seconds;
}

export const msToTime = (duration) => {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	// hours = (hours < 10) ? "0" + hours : hours;
	// minutes = (minutes < 10) ? "0" + minutes : minutes;
	// seconds = (seconds < 10) ? "0" + seconds : seconds;

	// return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	return milliseconds;
}

export const msToSeconds = (milliseconds) => {
	return parseFloat(milliseconds / 1000);
}


export const uppercaseFirstLetter = (s) => {
	if (typeof s !== 'string')
		return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export const postCanadaGetExtractDesc = (str, domain) => {
	return new Promise((resolve, reject) => {
		const arr = str.split(',').map(function (item) {
			return item.trim();
		});

		if (arr.length !== 4) {
			reject();
		}

		const street = arr[0];
		const city = arr[1];
		const state = arr[2];
		const postalCode = arr[3];


		apiGetIdCity(domain, { name: city })
			.then((obj) => {
				resolve({
					street,
					city: obj.id,
					cityName: city,
					state,
					postalCode
				});
			})
			.catch((error) => {
				reject();
			});
	});
};
export const getStrAddressShip = (sh) => {
	const str = sh.address + ', ' + sh.city_name + ', ' + sh.province + ', ' + sh.postal_code;
	return str;
}
export const getStrAddressBill = (bl) => {
	const str = bl.address + ', ' + bl.city_name + ', ' + bl.province + ', ' + bl.postal_code;
	return str;
}

export const censorWord = (str) => str[0] + str[1] + str[2] + '*'.repeat(4) + str.slice(-3);

export const censorDomain = () => '*'.repeat(4);

export const censorEmail = (email) => {
	const arr = email.split('@');
	return `${censorWord(arr[0])}@${censorDomain(arr[1])}`;
};
