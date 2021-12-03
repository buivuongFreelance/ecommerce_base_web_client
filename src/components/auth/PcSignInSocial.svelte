<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { stores, goto } from '@sapper/app';
	import {
		loginWithGoogle as apiLoginWithGoogle,
		loginWithFacebook as apiLoginWithFacebook,
	} from '../../services/user';
	import {
		syncCart as apiSyncCart,
		syncWishlist as apiSyncWishlist,
	} from '../../services/cart';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { auth as authLocal, anonymous } from '../../stores';

	const { session } = stores();
	const { domainAuthWeb, domainCart } = $session;

	let firebase;
	let auth;
	let unsubsribe;

	let isGoogle = false;
	let isFacebook = false;
	let isLoadingGoogle = false;
	let isLoadingFacebook = false;

	onMount(async () => {
		const module = await import('firebase/app');
		await import('firebase/auth');
		firebase = module.default;
		init();
	});

	const syncCart = (token) => {
		return new Promise((resolve, reject) => {
			apiSyncCart(domainCart, { token, anonymous: $anonymous })
				.then(resolve)
				.catch(reject);
		});
	};

	const syncWishlist = (token) => {
		return new Promise((resolve, reject) => {
			apiSyncWishlist(domainCart, { token, anonymous: $anonymous })
				.then(resolve)
				.catch(reject);
		});
	};

	const loginWithGooglePromise = (email) => {
		isLoadingGoogle = true;

		return new Promise((resolve, reject) => {
			apiLoginWithGoogle(domainAuthWeb, { email })
				.then((response) => {
					const {
						data: { obj },
					} = response;
					authLocal.set({ ...obj });
					isLoadingGoogle = false;
					resolve();
				})
				.catch(() => {
					isLoadingGoogle = false;
					reject();
				});
		});
	};

	const loginWithFacebookPromise = (email) => {
		isLoadingFacebook = true;

		return new Promise((resolve, reject) => {
			apiLoginWithFacebook(domainAuthWeb, { email })
				.then((response) => {
					const {
						data: { obj },
					} = response;
					authLocal.set({ ...obj });
					isLoadingFacebook = false;
					resolve();
				})
				.catch(() => {
					isLoadingFacebook = false;
					reject();
				});
		});
	};

	const init = async () => {
		const firebaseConfig = {
			apiKey: 'AIzaSyA3q0_7TAQ9qQxOHjtBuPI_zrg7YDVVem8',
			authDomain: 'dingtoi-login--web.firebaseapp.com',
			databaseURL: 'https://dingtoi-login--web.firebaseio.com',
			projectId: 'dingtoi-login--web',
			storageBucket: 'dingtoi-login--web.appspot.com',
			messagingSenderId: '555772277151',
			appId: '1:555772277151:web:405a4fe37c6a2f38588daa',
			measurementId: 'G-DC2QQMCJFC',
		};
		if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
		auth = firebase.auth();
		unsubsribe = auth.onAuthStateChanged(async (fireUser) => {
			if (fireUser) {
				const { email } = fireUser;
				if (email) {
					try {
						if (isGoogle) {
							isGoogle = false;
							await loginWithGooglePromise(email);
						} else if (isFacebook) {
							isFacebook = false;
							await loginWithFacebookPromise(email);
						}
						await auth.signOut();
						setTimeout(async () => {
							try {
								if ($authLocal) {
									const token = $authLocal.accessToken;
									await syncCart(token);
									await syncWishlist(token);
								}
								values.email = '';
								values.password = '';
								swal.fire({
									toast: true,
									position: 'top-end',
									icon: 'success',
									title: $_('account.loginSuccess'),
									showConfirmButton: false,
									timerProgressBar: true,
									timer: 1500,
									onOpen: (toast) => {
										toast.addEventListener('mouseenter', swal.stopTimer);
										toast.addEventListener('mouseleave', swal.resumeTimer);
									},
								});
								setTimeout(async () => {
									unsubsribe();
									await goto('/');
								}, 300);
							} catch (error) {
								setTimeout(async () => {
									unsubsribe();
									await goto('/');
								}, 300);
							}
						}, 300);
					} catch (error) {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.serverErrorTitle'),
							reverseButtons: true,
							text: $_('error.serverErrorMessage'),
							customClass: {
								icon: 'icon-error',
							},
						});
					}
				} else await goto('/sign-up');
			}
		});
	};

	const loginWithGoogle = async () => {
		isLoadingGoogle = true;
		isGoogle = true;
		const provider = new firebase.auth.GoogleAuthProvider();
		try {
			await auth.signInWithPopup(provider);
			isLoadingGoogle = false;
		} catch (error) {
			isLoadingGoogle = false;
		}
	};

	const loginWithFacebook = async () => {
		isLoadingFacebook = true;
		isFacebook = true;
		const provider = new firebase.auth.FacebookAuthProvider();
		try {
			await auth.signInRedirect(provider);
			isLoadingFacebook = false;
		} catch (error) {
			isLoadingFacebook = false;
		}
	};
</script>

{#if auth && firebase}
	<span class="light-silver f5 fw6">{$_('account.socialLogin')}</span>
	<div class="mt5 flex justify-center">
		{#if isLoadingGoogle}
			<div class="link grow mr1 h-50-px flex items-center justify-center">
				<LoadingDefault color="#e7040f" size="40" />
			</div>
		{:else}
			<div class="link grow mr1 pointer" on:click={loginWithGoogle}>
				<img src="images/google-social.png" alt="google" width="50px" />
			</div>
		{/if}
		{#if isLoadingFacebook}
			<div class="link grow ml1 h-50-px flex items-center justify-center">
				<LoadingDefault color="#3b5998" size="40" />
			</div>
		{:else}
			<div class="link grow ml1 pointer" on:click={loginWithFacebook}>
				<img src="images/facebook-social.png" alt="facebook" width="50px" />
			</div>
		{/if}
	</div>
{/if}
