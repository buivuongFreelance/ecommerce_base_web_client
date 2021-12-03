<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { onDestroy, onMount } from 'svelte';
	import {
		availableDetail,
		addWishlist as apiAddWishlist,
		deleteWishlist as apiDeleteWishlist,
	} from '../../services/device';
	import { addToCart as apiAddToCart } from '../../services/cart';
	import {
		auth,
		currency,
		cartChanged,
		anonymous,
		linkToBack,
		favoriteChanged,
	} from '../../stores';
	import {
		displayCurrency,
		displayCurrencyReverse,
		displayDateDefault,
		displayExchangeBuyerStr,
		isPastDate,
	} from '../../functions';
	import ContentLoader from 'svelte-content-loader';
	import PcRating from '../input/PcRating.svelte';
	import PcTabH from '../dropdown/PcTabItemHorizontal.svelte';
	import LazyLoad from 'vanilla-lazyload';
	import PcIconYesNo from '../input/PcIconYesNo.svelte';
	import config from '../../config';

	import Portal from 'svelte-portal';
	import DimmerModal from '../../components/loading/DimmerModal.svelte';
	import PcModalImageScan from '../modal/PcModalImageScan.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import * as animateScroll from 'svelte-scrollto';
	import TabletDeviceImages from './TabletDeviceImages.svelte';
	import PcViewScanReport from './PcViewScanReport.svelte';

	const { session, page } = stores();
	const { domainDevice, domainCart } = $session;

	export let item = {};

	let isLoading = false;
	let isServerError = false;
	let isOpenImageScan = false;
	let isOpenImageScanTouch = false;
	let observer;
	let containerEle;
	let currentTab = 'tab1';
	let accessories = [];
	let isLoadingCart = false;
	let isLoadingWishlist = false;
	let tabEle;
	let typeAdd = config.sell; //null;
	let mounted = false;

	$: {
		if (isOpenImageScan || isOpenImageScanTouch) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	onMount(async () => {
		try {
			let id = $page.params.id;
			item = await getDetail(id);
			mounted = true;
			if (item) {
				if (item.exchange_model) {
					setTimeout(() => {
						observer = new LazyLoad({
							container: containerEle,
							elements_selector: '.lazy',
						});
						observer.update();
					}, 300);
				}

				if (item.accessories) {
					let jsonData = item.accessories;
					for (var key in jsonData) {
						if (jsonData[key]) {
							accessories.push({ key: key, value: jsonData[key] });
						}
					}
				}
			}
		} catch (error) {}
	});
	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (mounted) {
				let id = $page.params.id;
				getDetail(id).then((it) => (item = it));
			}
		}
	});

	const unsubscribeFavoriteChanged = favoriteChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					let id = $page.params.id;
					getDetail(id).then((it) => (item = it));
				}
			}
		}
	);

	onDestroy(() => {
		if (observer) {
			if (typeof observer.destroy === 'function') {
				observer.destroy();
			}
		}
		unsubscribeCartChanged();
		unsubscribeFavoriteChanged();
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
					isServerError = false;
					isLoading = false;
					if (obj) {
						if (obj.cart_id) {
							typeAdd = obj.cart_type;
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

	const addToCart = (typeAdd) => {
		return new Promise((resolve, reject) => {
			isLoadingCart = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddToCart(domainCart, {
				deviceId: item.id,
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

	const addWishlist = () => {
		return new Promise((resolve, reject) => {
			isLoadingWishlist = true;
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
					isLoadingWishlist = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingWishlist = false;
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

	const deleteWishlist = () => {
		return new Promise((resolve, reject) => {
			isLoadingWishlist = true;
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
					isLoadingWishlist = false;
					favoriteChanged.update((n) => n + 1);
					resolve(obj);
				})
				.catch((error) => {
					isLoadingWishlist = false;
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

	const handleAddToCart = async (typeAdd) => {
		try {
			await addToCart(typeAdd);
			cartChanged.update((n) => n + 1);
		} catch (error) {}
	};
	const handleAddToFavourite = async () => {
		try {
			await addWishlist();
		} catch (error) {}
	};

	const handleDeleteFavorite = async () => {
		try {
			await deleteWishlist();
		} catch (error) {}
	};

	const handleGoToTab = (tab) => {
		animateScroll.scrollTo({ element: tabEle, offset: -240 });
		currentTab = tab;
	};
	const handleGoToCompare = async () => {
		if (item && item.id) {
			await goto('compare/' + item.id);
		}
	};
</script>

{#if isServerError}
	<p class="red f4 tc">{$_('error.serverErrorMessage')}</p>
{:else if !isLoading}
	{#if item}
		<div class="custom">
			<div class="header mb4">
				<div class="flex items-center mb3">
					<h3 class="ttc mr4">
						{item.model}
						{item.capacity}
						{$_('label.GB')}

						{item.color}
					</h3>
					<span
						class="circle b--light-gray bw2 flex items-center justify-center ba"
						style="background-color: #e0e6ef"
					>
						<span
							class="db bg-light-gray"
							style="background-color: #{item.color_code}"
						/>
					</span>
				</div>
				<div class="subtitle fw6 flex items-center">
					<span class="mr1">{$_('device.physicalGrading')}:</span>
					<span class="grade mr3 green"
						>{$_('device.grade')}
						{item.physical_grading}</span
					>
					<PcRating rating={item.dingtoi_rating} />
					<div
						class="pointer light-blue ml3 u flex items-center"
						on:click={() => handleGoToTab('tab1')}
					>
						<span>{$_('device.viewScanReport')}</span>
						<svg
							fill="#3699ff"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"
						>
							<path d="M7 10l5 5 5-5z" /></svg
						>
					</div>
				</div>
			</div>
			<div class="body">
				<div class="device-detail-container mb6">
					<div class="flex">
						<div class="device-image w-50 pr3">
							{#if item.images}
								{#if item.images.length > 0}
									<div class="image-container">
										<div class="image_main">
											<TabletDeviceImages images={item.images} />
										</div>
									</div>
								{/if}
							{/if}
						</div>
						<div class="device-content w-50 pl3">
							{#if item.exchange_model}
								<div
									class="mb3 pa4 br2 ba b--light-gray flex items-start relative"
									class:b--dark-blue={typeAdd === config.sell}
								>
									<label
										class="light-silver radio absolute w-100 h-100 top-0 left-0
											pl4"
										class:pointer={!item.cart_id ? true : false}
									>
										<input
											disabled={item.cart_id ? true : false}
											type="radio"
											value={config.sell}
											bind:group={typeAdd}
										/>
										<span class="box" />
									</label>
									<div class="ml-40px">
										<span
											class="label fw6"
											class:steel-two={typeAdd !== config.sell}
											class:dark-blue={typeAdd === config.sell}
											>{$_('device.askingPrice')}</span
										>
										<h3
											class="price"
											class:steel-two={typeAdd !== config.sell}
											class:dark-blue={typeAdd === config.sell}
										>
											{displayCurrency(
												Math.abs(item.real_sale_price),
												$currency
											)}
											{$currency}
										</h3>
									</div>
								</div>
								<div
									class="mb3 pa4 br2 ba b--light-gray flex items-start relative"
									class:b--dark-blue={typeAdd === config.exchange}
								>
									<label
										class="light-silver radio absolute w-100 h-100 top-0 left-0
											pl4"
										class:pointer={!item.cart_id ? true : false}
									>
										<input
											disabled={item.cart_id ? true : false}
											type="radio"
											value={config.exchange}
											bind:group={typeAdd}
										/>
										<span class="box" />
									</label>
									<div class="ml-40px">
										<span
											class="label fw6 ttc"
											class:steel-two={typeAdd !== config.exchange}
											class:red={item.real_exchange_price >= 0 &&
												typeAdd === config.exchange}
											class:dark-blue={item.real_exchange_price < 0 &&
												typeAdd === config.exchange}
										>
											{$_(
												displayExchangeBuyerStr(item.real_exchange_price)
											)}</span
										>
										<h3
											class="price"
											class:steel-two={typeAdd !== config.exchange}
											class:red={item.real_exchange_price >= 0 &&
												typeAdd === config.exchange}
											class:dark-blue={item.real_exchange_price < 0 &&
												typeAdd === config.exchange}
										>
											{#if item.real_exchange_price == 0}
												{item.real_exchange_price}
											{:else}
												{displayCurrencyReverse(
													item.real_exchange_price,
													$currency
												)}
											{/if}
											{$currency}
										</h3>
										<div class="flex mt3">
											<div bind:this={containerEle}>
												<img
													class="flex-auto lazy"
													width={80}
													height="auto"
													data-src={item.exchange_model.model_image_url}
													src={'images/phone_default.png'}
													alt={item.exchange_model.model_name}
												/>
											</div>
											<div class="ml4">
												<div
													class="mb3"
													class:steel-two={typeAdd !== config.exchange}
													class:dark-blue={typeAdd === config.exchange}
												>
													<em>{$_('message.exchangeWith')}</em>
													<b>
														{item.exchange_model.model_name}

														{item.exchange_model.capacity_name}
													</b>
												</div>
												<div
													class="mb3 ttc"
													class:steel-two={typeAdd !== config.exchange}
													class:dark-blue={typeAdd === config.exchange}
												>
													{$_('device.brand')}:
													{item.exchange_model.brand_name}
												</div>
											</div>
										</div>
									</div>
								</div>
							{:else}
								<div class="b">{$_('device.askingPrice')}</div>
								<h3>
									{displayCurrency(Math.abs(item.real_sale_price), $currency)}
									{$currency}
								</h3>
							{/if}
							<div class="specifications mb4">
								<div class="tc">
									<div
										class="fw6 flex justify-center items-center"
										on:click={() => handleGoToTab('tab3')}
									>
										<span class="pointer light-blue u"
											>{$_('message.seeDetail')}</span
										>
										<svg
											fill="#3699ff"
											xmlns="http://www.w3.org/2000/svg"
											height="24"
											viewBox="0 0 24 24"
											width="24"
										>
											<path d="M7 10l5 5 5-5z" />
										</svg>
									</div>
								</div>
							</div>
							<div class="pb4 bb b--dashed b--light-gray">
								<div>
									{#if !isLoadingCart}
										{#if item.cart_id}
											<button
												type="button"
												on:click={async () => await goto('cart')}
												class="w-100 f4 fw6 tc ba b--dark-blue bg-white dark-blue
													br2 dim pointer h-60-px"
												>{$_('cart.viewCart')}</button
											>
										{:else if item.exchange_model}
											<button
												type="button"
												on:click={() => handleAddToCart(typeAdd)}
												class="w-100 fw6 tc ba b--light-yellow bg-light-yellow
													dark-blue f4 br2 dim pointer h-60-px flex items-center
													justify-center"
											>
												<span class="mr3 flex items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="#2f3a97"
														width="24px"
														height="24px"
														><path
															d="M0 0h24v24H0zm18.31 6l-2.76 5z"
															fill="none"
														/>
														<path
															d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
														/>
													</svg>
												</span>
												{$_('deviceDetail.addToCart')}
											</button>
										{:else}
											<button
												type="button"
												on:click={() => handleAddToCart(config.sell)}
												class="w-100 fw6 tc ba b--light-yellow bg-light-yellow
													dark-blue f4 br2 dim pointer h-60-px flex items-center
													justify-center"
											>
												<span class="mr3 flex items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="#2f3a97"
														width="24px"
														height="24px"
														><path
															d="M0 0h24v24H0zm18.31 6l-2.76 5z"
															fill="none"
														/>
														<path
															d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
														/>
													</svg>
												</span>
												{$_('deviceDetail.addToCart')}
											</button>
										{/if}
									{:else}
										<button
											type="button"
											on:click={() => handleAddToCart(typeAdd)}
											class="w-100 fw6 tc ba b--light-yellow bg-light-yellow
												dark-blue f4 br2 grow pointer h-60-px flex items-center
												justify-center"
										>
											<LoadingDefault />
										</button>
									{/if}
								</div>
								{#if isLoadingWishlist}
									<button
										type="button"
										on:click={handleAddToFavourite}
										class="w-100 fw6 tc ba b--red bg-white red f4 br2 grow pointer
											h-60-px flex items-center justify-center mt3"
									>
										<LoadingDefault color="#cccccc" />
									</button>
								{:else if item.wishlist_id}
									<button
										type="button"
										on:click={handleDeleteFavorite}
										class="w-100 fw6 tc ba b--red bg-red white f4 br2 dim pointer
											h-60-px flex items-center justify-center mt3"
									>
										<span class="mr3 flex items-center">
											<svg
												fill="white"
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												viewBox="0 0 24 24"
												width="24"
												><path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
												/>
											</svg>
										</span>

										{$_('deviceDetail.removeFavorite')}
									</button>
								{:else}
									<button
										type="button"
										on:click={handleAddToFavourite}
										class="w-100 fw6 tc ba b--red bg-white red f4 br2 dim pointer
											h-60-px flex items-center justify-center mt3"
									>
										<span class="mr3 flex items-center">
											<svg
												fill="#F64E60"
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												viewBox="0 0 24 24"
												width="24"
											>
												<path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
												/>
											</svg>
										</span>

										{$_('deviceDetail.addToFavorite')}
									</button>
								{/if}
							</div>
							<div class="mt4 mb3 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="22"
									height="25"
									viewBox="0 0 22 25"
								>
									<g
										id="Group_18"
										data-name="Group 18"
										transform="translate(-735 -390)"
									>
										<g id="phone_android-24px" transform="translate(730 389)">
											<path
												id="Path_15"
												data-name="Path 15"
												d="M16,1H8A3,3,0,0,0,5,4V20a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V4A3,3,0,0,0,16,1ZM14,21H10V20h4Zm3.25-3H6.75V4h10.5Z"
												fill="#3699ff"
											/>
										</g>
										<g id="phone_iphone-24px" transform="translate(739 392)">
											<path
												id="Path_17"
												data-name="Path 17"
												d="M15.5,1h-8A2.5,2.5,0,0,0,5,3.5v17A2.5,2.5,0,0,0,7.5,23h8A2.5,2.5,0,0,0,18,20.5V3.5A2.5,2.5,0,0,0,15.5,1Zm-4,21A1.5,1.5,0,1,1,13,20.5,1.5,1.5,0,0,1,11.5,22ZM16,18H7V4h9Z"
												fill="#3699ff"
											/>
											<rect
												id="Rectangle_113"
												data-name="Rectangle 113"
												width="9"
												height="14"
												transform="translate(7 4)"
												fill="#fff"
											/>
										</g>
									</g>
								</svg>

								<div
									class="blue fw6 f4 ml3 dim ttu"
									on:click={handleGoToCompare}
								>
									{$_('label.compare')}
								</div>
							</div>
							<div class="pl-33px">{$_('label.compareDesc')}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="footer" bind:this={tabEle}>
				<PcTabH
					bind:active={currentTab}
					headers={[
						{ key: 'tab1', name: $_('device.dingtoiScanReport') },
						{
							key: 'tab2',
							name: $_('device.warranty') + ' & ' + $_('device.accessories'),
						},
						{ key: 'tab3', name: $_('device.moreInfo') },
						{ key: 'tab4', name: $_('deviceDetail.grading') },
					]}
				>
					<div slot="content">
						{#if currentTab === 'tab3'}
							<div class="mb3 f4 fw6">{$_('deviceDetail.mainInfo')}</div>
							<div class="ba b--light-gray max-width-50">
								<div class="flex">
									<span class="pa3 b--light-gray fw6 mw150px br"
										>{$_('device.model')}</span
									>
									<span class="pa3 b--light-gray flex-auto"
										>{item.brand_name}</span
									>
								</div>
								<div class="flex bg-light-gray">
									<span class="pa3 b--light-gray fw6 mw150px br"
										>{$_('device.ram')}</span
									>
									<span class="pa3 b--light-gray flex-auto"
										>{item.ram_value}
										{$_('label.GB')}</span
									>
								</div>
								<div class="flex">
									<span class="pa3 b--light-gray fw6 mw150px br"
										>{$_('device.strCa')}</span
									>
									<span class="pa3 b--light-gray flex-auto"
										>{item.capacity}
										{$_('label.GB')}</span
									>
								</div>
							</div>
							{#if item.other_detail}
								<div class="mb3 f4 fw6 mt4">{$_('device.basicInfo')}</div>
								<div class="ba b--light-gray max-width-50">
									{#each Object.entries(item.other_detail) as [key, value], i}
										<div class="flex" class:bg-light-gray={i % 2 === 0}>
											<span class="pa3 b--light-gray fw6 mw150px br">{key}</span
											>
											<span class="pa3 b--light-gray flex-auto">{value}</span>
										</div>
									{/each}
								</div>
							{/if}
						{:else if currentTab === 'tab2'}
							{#if item.is_warranty}
								<h4 class="mb3">{$_('device.timeRemaining')}</h4>
								<div class="mb4">
									{#if item.is_warranty === config.yes}
										{#if item.warranty_expire_date}
											<div class="flex pl5">
												{#if !isPastDate(item.warranty_expire_date)}
													<div class="green i mr1">
														{$_('message.expireDate')}:
													</div>
													<div>
														{displayDateDefault(item.warranty_expire_date)}
													</div>
												{:else}
													<b class="red i mr1">{$_('device.expired')}:</b>
													<span class="mr1">{$_('device.descExpired')}, </span>
													<div class="">
														{$_('label.warrantyToDate')}
														{displayDateDefault(item.warranty_expire_date)}
													</div>
												{/if}
											</div>
										{/if}
									{:else if item.is_warranty === config.no}
										<div class="flex pl5">
											<b class="red i mr1">{$_('device.expired')}</b>
										</div>
									{:else}
										<div class="pl5 fw6">{$_('message.unknown')}</div>
									{/if}
								</div>
								{#if item.additional_warranty}
									<h4 class="mb3">{$_('device.additionalWarranty')}</h4>
									<p>{item.additional_warranty}</p>
								{/if}
							{:else}{$_('device.thisDeviceHasNoWarranty')}{/if}
							{#if item.accessories && accessories.length > 0}
								<h4 class="mb3">{$_('device.accessories')}</h4>
								<div class="flex flex-wrap pl5">
									{#each accessories as accessory}
										{#if accessory.value}
											<div
												class="accessory br1 bg-white ba b--light-gray ph4
													h-30-px mr3 mb3 flex items-center"
											>
												{$_(accessory.key)}
											</div>
										{/if}
									{/each}
								</div>
							{:else}
								<div>{$_('device.noAccessory')}</div>
							{/if}
						{:else if currentTab === 'tab1'}
							{#if item.main_info}
								<h4 class="mb3 ttc">
									{item.main_info.model}
									{item.main_info.storage}
								</h4>
								<div class="mb3 flex items-center">
									<span class="mr1 light-silver"
										>{$_('device.physicalGrading')}:</span
									>
									<span class="grade mr3 dark-blue b"
										>{$_('device.grade')}
										{item.physical_grading}</span
									>
									<PcRating rating={item.dingtoi_rating} />
								</div>
								<div class="mb4">
									<div class="mb1">
										<span>{$_('device.latestVersion')}:</span>
										<span>{item.main_info.released}</span>
									</div>
									<div class="mb1">
										<span>{$_('device.strCa')}:</span>
										<span
											>{item.main_info.storageUsed}
											{$_('device.of')}
											{item.main_info.storage}
											{$_('device.used')}</span
										>
									</div>
								</div>
								<div class="mb4">
									<button
										on:click={() => (isOpenImageScan = true)}
										type="button"
										class="bg-light-blue white h-40-px ph4 pointer bn br2 fw6"
										>{$_('device.viewScanReport')}</button
									>
								</div>
								<div class="mt1rem w-60">
									<PcViewScanReport {item} bind:isOpenImageScanTouch />
								</div>
								{#if isOpenImageScan}
									<Portal target={document.getElementById('portal')}>
										<DimmerModal
											type="modal"
											onClick={() => (isOpenImageScan = false)}
										/>
										<PcModalImageScan
											onClose={() => (isOpenImageScan = false)}
											imageScan={item.main_info.url_summary_report}
										/>
									</Portal>
								{/if}
								{#if isOpenImageScanTouch}
									<Portal target={document.getElementById('portal')}>
										<DimmerModal
											type="modal"
											onClick={() => (isOpenImageScanTouch = false)}
										/>
										<PcModalImageScan
											onClose={() => (isOpenImageScanTouch = false)}
											imageScan={item.main_info.touch_url}
										/>
									</Portal>
								{/if}
							{/if}
						{:else if currentTab === 'tab4'}
							<dl>
								<dt class="b">{$_('label.gradeA')}:</dt>
								<dd class="ml5 mb3 i">{$_('label.gradeADesc')}</dd>
								<dt class="b">{$_('label.gradeB')}:</dt>
								<dd class="ml5 mb3 i">{$_('label.gradeBDesc')}</dd>
								<dt class="b">{$_('label.gradeC')}:</dt>
								<dd class="ml5 mb3 i">{$_('label.gradeCDesc')}</dd>
								<dt class="b">{$_('label.gradeD')}:</dt>
								<dd class="ml5 mb3 i">{$_('label.gradeDDesc')}</dd>
							</dl>
						{/if}
					</div>
				</PcTabH>
			</div>
		</div>
		<div class="border-bottom db w-100 b--light-gray bb mt6" />
	{/if}
{:else}
	<div class="flex justify-center mv4">
		<ContentLoader width="1170" uniqueKey="featuredDevices">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{/if}

<style>
	.border-bottom {
		height: 1px;
	}
	.circle,
	.circle > span {
		border-radius: 50%;
	}
	.circle {
		width: 30px;
		height: 30px;
	}
	.circle span {
		width: 24px;
		height: 24px;
	}
	.custom :global(.top-image) {
		width: 100%;
	}

	.mw150px {
		min-width: 150px;
	}
	.radio {
		display: inline-flex;
		align-items: center;
	}
	.radio input {
		display: none;
	}
	.radio .box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #7e8299;
		box-sizing: border-box;
	}
	.radio .box:after {
		content: '';
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #2f3a97;
		opacity: 0;
	}
	.radio > input:checked + .box {
		border-color: #2f3a97;
	}
	.radio > input:checked + .box:after {
		opacity: 1;
	}
	.ml-40px {
		margin-left: 40px;
	}
	.pl-33px {
		padding-left: 33px;
	}

	.w-50 {
		flex-basis: 50%;
	}
</style>
