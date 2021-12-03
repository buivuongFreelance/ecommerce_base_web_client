<script>
	import { _ } from 'svelte-i18n';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import { stores, goto } from '@sapper/app';
	import {
		auth,
		anonymous,
		cartChanged,
		compareItemOne,
		compareItemTwo,
		favoriteChanged,
	} from '../../stores';
	import {
		availableDetail,
		addWishlist as apiAddWishlist,
		deleteWishlist as apiDeleteWishlist,
	} from '../../services/device';
	import { onMount, onDestroy } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';

	import PcModalSelectAddToCart from '../modal/PcModalSelectAddToCart.svelte';
	import { addToCart as apiAddToCart } from '../../services/cart';
	import PcSearchCompareDropdown from '../dropdown/PcSearchCompareDropdown.svelte';
	import PcCompareItem from './PcCompareItem.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	const { session, page } = stores();
	const { domainDevice, domainCart } = $session;

	let isLoading = false;
	let isServerError = false;
	let isOpenSearch = false;
	let isOpenSearch2 = false;
	let y = 0;
	let oldY = 0;
	let val = '';
	let val2 = '';
	let timer;
	let inputEle;
	let inputEle2;
	let top,
		left = 0;
	let item = {};

	let selectedItemAddToCart = {};
	let others = [];
	let others1 = [];
	let others2 = [];

	let isOpenlSelectAddToCart = false;

	let typeAdd = config.sell;
	let isLoadingCart = false;
	let ids = [];
	let mounted = false;

	let isLoadingFavorite = false;
	let isLoadingFavorite1 = false;
	let isLoadingFavorite2 = false;

	$: {
		if (y !== oldY) {
			oldY = y;
			if (isOpenSearch) {
				isOpenSearch = false;
			}
			if (isOpenSearch2) {
				isOpenSearch2 = false;
			}
		}
		if (isOpenlSelectAddToCart) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (mounted) {
				let id = $page.params.id;
				getDetail(id).then((it) => {
					item = it;
					// if (item && item.images) {
					// 	if (item.other_detail) {
					// 		others = [];
					// 		let jsonData = item.other_detail;
					// 		for (var key in jsonData) {
					// 			if (jsonData[key]) {
					// 				others.push({ key: key, value: jsonData[key] });
					// 			}
					// 		}
					// 	}
					// }
				});
				if ($compareItemOne) {
					getDetail($compareItemOne.id).then((it) => {
						compareItemOne.set(it);
						// if ($compareItemOne && item.images) {
						// 	if ($compareItemOne.other_detail) {
						// 		others = [];
						// 		let jsonData = $compareItemOne.other_detail;
						// 		for (var key in jsonData) {
						// 			if (jsonData[key]) {
						// 				others.push({ key: key, value: jsonData[key] });
						// 			}
						// 		}
						// 	}
						// }
					});
				}
				if ($compareItemTwo) {
					getDetail($compareItemTwo.id).then((it) => {
						compareItemTwo.set(it);
						// if ($compareItemTwo && $compareItemTwo.images) {
						// 	if ($compareItemTwo.other_detail) {
						// 		others = [];
						// 		let jsonData = $compareItemTwo.other_detail;
						// 		for (var key in jsonData) {
						// 			if (jsonData[key]) {
						// 				others.push({ key: key, value: jsonData[key] });
						// 			}
						// 		}
						// 	}
						// }
					});
				}
			}
		}
	});

	const unsubscribeFavoriteChanged = favoriteChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					let id = $page.params.id;
					getDetail(id).then((it) => {
						item = it;
					});
				}
				if ($compareItemOne) {
					getDetail($compareItemOne.id).then((it) => {
						compareItemOne.set(it);
					});
				}
				if ($compareItemTwo) {
					getDetail($compareItemTwo.id).then((it) => {
						compareItemTwo.set(it);
					});
				}
			}
		}
	);

	onMount(async () => {
		try {
			let id = $page.params.id;
			item = await getDetail(id);
			mounted = true;

			if (item && item.images) {
				if (item.other_detail) {
					others = [];
					let jsonData = item.other_detail;
					for (var key in jsonData) {
						if (jsonData[key]) {
							others.push({ key: key, value: jsonData[key] });
						}
					}
				}
			}
		} catch (error) {}
	});

	onDestroy(() => {
		unsubscribeFavoriteChanged();
		unsubscribeCartChanged();
		compareItemOne.set(null);
		compareItemTwo.set(null);
	});

	const getDetail = (id) => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			availableDetail(domainDevice, { id, token, anonymous: $anonymous })
				.then((obj) => {
					obj.device_id = obj.id;
					if (!ids.includes(obj.id)) {
						ids.push(obj.id);
						ids = ids;
					}
					isServerError = false;
					isLoading = false;
					if (obj) {
						if (obj.cart_id) {
							typeAdd = obj.cart_type;
						}
					}
					if (obj.accessories) {
						let jsonData = obj.accessories;
						obj.accessoriesReal = [];
						for (var key in jsonData) {
							if (jsonData[key]) {
								obj.accessoriesReal.push({ key: key, value: jsonData[key] });
							}
						}
					}
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};
	const debounce = (v) => {
		isOpenSearch = false;
		clearTimeout(timer);
		timer = setTimeout(() => {
			val = v;
			if (val.length >= 1) {
				handleOpenPopup();
			}
		}, 750);
	};
	const debounce2 = (v) => {
		isOpenSearch2 = false;
		clearTimeout(timer);
		timer = setTimeout(() => {
			val2 = v;
			if (val2.length >= 1) {
				handleOpenPopup2();
			}
		}, 750);
	};

	const handleOpenPopup = () => {
		const boundingClientRect = inputEle.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		left = parseFloat(boundingClientRect.x);
		isOpenSearch = true;
	};
	const handleOpenPopup2 = () => {
		const boundingClientRect = inputEle2.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		left = parseFloat(boundingClientRect.x);
		isOpenSearch2 = true;
	};

	const handleSelectAddToCart = (it) => {
		selectedItemAddToCart = it;
		isOpenlSelectAddToCart = true;
	};
	const handleSelectAddToCartOne = () => {
		selectedItemAddToCart = $compareItemOne;
		isOpenlSelectAddToCart = true;
	};
	const handleSelectAddToCartTwo = () => {
		selectedItemAddToCart = $compareItemTwo;
		isOpenlSelectAddToCart = true;
	};

	const addToCart = (it, typeAdd) => {
		return new Promise((resolve, reject) => {
			isLoadingCart = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddToCart(domainCart, {
				deviceId: it.id,
				token,
				anonymous: $anonymous,
				type: typeAdd,
			})
				.then((obj) => {
					isLoadingCart = false;
					resolve(obj);
				})
				.catch((error) => {
					isLoadingCart = false;
					if (typeAdd === null) {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.formError'),
							text: $_('error.chooseSellOrExchange'),
							reverseButtons: true,
							customClass: {
								icon: 'icon-error',
							},
						});
					} else {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.serverErrorTitle'),
							text: $_('error.serverErrorMessage'),
							reverseButtons: true,
							customClass: {
								icon: 'icon-error',
							},
						});
					}
					reject(error);
				});
		});
	};
	const addToCartOne = (typeAdd) => {
		return new Promise((resolve, reject) => {
			isLoadingCart = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddToCart(domainCart, {
				deviceId: $compareItemOne.id,
				token,
				anonymous: $anonymous,
				type: typeAdd,
			})
				.then((obj) => {
					isLoadingCart = false;
					resolve(obj);
					// compareItemOne.set(null);
				})
				.catch((error) => {
					isLoadingCart = false;
					if (typeAdd === null) {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.formError'),
							text: $_('error.chooseSellOrExchange'),
							reverseButtons: true,
							customClass: {
								icon: 'icon-error',
							},
						});
					} else {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.serverErrorTitle'),
							text: $_('error.serverErrorMessage'),
							reverseButtons: true,
							customClass: {
								icon: 'icon-error',
							},
						});
					}
					reject(error);
				});
		});
	};
	const addToCartTwo = (typeAdd) => {
		return new Promise((resolve, reject) => {
			isLoadingCart = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddToCart(domainCart, {
				deviceId: $compareItemTwo.id,
				token,
				anonymous: $anonymous,
				type: typeAdd,
			})
				.then((obj) => {
					isLoadingCart = false;
					resolve(obj);
					// compareItemTwo.set(null);
				})
				.catch((error) => {
					isLoadingCart = false;
					if (typeAdd === null) {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.formError'),
							text: $_('error.chooseSellOrExchange'),
							reverseButtons: true,
							customClass: {
								icon: 'icon-error',
							},
						});
					} else {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.serverErrorTitle'),
							text: $_('error.serverErrorMessage'),
							reverseButtons: true,
							customClass: {
								icon: 'icon-error',
							},
						});
					}
					reject(error);
				});
		});
	};

	const handleAddToCart = async (item, typeAdd) => {
		try {
			await addToCart(item, typeAdd);
			cartChanged.update((n) => n + 1);
		} catch (error) {}
	};
	const handleAddToCartOne = async (typeAdd) => {
		try {
			await addToCartOne(typeAdd);
			cartChanged.update((n) => n + 1);
		} catch (error) {}
	};
	const handleAddToCartTwo = async (typeAdd) => {
		try {
			await addToCartTwo(typeAdd);
			cartChanged.update((n) => n + 1);
		} catch (error) {}
	};

	const handleSelected = async (it) => {
		if (!ids.includes(it.id)) {
			ids.push(it.id);
			ids = ids;
			const detail = await getDetail(it.id);
			compareItemOne.set(detail);
			isOpenSearch = false;
			others1 = [];
			if ($compareItemOne) {
				if ($compareItemOne.other_detail) {
					let jsonData = $compareItemOne.other_detail;

					for (var key in jsonData) {
						if (jsonData[key]) {
							others1.push({ key: key, value: jsonData[key] });
						}
					}
				}
			}
		}
	};
	const handleSelected2 = async (it) => {
		if (!ids.includes(it.id)) {
			ids.push(it.id);
			ids = ids;
			const detail = await getDetail(it.id);
			compareItemTwo.set(detail);
			isOpenSearch2 = false;
			others2 = [];
			if ($compareItemTwo) {
				if ($compareItemTwo.other_detail) {
					let jsonData = $compareItemTwo.other_detail;
					for (var key in jsonData) {
						if (jsonData[key]) {
							others2.push({ key: key, value: jsonData[key] });
						}
					}
				}
			}
		}
	};
	const handleRemoveCompare1 = () => {
		const index = ids.indexOf($compareItemOne.id);
		ids.splice(index, 1);
		ids = ids;
		compareItemOne.set(null);
	};
	const handleRemoveCompare2 = () => {
		const index = ids.indexOf($compareItemTwo.id);
		ids.splice(index, 1);
		ids = ids;

		compareItemTwo.set(null);
	};

	const goToDetail = () => {
		if (item) {
			goto('device/' + item.id);
		}
	};
	const goToDetail1 = () => {
		if ($compareItemOne) {
			goto('device/' + $compareItemOne.id);
		}
	};
	const goToDetail2 = () => {
		if ($compareItemTwo) {
			goto('device/' + $compareItemTwo.id);
		}
	};

	//-----------------------------------------------------------
	// HANDLE FAVORITE
	//-----------------------------------------------------------
	const handleAddToFavourite = async () => {
		try {
			await addWishlist();
		} catch (error) {}
	};
	const addWishlist = () => {
		return new Promise((resolve, reject) => {
			isLoadingFavorite = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddWishlist(domainDevice, {
				deviceId: item.id,
				token,
				anonymous: $anonymous,
			})
				.then((obj) => {
					isLoadingFavorite = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingFavorite = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
	const handleDeleteFavorite = async () => {
		try {
			await deleteWishlist();
		} catch (error) {}
	};
	const deleteWishlist = () => {
		return new Promise((resolve, reject) => {
			isLoadingFavorite = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiDeleteWishlist(domainDevice, {
				id: item.wishlist_id,
				token,
				anonymous: $anonymous,
			})
				.then((obj) => {
					isLoadingFavorite = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingFavorite = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
	//-----------------------------------------------------------
	// HANDLE FAVORITE ONE
	//-----------------------------------------------------------
	const handleAddToFavourite1 = async () => {
		try {
			await addWishlist1();
		} catch (error) {}
	};
	const addWishlist1 = () => {
		return new Promise((resolve, reject) => {
			isLoadingFavorite1 = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddWishlist(domainDevice, {
				deviceId: $compareItemOne.id,
				token,
				anonymous: $anonymous,
			})
				.then((obj) => {
					isLoadingFavorite1 = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingFavorite1 = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
	const handleDeleteFavorite1 = async () => {
		try {
			await deleteWishlist1();
		} catch (error) {}
	};
	const deleteWishlist1 = () => {
		return new Promise((resolve, reject) => {
			isLoadingFavorite1 = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiDeleteWishlist(domainDevice, {
				id: $compareItemOne.wishlist_id,
				token,
				anonymous: $anonymous,
			})
				.then((obj) => {
					isLoadingFavorite1 = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingFavorite1 = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
	//-----------------------------------------------------------
	// HANDLE FAVORITE TWO
	//-----------------------------------------------------------
	const handleAddToFavourite2 = async () => {
		try {
			await addWishlist2();
		} catch (error) {}
	};
	const addWishlist2 = () => {
		return new Promise((resolve, reject) => {
			isLoadingFavorite2 = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddWishlist(domainDevice, {
				deviceId: $compareItemTwo.id,
				token,
				anonymous: $anonymous,
			})
				.then((obj) => {
					isLoadingFavorite2 = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingFavorite2 = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
	const handleDeleteFavorite2 = async () => {
		try {
			await deleteWishlist2();
		} catch (error) {}
	};
	const deleteWishlist2 = () => {
		return new Promise((resolve, reject) => {
			isLoadingFavorite2 = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiDeleteWishlist(domainDevice, {
				id: $compareItemTwo.wishlist_id,
				token,
				anonymous: $anonymous,
			})
				.then((obj) => {
					isLoadingFavorite2 = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingFavorite2 = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
</script>

<svelte:window bind:scrollY={y} />

{#if isOpenSearch}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal onClick={() => (isOpenSearch = false)} />
		<PcSearchCompareDropdown {top} {left} {ids} name={val} {handleSelected} />
	</Portal>
{/if}
{#if isOpenSearch2}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal onClick={() => (isOpenSearch2 = false)} />
		<PcSearchCompareDropdown
			{top}
			{left}
			{ids}
			name={val2}
			handleSelected={handleSelected2}
		/>
	</Portal>
{/if}
{#if isOpenlSelectAddToCart}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal
			type="modal"
			onClick={() => (isOpenlSelectAddToCart = false)}
		/>
		<PcModalSelectAddToCart
			onClose={() => (isOpenlSelectAddToCart = false)}
			item={selectedItemAddToCart}
			bind:typeAdd
		/>
	</Portal>
{/if}

{#if isServerError}
	<p class="red f4 tc mv6">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader width="1170" height="300" uniqueKey="compare">
		<rect x="0" y="0" rx="5" ry="5" width="1170" height="300" />
	</ContentLoader>
{:else}
	<h3 class="mb5">
		{item.model}

		{item.capacity}
		{$_('label.GB')}

		{item.color}
	</h3>
	<div class="row flex mb3">
		<div class="column w-25" />
		<div class="column w-25">
			<div class="flex items-start ba b--light-gray pa3 br2 mr3 relative h-100">
				{#if item}
					<picture
						class="picture db br1 ba b--light-gray mr3 flex items-center justify-center"
						on:click={goToDetail}
					>
						{#if item.images}
							{#if item.images.length > 0}
								<img src={item.images[0].url} alt={item.model} class="w-100" />
							{/if}
						{/if}
					</picture>
					<div class="content flex-1">
						<div class="name fw6 mb3 pointer dim" on:click={goToDetail}>
							{item.model}
							-
							{item.capacity}
							{$_('label.GB')}
							-
							{item.color}
						</div>
						<div class="flex items-center">
							<div class="flex-auto flex">
								{#if !item.exchange_model}
									{#if !isLoadingCart}
										{#if !item.cart_id}
											<span
												on:click={() => handleAddToCart(item, config.sell)}
												class="br1 b--dark-blue bg-dark-blue white ba w-30-px h-30-px inline-flex
												items-center justify-center pointer grow tc ttu fw6 f7"
											>
												<svg
													fill="white"
													height="20"
													viewBox="0 0 24 24"
													width="20"
													><path
														d="M0 0h24v24H0zm18.31 6l-2.76 5z"
														fill="none"
													/>
													<path
														d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
													/>
												</svg>
											</span>
										{:else}
											<span
												on:click={async () => await goto('cart')}
												class="br1 b--dark-blue bg-white dark-blue ba w-30-px h-30-px inline-flex
														items-center justify-center pointer grow tc ttu fw6 f7"
											>
												<svg
													fill="#2F3A97"
													height="20"
													viewBox="0 0 24 24"
													width="20"
													><path d="M0 0h24v24H0V0z" fill="none" />
													<path
														d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
													/>
												</svg>
											</span>
										{/if}
									{/if}
								{:else if !item.cart_id}
									<span
										on:click={() => handleSelectAddToCart(item)}
										class="br1 b--dark-blue bg-dark-blue white ba w-30-px h-30-px inline-flex
												items-center justify-center pointer grow tc ttu fw6 f7"
									>
										<svg fill="white" height="20" viewBox="0 0 24 24" width="20"
											><path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
											<path
												d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
											/>
										</svg>
									</span>
								{:else}
									<span
										on:click={async () => await goto('cart')}
										class="br1 b--dark-blue bg-white dark-blue ba w-30-px h-30-px inline-flex
												items-center justify-center pointer grow tc ttu fw6 f7"
									>
										<svg
											fill="#2F3A97"
											height="20"
											viewBox="0 0 24 24"
											width="20"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
											/>
										</svg>
									</span>
								{/if}

								{#if !item.cart_id}
									{#if item.wishlist_id}
										<span
											on:click={handleDeleteFavorite}
											class="ml3 w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<svg
												fill="#F64E60"
												height="20"
												viewBox="0 0 24 24"
												width="20"
											>
												<path d="M0 0h24v24H0z" fill="none" />
												<path
													d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
												/>
											</svg>
										</span>
									{:else if isLoadingFavorite}
										<span
											class="ml3 w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<LoadingDefault color="#cccccc" size="30" />
										</span>
									{:else}
										<span
											on:click={handleAddToFavourite}
											class="ml3 w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<svg
												fill="#6C7293"
												height="20"
												viewBox="0 0 24 24"
												width="20"
												><path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
												/>
											</svg>
										</span>
									{/if}
								{/if}
							</div>
							{#if $auth}
								{#if item.device_tag}
									<div class="inWishlist flex items-center dark-blue ttu fw6">
										<svg
											fill="#2F3A97"
											height="16"
											viewBox="-16 0 383 384"
											width="16"
											xmlns="http://www.w3.org/2000/svg"
											><path
												d="m160.5 352h-128v-320h224v64c0 8.832031 7.167969 16 16 16s16-7.167969 16-16v-80c0-8.832031-7.167969-16-16-16h-256c-8.832031 0-16 7.167969-16 16v352c0 8.832031 7.167969 16 16 16h144c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 64h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 120h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 176h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 232h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m200.5 64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h16c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m216.5 152c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16h-16c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16zm0 0"
											/>
											<path
												d="m326.667969 197.960938c-11.496094-6.320313-24.710938-7.671876-37.183594-3.847657-6.320313 1.933594-12.0625 5.078125-17 9.183594-4.9375-4.121094-10.671875-7.257813-16.96875-9.183594-12.488281-3.832031-25.703125-2.457031-37.230469 3.871094-23.503906 13.015625-32.5625 43.351563-20.175781 67.679687 9.503906 18.519532 54.886719 58.558594 63.886719 66.398438.191406.167969.40625.28125.601562.433594.34375.273437.695313.519531 1.054688.761718.550781.367188 1.121094.695313 1.695312.988282.359375.1875.710938.363281 1.089844.515625.671875.269531 1.351562.476562 2.046875.664062.3125.078125.617187.191407.9375.246094 1.007813.207031 2.039063.328125 3.070313.328125h.007812.007812c1.03125 0 2.0625-.121094 3.082032-.320312.316406-.0625.613281-.167969.933594-.246094.695312-.175782 1.375-.386719 2.046874-.664063.371094-.152343.730469-.335937 1.089844-.511719.582032-.296874 1.144532-.617187 1.695313-.992187.359375-.242187.710937-.488281 1.054687-.761719.203125-.152344.417969-.273437.601563-.433594 9-7.832031 54.390625-47.871093 63.914062-66.445312 12.359375-24.289062 3.292969-54.625-20.257812-67.664062zm-8.238281 53.09375c-3.785157 7.378906-25.042969 28.625-45.929688 47.539062-20.894531-18.914062-42.136719-40.160156-45.902344-47.496094-4.625-9.097656-1.402344-20.363281 7.140625-25.097656 3.851563-2.113281 8.265625-2.574219 12.417969-1.296875 4.421875 1.351563 8.085938 4.480469 10.335938 8.839844.199218.488281.335937 1.066406.496093 1.671875.0625.25.183594.464844.253907.714844.167968.566406.371093 1.117187.601562 1.664062.191406.445312.390625.871094.617188 1.292969.253906.480469.542968.945312.847656 1.394531.28125.40625.566406.808594.878906 1.183594.34375.414062.703125.808594 1.089844 1.183594.34375.34375.703125.671874 1.078125.984374.410156.335938.839843.648438 1.289062.953126.429688.285156.863281.550781 1.320313.796874.429687.234376.871094.441407 1.328125.640626.550781.234374 1.101562.433593 1.679687.601562.230469.070312.4375.183594.679688.246094.199218.050781.398437.050781.601562.089844.589844.128906 1.183594.207031 1.789063.261718.488281.050782.96875.082032 1.449219.082032.511718 0 1.03125-.039063 1.550781-.089844.578125-.054688 1.144531-.136719 1.703125-.246094.21875-.046875.425781-.039062.640625-.097656.25-.0625.472656-.183594.714843-.253906.550782-.167969 1.085938-.351563 1.613282-.585938.480468-.199219.9375-.414062 1.386718-.664062.4375-.238282.855469-.496094 1.269532-.765626.457031-.304687.898437-.625 1.320312-.976562.367188-.304688.710938-.632812 1.054688-.96875.394531-.382812.761718-.785156 1.105468-1.207031.3125-.378907.59375-.769531.863282-1.167969.3125-.457031.59375-.921875.855468-1.402344.226563-.421875.433594-.847656.617188-1.292968.234375-.546876.425781-1.097657.601562-1.664063.070313-.242187.191407-.464844.253907-.714844.160156-.605469.289062-1.183593.519531-1.703125 2.21875-4.335937 5.882812-7.464844 10.304688-8.816406 4.167968-1.296875 8.578124-.816406 12.367187 1.273438 8.570313 4.78125 11.792969 16.046874 7.195313 25.09375zm0 0"
											/>
										</svg>
										<span class="ml1">{$_('device.inWishlist')}</span>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="column w-25">
			<div class="flex items-start ba b--light-gray pa3 br2 mr3 h-100 relative">
				{#if $compareItemOne}
					<picture
						class="picture db br1 ba b--light-gray mr3 flex items-center justify-center pointer"
						on:click={goToDetail1}
					>
						{#if $compareItemOne.images}
							{#if $compareItemOne.images.length > 0}
								<img
									src={$compareItemOne.images[0].url}
									alt={$compareItemOne.model}
									class="w-100"
								/>
							{/if}
						{/if}
					</picture>
					<div class="content flex-1">
						<div class="name fw6 mb3 dim pointer" on:click={goToDetail1}>
							{$compareItemOne.model}
							-
							{$compareItemOne.capacity}
							{$_('label.GB')}
							-
							{$compareItemOne.color}
						</div>
						<div class="flex items-end">
							<div class="flex-auto flex">
								{#if !$compareItemOne.exchange_model}
									{#if !isLoadingCart}
										{#if !$compareItemOne.cart_id}
											<span
												on:click={() => handleAddToCartOne(config.sell)}
												class="br1 b--dark-blue bg-dark-blue white ba ttu fw6 f7 w-30-px h-30-px inline-flex
										items-center justify-center pointer tc mr3"
											>
												<svg
													fill="white"
													height="20"
													viewBox="0 0 24 24"
													width="20"
													><path
														d="M0 0h24v24H0zm18.31 6l-2.76 5z"
														fill="none"
													/>
													<path
														d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
													/>
												</svg>
											</span>
										{:else}
											<span
												on:click={async () => await goto('cart')}
												class="br2 b--dark-blue bg-white dark-blue ba ttu fw6 f7 w-30-px h-30-px inline-flex
												items-center justify-center pointer tc mr3"
											>
												<svg
													fill="#2F3A97"
													height="20"
													viewBox="0 0 24 24"
													width="20"
													><path d="M0 0h24v24H0V0z" fill="none" />
													<path
														d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
													/>
												</svg>
											</span>
										{/if}
									{/if}
								{:else if !$compareItemOne.cart_id}
									<span
										on:click={handleSelectAddToCartOne}
										class="br1 b--dark-blue bg-dark-blue white ba ttu fw6 f7 w-30-px h-30-px inline-flex
										items-center justify-center pointer tc mr3"
									>
										<svg fill="white" height="20" viewBox="0 0 24 24" width="20"
											><path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
											<path
												d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
											/>
										</svg>
									</span>
								{:else}
									<span
										on:click={async () => await goto('cart')}
										class="br2 b--dark-blue bg-white dark-blue ba ttu fw6 f7 w-30-px h-30-px inline-flex
										items-center justify-center pointer tc mr3"
									>
										<svg
											fill="#2F3A97"
											height="20"
											viewBox="0 0 24 24"
											width="20"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
											/>
										</svg>
									</span>
								{/if}

								{#if !$compareItemOne.cart_id}
									{#if $compareItemOne.wishlist_id}
										<span
											on:click={handleDeleteFavorite1}
											class="w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<svg
												fill="#F64E60"
												height="20"
												viewBox="0 0 24 24"
												width="20"
											>
												<path d="M0 0h24v24H0z" fill="none" />
												<path
													d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
												/>
											</svg>
										</span>
									{:else if isLoadingFavorite1}
										<span
											class="w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<LoadingDefault color="#ccc" size="30" />
										</span>
									{:else}
										<span
											on:click={handleAddToFavourite1}
											class="w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<svg
												fill="#6C7293"
												height="20"
												viewBox="0 0 24 24"
												width="20"
												><path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
												/>
											</svg>
										</span>
									{/if}
								{/if}
							</div>
							{#if $auth}
								{#if $compareItemOne.device_tag}
									<div class="inWishlist flex items-center dark-blue ttu fw6">
										<svg
											fill="#2F3A97"
											height="16"
											viewBox="-16 0 383 384"
											width="16"
											xmlns="http://www.w3.org/2000/svg"
											><path
												d="m160.5 352h-128v-320h224v64c0 8.832031 7.167969 16 16 16s16-7.167969 16-16v-80c0-8.832031-7.167969-16-16-16h-256c-8.832031 0-16 7.167969-16 16v352c0 8.832031 7.167969 16 16 16h144c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 64h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 120h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 176h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 232h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m200.5 64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h16c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m216.5 152c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16h-16c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16zm0 0"
											/>
											<path
												d="m326.667969 197.960938c-11.496094-6.320313-24.710938-7.671876-37.183594-3.847657-6.320313 1.933594-12.0625 5.078125-17 9.183594-4.9375-4.121094-10.671875-7.257813-16.96875-9.183594-12.488281-3.832031-25.703125-2.457031-37.230469 3.871094-23.503906 13.015625-32.5625 43.351563-20.175781 67.679687 9.503906 18.519532 54.886719 58.558594 63.886719 66.398438.191406.167969.40625.28125.601562.433594.34375.273437.695313.519531 1.054688.761718.550781.367188 1.121094.695313 1.695312.988282.359375.1875.710938.363281 1.089844.515625.671875.269531 1.351562.476562 2.046875.664062.3125.078125.617187.191407.9375.246094 1.007813.207031 2.039063.328125 3.070313.328125h.007812.007812c1.03125 0 2.0625-.121094 3.082032-.320312.316406-.0625.613281-.167969.933594-.246094.695312-.175782 1.375-.386719 2.046874-.664063.371094-.152343.730469-.335937 1.089844-.511719.582032-.296874 1.144532-.617187 1.695313-.992187.359375-.242187.710937-.488281 1.054687-.761719.203125-.152344.417969-.273437.601563-.433594 9-7.832031 54.390625-47.871093 63.914062-66.445312 12.359375-24.289062 3.292969-54.625-20.257812-67.664062zm-8.238281 53.09375c-3.785157 7.378906-25.042969 28.625-45.929688 47.539062-20.894531-18.914062-42.136719-40.160156-45.902344-47.496094-4.625-9.097656-1.402344-20.363281 7.140625-25.097656 3.851563-2.113281 8.265625-2.574219 12.417969-1.296875 4.421875 1.351563 8.085938 4.480469 10.335938 8.839844.199218.488281.335937 1.066406.496093 1.671875.0625.25.183594.464844.253907.714844.167968.566406.371093 1.117187.601562 1.664062.191406.445312.390625.871094.617188 1.292969.253906.480469.542968.945312.847656 1.394531.28125.40625.566406.808594.878906 1.183594.34375.414062.703125.808594 1.089844 1.183594.34375.34375.703125.671874 1.078125.984374.410156.335938.839843.648438 1.289062.953126.429688.285156.863281.550781 1.320313.796874.429687.234376.871094.441407 1.328125.640626.550781.234374 1.101562.433593 1.679687.601562.230469.070312.4375.183594.679688.246094.199218.050781.398437.050781.601562.089844.589844.128906 1.183594.207031 1.789063.261718.488281.050782.96875.082032 1.449219.082032.511718 0 1.03125-.039063 1.550781-.089844.578125-.054688 1.144531-.136719 1.703125-.246094.21875-.046875.425781-.039062.640625-.097656.25-.0625.472656-.183594.714843-.253906.550782-.167969 1.085938-.351563 1.613282-.585938.480468-.199219.9375-.414062 1.386718-.664062.4375-.238282.855469-.496094 1.269532-.765626.457031-.304687.898437-.625 1.320312-.976562.367188-.304688.710938-.632812 1.054688-.96875.394531-.382812.761718-.785156 1.105468-1.207031.3125-.378907.59375-.769531.863282-1.167969.3125-.457031.59375-.921875.855468-1.402344.226563-.421875.433594-.847656.617188-1.292968.234375-.546876.425781-1.097657.601562-1.664063.070313-.242187.191407-.464844.253907-.714844.160156-.605469.289062-1.183593.519531-1.703125 2.21875-4.335937 5.882812-7.464844 10.304688-8.816406 4.167968-1.296875 8.578124-.816406 12.367187 1.273438 8.570313 4.78125 11.792969 16.046874 7.195313 25.09375zm0 0"
											/>
										</svg>
										<span class="ml1">{$_('device.inWishlist')}</span>
									</div>
								{/if}
							{/if}
						</div>
					</div>
					<span
						class="close grow pointer absolute"
						on:click={() => handleRemoveCompare1()}
					>
						<svg
							fill="#B5B5C3"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"
							><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"
							/></svg
						>
					</span>
				{:else}
					<div class="input-icon flex-auto relative">
						<input
							on:keyup={({ target: { value } }) => debounce(value)}
							bind:this={inputEle}
							autocomplete="off"
							type="search"
							class="db w-100 h-50-px ba b--light-gray pl3 br1"
							placeholder="Add device"
						/>
						<span class="icon absolute flex items-center">
							<svg
								fill="#B5B5C3"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"
								><path d="M0 0h24v24H0V0z" fill="none" />
								<path
									d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
								/></svg
							>
						</span>
					</div>
				{/if}
			</div>
		</div>
		<div class="column w-25">
			<div class="flex items-start ba b--light-gray pa3 br2 mr3 h-100 relative">
				{#if $compareItemTwo}
					<picture
						class="picture db br1 ba b--light-gray mr3 flex items-center justify-center pointer"
						on:click={goToDetail2}
					>
						{#if $compareItemTwo.images}
							{#if $compareItemTwo.images.length > 0}
								<img
									src={$compareItemTwo.images[0].url}
									alt={$compareItemTwo.model}
									class="w-100"
								/>
							{/if}
						{/if}
					</picture>
					<div class="content flex-1">
						<div class="name fw6 mb3 pointer dim" on:click={goToDetail2}>
							{$compareItemTwo.model}
							-
							{$compareItemTwo.capacity}
							{$_('label.GB')}
							-
							{$compareItemTwo.color}
						</div>
						<div class="flex items-end">
							<div class="flex-auto flex">
								{#if !$compareItemTwo.exchange_model}
									{#if !isLoadingCart}
										{#if !$compareItemTwo.cart_id}
											<span
												on:click={() => handleAddToCartTwo(config.sell)}
												class="br1 b--dark-blue bg-dark-blue white ba inline-flex ttu fw6 f7 w-30-px h-30-px
										items-center justify-center pointer tc mr3"
											>
												<svg
													fill="white"
													height="20"
													viewBox="0 0 24 24"
													width="20"
													><path
														d="M0 0h24v24H0zm18.31 6l-2.76 5z"
														fill="none"
													/>
													<path
														d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
													/>
												</svg>
											</span>
										{:else}
											<span
												on:click={async () => await goto('cart')}
												class="br2 b--dark-blue bg-white dark-blue ba inline-flex ttu fw6 f7 w-30-px h-30-px
												items-center justify-center pointer tc mr3"
											>
												<svg
													fill="#2F3A97"
													height="20"
													viewBox="0 0 24 24"
													width="20"
													><path d="M0 0h24v24H0V0z" fill="none" />
													<path
														d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
													/>
												</svg>
											</span>
										{/if}
									{/if}
								{:else if !$compareItemTwo.cart_id}
									<span
										on:click={handleSelectAddToCartTwo}
										class="br1 b--dark-blue bg-dark-blue white ba inline-flex ttu fw6 f7 w-30-px h-30-px
										items-center justify-center pointer tc mr3"
									>
										<svg fill="white" height="20" viewBox="0 0 24 24" width="20"
											><path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
											<path
												d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
											/>
										</svg>
									</span>
								{:else}
									<span
										on:click={async () => await goto('cart')}
										class="br2 b--dark-blue bg-white dark-blue ba inline-flex ttu fw6 f7 w-30-px h-30-px
										items-center justify-center pointer tc mr3"
									>
										<svg
											fill="#2F3A97"
											height="20"
											viewBox="0 0 24 24"
											width="20"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
											/>
										</svg>
									</span>
								{/if}

								{#if !$compareItemTwo.cart_id}
									{#if $compareItemTwo.wishlist_id}
										<span
											on:click={handleDeleteFavorite2}
											class="w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<svg
												fill="#F64E60"
												height="20"
												viewBox="0 0 24 24"
												width="20"
											>
												<path d="M0 0h24v24H0z" fill="none" />
												<path
													d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
												/>
											</svg>
										</span>
									{:else if isLoadingFavorite2}
										<span
											class="w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<LoadingDefault color="#ccc" size="30" />
										</span>
									{:else}
										<span
											on:click={handleAddToFavourite2}
											class="w-30-px h-30-px pointer grow inline-flex items-center justify-center br1"
										>
											<svg
												fill="#6C7293"
												height="20"
												viewBox="0 0 24 24"
												width="20"
												><path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
												/>
											</svg>
										</span>
									{/if}
								{/if}
							</div>
							{#if $auth}
								{#if $compareItemTwo.device_tag}
									<div class="inWishlist flex items-center dark-blue ttu fw6">
										<svg
											fill="#2F3A97"
											height="16"
											viewBox="-16 0 383 384"
											width="16"
											xmlns="http://www.w3.org/2000/svg"
											><path
												d="m160.5 352h-128v-320h224v64c0 8.832031 7.167969 16 16 16s16-7.167969 16-16v-80c0-8.832031-7.167969-16-16-16h-256c-8.832031 0-16 7.167969-16 16v352c0 8.832031 7.167969 16 16 16h144c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 64h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 120h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 176h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m136.5 232h-64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h64c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m200.5 64c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h16c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16zm0 0"
											/>
											<path
												d="m216.5 152c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16h-16c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16zm0 0"
											/>
											<path
												d="m326.667969 197.960938c-11.496094-6.320313-24.710938-7.671876-37.183594-3.847657-6.320313 1.933594-12.0625 5.078125-17 9.183594-4.9375-4.121094-10.671875-7.257813-16.96875-9.183594-12.488281-3.832031-25.703125-2.457031-37.230469 3.871094-23.503906 13.015625-32.5625 43.351563-20.175781 67.679687 9.503906 18.519532 54.886719 58.558594 63.886719 66.398438.191406.167969.40625.28125.601562.433594.34375.273437.695313.519531 1.054688.761718.550781.367188 1.121094.695313 1.695312.988282.359375.1875.710938.363281 1.089844.515625.671875.269531 1.351562.476562 2.046875.664062.3125.078125.617187.191407.9375.246094 1.007813.207031 2.039063.328125 3.070313.328125h.007812.007812c1.03125 0 2.0625-.121094 3.082032-.320312.316406-.0625.613281-.167969.933594-.246094.695312-.175782 1.375-.386719 2.046874-.664063.371094-.152343.730469-.335937 1.089844-.511719.582032-.296874 1.144532-.617187 1.695313-.992187.359375-.242187.710937-.488281 1.054687-.761719.203125-.152344.417969-.273437.601563-.433594 9-7.832031 54.390625-47.871093 63.914062-66.445312 12.359375-24.289062 3.292969-54.625-20.257812-67.664062zm-8.238281 53.09375c-3.785157 7.378906-25.042969 28.625-45.929688 47.539062-20.894531-18.914062-42.136719-40.160156-45.902344-47.496094-4.625-9.097656-1.402344-20.363281 7.140625-25.097656 3.851563-2.113281 8.265625-2.574219 12.417969-1.296875 4.421875 1.351563 8.085938 4.480469 10.335938 8.839844.199218.488281.335937 1.066406.496093 1.671875.0625.25.183594.464844.253907.714844.167968.566406.371093 1.117187.601562 1.664062.191406.445312.390625.871094.617188 1.292969.253906.480469.542968.945312.847656 1.394531.28125.40625.566406.808594.878906 1.183594.34375.414062.703125.808594 1.089844 1.183594.34375.34375.703125.671874 1.078125.984374.410156.335938.839843.648438 1.289062.953126.429688.285156.863281.550781 1.320313.796874.429687.234376.871094.441407 1.328125.640626.550781.234374 1.101562.433593 1.679687.601562.230469.070312.4375.183594.679688.246094.199218.050781.398437.050781.601562.089844.589844.128906 1.183594.207031 1.789063.261718.488281.050782.96875.082032 1.449219.082032.511718 0 1.03125-.039063 1.550781-.089844.578125-.054688 1.144531-.136719 1.703125-.246094.21875-.046875.425781-.039062.640625-.097656.25-.0625.472656-.183594.714843-.253906.550782-.167969 1.085938-.351563 1.613282-.585938.480468-.199219.9375-.414062 1.386718-.664062.4375-.238282.855469-.496094 1.269532-.765626.457031-.304687.898437-.625 1.320312-.976562.367188-.304688.710938-.632812 1.054688-.96875.394531-.382812.761718-.785156 1.105468-1.207031.3125-.378907.59375-.769531.863282-1.167969.3125-.457031.59375-.921875.855468-1.402344.226563-.421875.433594-.847656.617188-1.292968.234375-.546876.425781-1.097657.601562-1.664063.070313-.242187.191407-.464844.253907-.714844.160156-.605469.289062-1.183593.519531-1.703125 2.21875-4.335937 5.882812-7.464844 10.304688-8.816406 4.167968-1.296875 8.578124-.816406 12.367187 1.273438 8.570313 4.78125 11.792969 16.046874 7.195313 25.09375zm0 0"
											/>
										</svg>
										<span class="ml1">{$_('device.inWishlist')}</span>
									</div>
								{/if}
							{/if}
						</div>
					</div>
					<span
						class="close grow pointer absolute"
						on:click={() => handleRemoveCompare2()}
					>
						<svg
							fill="#B5B5C3"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"
							><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"
							/></svg
						>
					</span>
				{:else}
					<div class="input-icon flex-auto relative">
						<input
							on:keyup={({ target: { value } }) => debounce2(value)}
							bind:this={inputEle2}
							autocomplete="off"
							type="search"
							class="db w-100 h-50-px ba b--light-gray pl3 br1"
							placeholder="Add device"
						/>
						<span class="icon absolute flex items-center">
							<svg
								fill="#B5B5C3"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"
								><path d="M0 0h24v24H0V0z" fill="none" />
								<path
									d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
								/></svg
							>
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<details class="summary mb5" open>
		<summary class="bg-light-gray pa3 ttu b">{$_('label.summary')}</summary>
		<div class="row flex ">
			<div class="column w-25 ">
				<div class="cell pv3 fw6 bb b--light-gray">
					{$_('label.hasExchange')}
				</div>
				<div class="cell pv3 fw6 bb b--light-gray">
					{$_('label.dingtoiRating')}
				</div>
				<div class="cell pv3 fw6 bb b--light-gray">
					{$_('device.physicalGrading')}
				</div>
				<div class="cell pv3 fw6 bb b--light-gray">
					{$_('device.sellingPrice')}
				</div>
				<div class="cell pv3 fw6 bb b--light-gray">{$_('device.color')}</div>
				<div class="cell pv3 fw6 bb b--light-gray">{$_('device.strCa')}</div>
				<div class="cell-warranty pv3 fw6 bb b--light-gray">
					{$_('device.warranty')}
				</div>
				<div class="cell pv3 fw6 bb b--light-gray">
					{$_('device.accessories')}
				</div>
				<div class="cell pv3 fw6 bb b--light-gray">{$_('device.process')}</div>
			</div>
			<div class="column w-25 ">
				<PcCompareItem {item} />
			</div>
			<div class="column w-25">
				<PcCompareItem item={$compareItemOne} />
			</div>
			<div class="column w-25">
				<PcCompareItem item={$compareItemTwo} />
			</div>
		</div>
	</details>
	<details open>
		<summary class="bg-light-gray pa3 ttu b">{$_('device.basicInfo')}</summary>
		<div class="row flex">
			<div class="column w-25" />
			<div class="column w-25">
				<div class="cell pv3">
					{#if item.other_detail}
						{#if others.length > 0}
							{#each others as other}
								{#if other.value}
									<p class="">
										<span class="fw6 mr1">{other.key} :</span>
										<span>{other.value}</span>
									</p>
								{/if}
							{/each}
						{/if}
					{/if}
				</div>
			</div>
			<div class="column w-25">
				<div class="cell pv3">
					{#if $compareItemOne}
						{#if $compareItemOne.other_detail}
							{#if others1.length > 0}
								{#each others1 as other}
									{#if other.value}
										<p class="">
											<span class="fw6 mr1">{other.key} :</span>
											<span>{other.value}</span>
										</p>
									{/if}
								{/each}
							{/if}
						{/if}
					{/if}
				</div>
			</div>
			<div class="column w-25">
				<div class="cell pv3">
					{#if $compareItemTwo}
						{#if $compareItemTwo.other_detail}
							{#if others2.length > 0}
								{#each others2 as other}
									{#if other.value}
										<p class="">
											<span class="fw6 mr1">{other.key} :</span>
											<span>{other.value}</span>
										</p>
									{/if}
								{/each}
							{/if}
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</details>
{/if}

<style>
	input[type='search']:focus {
		border-color: transparent;
	}
	input[type='search']::-webkit-search-decoration,
	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-results-button,
	input[type='search']::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
	input[type='search']::-webkit-input-placeholder {
		/* Edge */
		color: #3f4254;
	}
	input[type='search']:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: #3f4254;
	}

	input[type='search']::placeholder {
		color: #3f4254;
	}
	details:focus {
		outline: none;
	}
	details summary {
		cursor: pointer;
	}
	details summary:focus {
		outline: none;
	}
	.inline-flex {
		display: inline-flex;
	}
	.flex-1 {
		flex: 1;
	}
	.picture {
		flex-basis: 60px;
	}

	.input-icon input {
		padding-right: 40px;
	}
	.input-icon .icon {
		top: 0;
		bottom: 0;
		right: 10px;
	}
	.close {
		top: -12px;
		right: -12px;
	}
	.summary .cell {
		height: 43px;
		box-sizing: border-box;
	}
	.summary .cell-warranty {
		height: 110px;
	}
	.w-30-px {
		width: 30px;
	}

	.inWishlist {
		font-size: 12px;
	}
</style>
