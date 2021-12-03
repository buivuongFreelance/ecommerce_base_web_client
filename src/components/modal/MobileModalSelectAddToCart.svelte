<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import config from '../../config';
	import { stores } from '@sapper/app';
	import { auth, anonymous, cartChanged, currency } from '../../stores';
	import { addToCart as apiAddToCart } from '../../services/cart';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		displayCurrency,
		displayCurrencyReverse,
		displayExchangeBuyerStr,
	} from '../../functions';
	const { session } = stores();
	const { domainCart } = $session;

	export let onClose;
	export let item;
	export let typeAdd;
	let isLoadingCart = false;

	const addToCart = (typeAdd) => {
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
				type: typeAdd,
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
	const handleAddToCart = async (typeAdd) => {
		try {
			await addToCart(typeAdd);
			onClose();
			cartChanged.update((n) => n + 1);
		} catch (error) {}
	};
</script>

<div class="fixed z-max wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div class="flex items-center justify-end pa3">
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</div>
		</div>
		<div class="content pv3">
			<div
				class="flex items-start justify-between spacing-ext bb b--light-gray pb4"
			>
				<div class="mb4">
					<label class="light-silver radio pointer">
						<input type="radio" value={config.sell} bind:group={typeAdd} />
						<span class="box" />
						<span
							class="label fw6 ml3 f4"
							class:dark-blue={typeAdd === config.sell}
							>{$_('cart.buyThisDevice')}</span
						>
					</label>
					<!-- <p class="ml5 light-silver" class:dark-blue={typeAdd === config.sell}>
						(You buy)
					</p> -->
				</div>
				{#if Number(item.real_sale_price) > 0}
					<div class:dark-blue={typeAdd === config.sell}>
						<div class="f4 b tr">
							{displayCurrency(item.real_sale_price, $currency)}
						</div>
						<div class="tr">{$currency}</div>
					</div>
				{/if}
			</div>
			<div class="flex items-start justify-between spacing-ext pt4">
				<div class="mb4">
					<label class="light-silver radio pointer">
						<input type="radio" value={config.exchange} bind:group={typeAdd} />
						<span class="box" />
						<span
							class="label fw6 ml3 f4"
							class:red={item.real_exchange_price >= 0 &&
								typeAdd === config.exchange}
							class:dark-blue={item.real_exchange_price < 0 &&
								typeAdd === config.exchange}
							>{$_('cart.exchangeThisDevice')}</span
						>
					</label>
					<p
						class="ml5 light-silver"
						class:red={item.real_exchange_price >= 0 &&
							typeAdd === config.exchange}
						class:dark-blue={item.real_exchange_price < 0 &&
							typeAdd === config.exchange}
					>
						({$_(displayExchangeBuyerStr(item.real_exchange_price))}
						)
					</p>
					<div class="pl5">
						<div class="ttu light-silver mt3">{$_('message.exchangeWith')}</div>
						<div class="ttc light-silver">{item.exchange_model.model_name}</div>
						<div class="light-silver">
							{$_('device.color')}
							{item.exchange_model.color_name}
							-
							{$_('device.strCa')}
							{item.exchange_model.capacity_name}
						</div>
					</div>
				</div>
				<div
					class:red={item.real_exchange_price >= 0 &&
						typeAdd === config.exchange}
					class:dark-blue={item.real_exchange_price < 0 &&
						typeAdd === config.exchange}
				>
					<div class="f4 b tr">
						{displayCurrencyReverse(item.real_exchange_price, $currency)}
					</div>
					<div class="tr">{$currency}</div>
				</div>
			</div>
			{#if !isLoadingCart}
				<div class="spacing-ext">
					<span
						on:click={() => handleAddToCart(typeAdd)}
						class="br2 b--dark-blue white bg-dark-blue ba w-40-px h-40-px flex
							items-center justify-center pointer tc"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="white"
							width="24px"
							height="24px"
							><path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
							<path
								d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
							/>
						</svg>
						<span class="ml3"> {$_('cart.addToCart')}</span>
					</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: 405px;
		overflow: hidden;
		width: min(90%, 375px);
	}
	.container {
		max-height: calc(100vh - 120px);
		border-radius: 10px;
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
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
</style>
