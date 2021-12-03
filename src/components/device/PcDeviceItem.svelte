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
		displayProposalBuyerExchangeStr,
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
	import PcModalSelectAddToCart from '../modal/PcModalSelectAddToCart.svelte';
	import {
		addWishlist as apiAddWishlist,
		deleteWishlist as apiDeleteWishlist,
	} from '../../services/device';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcModalPhysicalGrading from '../modal/PcModalPhysicalGrading.svelte';

	const { session, page } = stores();
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
		if (observer && containerEle) {
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
		<PcModalSelectAddToCart
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
	<div class="device pb3" bind:this={containerEle}>
		<div
			class="device-image pointer"
			class:br--top-left-0={item.exchange_model}
		>
			<div class="images relative flex items-center justify-center br1">
				<img
					data-src={item.url}
					on:click={handleGotoDetail}
					src={'images/phone_default.png'}
					alt={item.model}
					class="image br1 lazy"
				/>

				{#if item.wishlist_id}
					<span
						class="isFavorite absolute pointer grow"
						on:click={handleDeleteFavorite}
					>
						{#if isLoadingWishlist}
							<LoadingDefault color="#cccccc" />
						{:else}
							<svg fill="#F64E60" height="24" viewBox="0 0 24 24" width="24">
								<path d="M0 0h24v24H0z" fill="none" />
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
						<a class="isWishlist absolute" href="/my-wishlists">
							<svg
								fill="#2F3A97"
								height="20"
								viewBox="-16 0 383 384"
								width="20"
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
							<span class="ml3 b ttu f7">{$_('device.inWishlist')}</span>
						</a>
					{/if}
				{/if}

				{#if item.exchange_model}
					{#if exchange === true}
						<div
							class="bg-white-90 top-0 right-0 absolute tc w-100 h-100 br1"
							class:db={exchange}
							transition:fade
						>
							<div class="flex flex-column justify-center items-center h-100">
								<div class="ttu mb3 f7">{$_('message.exchangeWith')}</div>
								<div class="fw5 ttc">{item.exchange_model.model_name}</div>
								<div class="fw5">
									{$_('device.color')}:
									{item.exchange_model.color_name}
								</div>
								<div class="fw5">
									{$_('device.strCa')}:
									{item.exchange_model.capacity_name}
								</div>
								<div
									class="fw6 mt4 mb1 ttc"
									class:red={item.real_exchange_price >= 0}
									class:dark-blue={item.real_exchange_price < 0}
								>
									{$_(
										displayProposalBuyerExchangeStr(item.real_exchange_price)
									)}
									<!-- {$_(displayExchangeBuyerStr(item.real_exchange_price))} -->

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
					<div
						class="tag-mode flex items-center justify-center absolute top-0
							left-0"
					/>
					<span class="absolute dark-blue f7 b exchangeable rotate-315 ttu">
						{$_('device.exchangeable')}</span
					>
				{/if}
			</div>
		</div>
		<div class="deviceExchange-content pt3">
			<div class="name mb3 pointer ttc" on:click={handleGotoDetail}>
				{item.model}
				{item.color}
				{item.capacity}
				{$_('label.GB')}
			</div>
			{#if item.dingtoi_rating}
				<div class="flex items-center mb3 relative">
					<div
						class="grade flex-1 dark-blue pointer"
						on:click={() => (isOpenModalPG = true)}
					>
						{$_('deviceDetail.grade')}
						{item.physical_grading}
						<span> <sup class="cursor-help"> ⓘ </sup> </span>
					</div>
					<div
						class="tooltip cursor-help"
						on:mouseenter={handleTooltipRatingOpen}
						on:mouseleave={handleTooltipRatingClose}
					>
						<PcRating rating={item.dingtoi_rating} />
						{#if isOpenTooltipRating}
							<div
								class="tooltip-content z-max absolute ma0 pa3 bg-black white br1 shadow-1 f6 fw4 near-black tl right"
							>
								{$_('label.dingtoiRating')}
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#if Number(item.real_sale_price) > 0}
				<div class="">
					<div class="b price f4">
						<big>{displayCurrency(item.real_sale_price, $currency)}</big>
						<sup>{$currency}</sup>
					</div>
					<div class="old-price">
						{#if Number(item.real_sale_price) < Number(item.sale_price)}
							<del class="f7">{item.sale_price} <u>{$currency}</u></del>
							<span class="percent_discount ml3 fw6">
								-{formatPercentage(
									Number(item.real_sale_price),
									Number(item.sale_price)
								)}%
							</span>
						{/if}
					</div>
				</div>
			{/if}
			<div class="flex mt3">
				{#if !item.exchange_model}
					{#if !isLoadingCart}
						<span
							on:click={(event) => {
								handleAddToCart(config.sell);
							}}
							class="br1 b--light-yellow bg-light-yellow ba w-40-px h-40-px flex
								items-center justify-center pointer tc mr3"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="#2F3A97"
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
						class="br1 b--light-yellow bg-light-yellow ba w-40-px h-40-px flex
							items-center justify-center pointer tc mr3"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#2F3A97"
							width="24px"
							height="24px"
							><path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
							<path
								d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
							/></svg
						>
					</span>
				{/if}

				<span
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
				</span>
				{#if item.exchange_model}
					<span
						on:mouseenter={() => (exchange = true)}
						on:mouseleave={() => (exchange = false)}
						class:bg-dark-blue={exchange === true}
						class="br1 b--dark-blue bg-white ba w-40-px h-40-px flex items-center
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
				<span
					class="br1 b--light-gray bg-white ba w-40-px h-40-px flex items-center
						justify-center pointer tc ml3"
					on:click={handleGotoDetail}
				>
					<svg
						fill="#3f4254"
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
						/>
					</svg>
				</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.flex-1 {
		flex-grow: 1;
	}

	.device-image {
		height: 294px;
		display: block;
		border-radius: 5px;
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
		height: 44px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.name:hover {
		text-decoration: underline;
	}
	.w-40-px {
		width: 40px;
	}
	.tag-mode {
		width: 0;
		height: 0;
		border-top: 95px solid #feda00;
		border-right: 95px solid transparent;
	}
	.exchangeable {
		top: 32px;
		left: -8px;
	}
	.br--top-left-0 {
		border-top-left-radius: 0;
	}
	.tooltip-content {
		bottom: calc(100% + 5px);
		left: 0;
		max-width: 100%;
		max-height: 300px;
		overflow: auto;
		display: block;
	}
	.tooltip-content.right {
		left: auto;
		right: 0;
		bottom: calc(100% + 5px);
	}
	.cursor-help {
		cursor: help;
	}

	.isFavorite {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		top: 10px;
		right: 10px;
		border-radius: 50%;
	}

	.isWishlist {
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 0;
		right: -10px;
		width: 140px;
		height: 30px;
		background-color: #fcdb05;
		color: #2f3a97;
		text-decoration: none;
		transform: skewX(-20deg);
	}
	.isWishlist svg {
		transform: skewX(20deg);
	}
	.isWishlist span {
		transform: skewX(20deg);
	}

	.percent_discount {
		background-color: rgb(255, 66, 78);
		color: white;
		font-size: 12px;
		padding: 2px 4px;
		border-radius: 3px;
	}
	.old-price {
		min-height: 21px;
	}
</style>
