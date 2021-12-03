import axios from 'axios';
import { auth } from '../stores.js';
import config from '../config.js';

export const checkProposalsTimeout = (domain, { token, listIds }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'checkProposalsTimeout',
				{ listIds },
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

export const listProposal = (domain, { token, limit, offset, filter, sort, deviceId }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'list',
				{ limit, offset, filter, sort, deviceId },
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

export const updateBuyerReplyProposal = (
	domain,
	{
		id,
		cartId,
		buyerSalePrice,
		buyerExchangePrice,
		type,
		exchangeDevices,
		token,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'buyerReply',
				{
					id,
					cartId,
					buyerSalePrice,
					buyerExchangePrice,
					type,
					exchangeDevices,
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

export const updateSellerReplyProposal = (
	domain,
	{
		id,
		cartId,
		buyerSalePrice,
		buyerExchangePrice,
		type,
		exchangeDevices,
		token,
	}
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'sellerReply',
				{
					id,
					cartId,
					buyerSalePrice,
					buyerExchangePrice,
					type,
					exchangeDevices,
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

export const addBuyerCreatedProposal = (
	domain,
	{ cartId, buyerSalePrice, buyerExchangePrice, type, exchangeDevices, token }
) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'buyerCreated',
				{
					cartId,
					buyerSalePrice,
					buyerExchangePrice,
					type,
					exchangeDevices,
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

export const detailProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + id, {
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

export const deleteProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(domain + id, {
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

export const buyerDeleteProposal = (domain, { proposalId, cartId, token }) => {
	return new Promise((resolve, reject) => {
			axios
			.post(
				domain + '/buyerDeleteProposal',
				{
					proposalId, cartId
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

export const sellerDeleteProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(domain + 'seller/' + id, {
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

export const sellerAcceptProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'sellerAccept',
				{ id },
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

export const buyerCancelAcceptProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'buyerCancelAccept',
				{ id },
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

export const sellerCancelProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'sellerCancelAccept',
				{ id },
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

export const sellerRejectProposal = (domain, { id, token, questions }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'sellerReject',
				{ id, questions },
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

export const buyerAcceptProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'buyerAccept',
				{ id },
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

export const sellerCancelReplyProposal = (domain, { id, token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'sellerCancelReply',
				{ id },
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
