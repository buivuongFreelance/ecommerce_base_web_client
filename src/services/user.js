import axios from 'axios';
import { auth } from '../stores.js';

export const wallet = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'wallet', {
				timeout: 50000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(error => {
				let flag = true;
				if (flag) {
					reject(error);
				}
			});
	});
}

export const resetPassword = (domain, { token, password }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'resetPassword', {
				password,
				token,
			}, {
				timeout: 50000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(error => {
				let flag = true;
				if (flag) {
					reject(error);
				}
			});
	});
}

export const changePassword = (domain, { token, currentPassword, newPassword }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'changePassword', {
				currentPassword,
				newPassword
			}, {
				timeout: 50000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(error => {
				let flag = true;
				if (flag) {
					reject(error);
				}
			});
	});
}

export const createAndUpdateAccount = (domain, { token, values }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'info/createAndUpdate', {
				firstName: values.firstName,
				lastName: values.lastName,
				idNumber: values.idNumber,
				dob: values.dob,
				gender: values.gender,
				countryId: values.country,
				postalCode: values.postalCode,
				address: values.address,
				province: values.province
			}, {
				timeout: 50000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(error => {
				let flag = true;
				// if (error.response) {
				// 	const { status } = error.response;
				// 	if (status === 401) {
				// 		flag = false;
				// 		auth.set(null);
				// 		location.reload();
				// 	}
				// }
				if (flag) {
					reject(error);
				}
			});
	});
}
export const detailedAccount = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.get(domain + 'info/detail', {
				timeout: 50000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(error => {
				let flag = true;
				// if (error.response) {
				// 	const { status } = error.response;
				// 	if (status === 401) {
				// 		flag = false;
				// 		auth.set(null);
				// 		location.reload();
				// 	}
				// }
				if (flag) {
					reject(error);
				}
			});
	});
}
export const registerTracing = (domain) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'loginTracing', null, {
				timeout: 50000,
			})
			.then((response) => {
				const { obj } = response.data;
				resolve(obj);
			})
			.catch(reject);
	});
};

export const checkEmail = (domain, { email }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'emailChecking',
				{ email },
				{
					timeout: 50000,
				}
			)
			.then(resolve)
			.catch(reject);
	});
};

export const register = (domain, { email, password }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'registration',
				{ email, password },
				{
					timeout: 50000,
				}
			)
			.then(resolve)
			.catch(reject);
	});
};

export const forgotPassword = (domain, { email }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'forgotPassword',
				{ email },
				{
					timeout: 50000,
				}
			)
			.then(resolve)
			.catch(reject);
	});
};

export const login = (domain, { email, password }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'login',
				{ email, password },
				{
					timeout: 50000,
				}
			)
			.then(resolve)
			.catch(reject);
	});
};

export const loginWithGoogle = (domain, { email }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'loginGmail',
				{ email },
				{
					timeout: 50000,
				}
			)
			.then(resolve)
			.catch(reject);
	});
};

export const loginWithFacebook = (domain, { email }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				domain + 'loginFacebook',
				{ email },
				{
					timeout: 50000,
				}
			)
			.then(resolve)
			.catch(reject);
	});
};

export const logout = (domain, { token }) => {
	return new Promise((resolve, reject) => {
		axios
			.post(domain + 'logout', null, {
				timeout: 50000,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then(resolve)
			.catch((error) => {
				let flag = true;
				if (error.response) {
					const { status } = error.response;
					if (status == 401) {
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
