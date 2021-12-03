<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import { onDestroy, onMount } from 'svelte';
	import { addToCart as apiAddToCart } from '../../services/cart';
	import config from '../../config';
	import Portal from 'svelte-portal';
	import DimmerModal from '../../components/loading/DimmerModal.svelte';
	import LazyLoad from 'vanilla-lazyload';
	import {
		displayCurrency,
		displayCurrencyReverse,
		displayExchangeBuyerStr,
		formatPercentage,
	} from '../../functions';
	import {
		currency,
		linkToBack,
		auth,
		anonymous,
		cartChanged,
		favoriteChanged,
	} from '../../stores';
	import PcRating from '../input/PcRating.svelte';
	import PcModalImageScan from '../modal/PcModalImageScan.svelte';
	import { fade } from 'svelte/transition';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import MobileModalSelectAddToCart from '../modal/MobileModalSelectAddToCart.svelte';
	import {
		addWishlist as apiAddWishlist,
		deleteWishlist as apiDeleteWishlist,
	} from '../../services/device';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcModalPhysicalGrading from '../modal/PcModalPhysicalGrading.svelte';

	const { session } = stores();
	const { domainCart, domainDevice } = $session;
	export let item = {};

	let containerEle;
	let observer;
	let isOpenImageScan = false;
	let exchange = false;
	let isLoadingCart = false;
	let isOpenlSelectAddToCart = false;
	let typeAdd = config.sell;
	let isLoadingWishlist = false;
	let isOpenModalPG = false;

	$: {
		if (isOpenImageScan || isOpenlSelectAddToCart || isOpenModalPG) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	onMount(() => {
		setTimeout(() => {
			if (containerEle) {
				observer = new LazyLoad({
					container: containerEle,
					elements_selector: '.lazy',
				});
				observer.update();
			}
		}, 300);
	});

	onDestroy(() => {
		if (observer) {
			if (typeof observer.destroy === 'function') {
				observer.destroy();
			}
		}
		document.body.classList.remove('noscroll');
	});

	const handleGotoDetail = async () => {
		linkToBack.set('device/' + item.device_id);
		await goto('empty');
	};
	const addToCart = (type) => {
		return new Promise((resolve, reject) => {
			isLoadingCart = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddToCart(domainCart, {
				deviceId: item.device_id,
				token,
				anonymous: $anonymous,
				type: type,
			})
				.then((obj) => {
					isLoadingCart = false;
					resolve(obj);
				})
				.catch((error) => {
					isLoadingCart = false;
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
	const handleAddToCart = async (type) => {
		try {
			await addToCart(type);
			cartChanged.update((n) => n + 1);
		} catch (error) {}
	};
	const handleSelectAddToCart = () => {
		isOpenlSelectAddToCart = true;
	};

	let isOpenTooltip = false;

	const handleTooltipOpen = () => {
		if (!isOpenTooltip) isOpenTooltip = true;
	};
	const handleTooltipClose = () => {
		if (isOpenTooltip) isOpenTooltip = false;
	};

	let isOpenTooltipRating = false;
	const handleTooltipRatingOpen = () => {
		if (!isOpenTooltipRating) isOpenTooltipRating = true;
	};
	const handleTooltipRatingClose = () => {
		if (isOpenTooltipRating) isOpenTooltipRating = false;
	};

	const addWishlist = () => {
		return new Promise((resolve, reject) => {
			isLoadingWishlist = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddWishlist(domainDevice, {
				deviceId: item.device_id,
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
</script>

{#if isOpenImageScan}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenImageScan = false)} />
		<PcModalImageScan
			onClose={() => (isOpenImageScan = false)}
			imageScan={item.dingtoi_scan_image}
		/>
	</Portal>
{/if}
{#if isOpenlSelectAddToCart}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal
			type="modal"
			onClick={() => (isOpenlSelectAddToCart = false)}
		/>
		<MobileModalSelectAddToCart
			onClose={() => (isOpenlSelectAddToCart = false)}
			{item}
			bind:typeAdd
		/>
	</Portal>
{/if}
{#if isOpenModalPG}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModalPG = false)} />
		<PcModalPhysicalGrading onClose={() => (isOpenModalPG = false)} />
	</Portal>
{/if}
{#if item}
	<div class="device bg-white" bind:this={containerEle}>
		<div
			class="device-image pointer br1"
			class:br--top-left-0={item.exchange_model}
		>
			<div class="images relative flex items-center justify-center br1">
				<img
					data-src={item.url}
					on:click={handleGotoDetail}
					src={'images/phone_default.png'}
					alt={item.model}
					class="image lazy br1"
				/>
				{#if item.wishlist_id}
					<span
						class="isFavorite absolute pointer grow"
						on:click={handleDeleteFavorite}
					>
						{#if isLoadingWishlist}
							<LoadingDefault color="#cccccc" />
						{:else}
							<svg fill="#F64E60" height="20" width="20" viewBox="0 0 24 24">
								<path
									d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
								/>
							</svg>
						{/if}
					</span>
				{:else}
					<span
						class="isFavorite absolute pointer grow"
						on:click={handleAddToFavourite}
					>
						{#if isLoadingWishlist}
							<LoadingDefault color="#cccccc" />
						{:else}
							<svg fill="#6C7293" height="20" viewBox="0 0 24 24" width="20"
								><path d="M0 0h24v24H0V0z" fill="none" />
								<path
									d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
								/>
							</svg>
						{/if}
					</span>
				{/if}
				{#if $auth}
					{#if item.device_tag}
						<a
							class="isWishlist absolute pointer grow br2 f7 ttc fw6 pulse animated infinite"
							href="/my-wishlists"
						>
							{$_('device.inWishlist')}
						</a>
					{/if}{/if}
				{#if item.exchange_model}
					{#if exchange === true}
						<div
							class="bg-white-90 top-0 right-0 absolute tc w-100 h-100 br1"
							class:db={exchange}
							transition:fade
						>
							<div class="flex flex-column justify-end items-center h-100">
								<div class="ttu mb3 f7">{$_('message.exchangeWith')}</div>
								<div class="fw5 ttc f6">{item.exchange_model.model_name}</div>
								<div class="fw5 f6">
									{$_('device.color')}:
									{item.exchange_model.color_name}
								</div>
								<div class="fw5 f6">
									{$_('device.strCa')}:
									{item.exchange_model.capacity_name}
								</div>
								<div
									class="fw6 mt3 mb3 f6"
									class:red={item.real_exchange_price >= 0}
									class:dark-blue={item.real_exchange_price < 0}
								>
									{$_(displayExchangeBuyerStr(item.real_exchange_price))}

									<div class="f4 fw6">
										{displayCurrencyReverse(
											item.real_exchange_price,
											$currency
										)}
										{$currency}
									</div>
								</div>
							</div>
						</div>
					{/if}
					<span class="absolute bg-light-yellow near-black fw6 f7 exchangeable">
						{$_('device.exchangeable')}
					</span>
				{/if}

				{#if Number(item.real_sale_price) < Number(item.sale_price)}
					<span class="percent_discount fw6">
						-{formatPercentage(
							Number(item.real_sale_price),
							Number(item.sale_price)
						)}%
					</span>
				{/if}
			</div>
		</div>
		<div class="deviceExchange-content">
			<div class="name pointer ttc f6" on:click={handleGotoDetail}>
				{item.model}
				{item.capacity}{$_('label.GB')}
				{item.color}
			</div>
			{#if item.dingtoi_rating}
				<div class="mt1 relative">
					<div class="grade flex justify-between">
						<span class="f7 gray">{$_('device.physicalGrading')}:</span>
						<span class="f7 dark-blue" on:click={() => (isOpenModalPG = true)}>
							{$_('deviceDetail.grade')}
							{item.physical_grading}
							<sup>ⓘ</sup>
						</span>
					</div>

					<div class="flex items-center justify-between mt1">
						<span class="f7 gray">{$_('label.dingtoiRating')}:</span>
						<PcRating rating={item.dingtoi_rating} />
					</div>
				</div>
			{/if}

			<div
				class="mt1 link f7 blue fw6"
				on:click={() => (isOpenImageScan = true)}
			>
				{$_('device.scanReport')}
			</div>

			{#if Number(item.real_sale_price) > 0}
				<div class="flex justify-between items-center mt2">
					<b class="db price">
						<big>{displayCurrency(item.real_sale_price, $currency)}</big>
						<sup><u>{$currency}</u></sup>
					</b>
					<div class="old-price f7 gray">
						{#if Number(item.real_sale_price) < Number(item.sale_price)}
							<div class="">
								<del>{item.sale_price} <u>{$currency}</u></del>
							</div>
						{/if}
					</div>
				</div>
			{/if}
			<div class="flex mt2">
				{#if !item.exchange_model}
					{#if !isLoadingCart}
						<span
							on:click={() => handleAddToCart(config.sell)}
							class="flex-1 br2 b--dark-blue bg-dark-blue ba w-40-px h-40-px flex
								items-center justify-center pointer tc"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="#fff"
								width="24px"
								height="24px"
								><path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
								<path
									d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
								/></svg
							>
						</span>
					{/if}
				{:else}
					<span
						on:click={handleSelectAddToCart}
						class="flex-1 br2 b--dark-blue bg-dark-blue ba w-40-px h-40-px flex
							items-center justify-center pointer tc"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#fff"
							width="24px"
							height="24px"
							><path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
							<path
								d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
							/></svg
						>
					</span>
				{/if}

				<!-- <span
					class="br1 b--dark-blue bg-white ba w-40-px h-40-px flex items-center
						justify-center pointer tc"
					on:click={() => (isOpenImageScan = true)}
				>
					<svg
						width="24"
						height="24"
						fill="#2F3A97"
						x="0px"
						y="0px"
						viewBox="0 0 192.287 192.287"
					>
						<g>
							<path
								d="M122.901,0H19.699v192.287h152.889v-142.6L122.901,0z M146.981,45.299h-19.686V25.612L146.981,45.299z M34.699,177.287V15 h77.596v37.799c0,4.142,3.357,7.5,7.5,7.5h37.793v116.988H34.699z"
							/>
							<rect x="53.141" y="149.004" width="86.006" height="10" />
							<rect x="53.141" y="55.101" width="51.058" height="10" />
							<polygon
								points="121.248,86.935 126.79,86.935 105.371,108.353 88.623,91.605 51.597,128.634 58.667,135.706 88.623,105.748  105.371,122.495 133.861,94.005 133.861,99.535 143.861,99.535 143.861,76.935 121.248,76.935 	"
							/>
							<rect x="53.141" y="33.283" width="51.058" height="10" />
						</g>
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
						<g />
					</svg>
				</span> -->
				{#if item.exchange_model}
					<span
						on:click={() => (exchange = !exchange)}
						class:bg-dark-blue={exchange === true}
						class="br2 b--dark-blue bg-white ba w-40-px h-40-px flex items-center
							justify-center pointer tc ml3"
					>
						{#if !exchange}
							<svg fill="#2F3A97" width="30" height="30" viewBox="0 0 438 512"
								><path
									d="M78.73,300.59a0,0,0,0,0,0,0,190.27,190.27,0,0,1-2.46-30.51A189.08,189.08,0,0,1,221.42,86.21l-23.14,27.87,23.13,19.21L280.78,61.8,201.54,17.43,186.85,43.67l24.91,13.95A219.23,219.23,0,0,0,54.35,329.4s0,.05,0,.07Z"
									transform="translate(-46.2)"
								/>
								<path
									d="M481,231.34l-31.67-4.93A189.06,189.06,0,0,1,329.6,446.7l19.82-31L324.09,399.5l-50,78.3L358.17,512l11.33-27.86-26-10.55A219.27,219.27,0,0,0,481,231.34Z"
									transform="translate(-46.2)"
								/>
								<path
									d="M421.8,0H308.19a19.65,19.65,0,0,0-19.64,19.68V250.35A19.65,19.65,0,0,0,308.19,270H421.8a19.67,19.67,0,0,0,19.66-19.65V19.68A19.68,19.68,0,0,0,421.8,0Zm4.92,218.76H303.28V33.19H426.72ZM391.34,20H338.66V14.22h52.68V20Zm22.53-2.63a5,5,0,1,1-5-5A5,5,0,0,1,413.87,17.34ZM389,249H341V234.28h48Z"
									transform="translate(-46.2)"
								/>
								<path
									d="M222.66,242H109.05a19.64,19.64,0,0,0-19.64,19.68V492.35A19.64,19.64,0,0,0,109.05,512H222.66a19.67,19.67,0,0,0,19.65-19.65V261.68A19.67,19.67,0,0,0,222.66,242Zm4.92,218.76H104.14V275.19H227.58ZM192.19,262H139.52v-5.75H192.2V262Zm22.54-2.63a5,5,0,1,1-5-5A5,5,0,0,1,214.73,259.34ZM189.83,491h-48V476.28h48Z"
									transform="translate(-46.2)"
								/>
							</svg>
						{:else}
							<svg fill="#fff" width="30" height="30" viewBox="0 0 438 512"
								><path
									d="M78.73,300.59a0,0,0,0,0,0,0,190.27,190.27,0,0,1-2.46-30.51A189.08,189.08,0,0,1,221.42,86.21l-23.14,27.87,23.13,19.21L280.78,61.8,201.54,17.43,186.85,43.67l24.91,13.95A219.23,219.23,0,0,0,54.35,329.4s0,.05,0,.07Z"
									transform="translate(-46.2)"
								/>
								<path
									d="M481,231.34l-31.67-4.93A189.06,189.06,0,0,1,329.6,446.7l19.82-31L324.09,399.5l-50,78.3L358.17,512l11.33-27.86-26-10.55A219.27,219.27,0,0,0,481,231.34Z"
									transform="translate(-46.2)"
								/>
								<path
									d="M421.8,0H308.19a19.65,19.65,0,0,0-19.64,19.68V250.35A19.65,19.65,0,0,0,308.19,270H421.8a19.67,19.67,0,0,0,19.66-19.65V19.68A19.68,19.68,0,0,0,421.8,0Zm4.92,218.76H303.28V33.19H426.72ZM391.34,20H338.66V14.22h52.68V20Zm22.53-2.63a5,5,0,1,1-5-5A5,5,0,0,1,413.87,17.34ZM389,249H341V234.28h48Z"
									transform="translate(-46.2)"
								/>
								<path
									d="M222.66,242H109.05a19.64,19.64,0,0,0-19.64,19.68V492.35A19.64,19.64,0,0,0,109.05,512H222.66a19.67,19.67,0,0,0,19.65-19.65V261.68A19.67,19.67,0,0,0,222.66,242Zm4.92,218.76H104.14V275.19H227.58ZM192.19,262H139.52v-5.75H192.2V262Zm22.54-2.63a5,5,0,1,1-5-5A5,5,0,0,1,214.73,259.34ZM189.83,491h-48V476.28h48Z"
									transform="translate(-46.2)"
								/>
							</svg>
						{/if}
					</span>
				{/if}
				<!-- <span
					class="br1 b--light-gray bg-white ba w-40-px h-40-px flex items-center
						justify-center pointer tc ml3"
					on:click={handleGotoDetail}>
					<svg
						fill="#3f4254"
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
					</svg>
				</span> -->
			</div>
		</div>
	</div>
{/if}

<style>
	.device-image {
		height: 200px;
		display: block;
	}

	.images {
		overflow: hidden;
		height: 100%;
	}
	.image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.name {
		min-height: 42px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.w-40-px {
		width: 40px;
	}

	.exchangeable {
		top: 0;
		left: 0;
		border-bottom-right-radius: 10px;
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		text-transform: capitalize;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
	}
	.br--top-left-0 {
		border-top-left-radius: 0;
	}

	.isFavorite {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		top: 0;
		right: 0;
		border-radius: 50%;
	}

	.isWishlist {
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 10px;
		right: 10px;
		padding: 0 10px;
		height: 30px;
		line-height: 30px;
		background-color: #fcdb05;
		color: #2f3a97;
		text-decoration: none;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
	}

	.percent_discount {
		position: absolute;
		bottom: 10px;
		left: 10px;
		background-color: rgb(255, 66, 78);
		color: white;
		font-size: 10px;
		height: 20px;
		line-height: 20px;
		padding: 0 4px;
		border-radius: 4px;
	}
	.deviceExchange-content {
		padding: 10px;
	}
</style>
