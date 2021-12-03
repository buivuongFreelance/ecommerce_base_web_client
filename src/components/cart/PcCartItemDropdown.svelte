<script>
	import { fade } from 'svelte/transition';
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import { currency, auth, cartChanged, anonymous } from '../../stores';
	import {
		displayCurrency,
		displayProposalBuyerExchangeStr,
	} from '../../functions';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { removeCart as apiRemoveCart } from '../../services/cart';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import config from '../../config';

	const { session } = stores();
	const { domainCart } = $session;

	export let top = 0;
	export let left = 0;
	export let list = [];

	let isLoadingRemove = false;

	const handleDeleteCart = async (item) => {
		try {
			const result = await swal.fire({
				position: 'top',
				icon: 'question',
				showCancelButton: true,
				cancelButtonText: $_('message.no'),
				confirmButtonText: $_('message.yes'),
				reverseButtons: true,

				customClass: {
					icon: 'icon-question',
				},
				title: $_('message.remove'),
				text: $_('message.questionRemove'),
			});
			if (result.value) {
				await removeCart(item.id);
				cartChanged.update((n) => n + 1);
			}
		} catch (error) {}
	};

	const removeCart = (id) => {
		isLoadingRemove = true;
		let token = '';
		if ($auth) token = $auth.accessToken;
		return new Promise((resolve, reject) => {
			apiRemoveCart(domainCart, { token, id, anonymous: $anonymous })
				.then(() => {
					isLoadingRemove = false;
					resolve();
				})
				.catch(() => {
					isLoadingRemove = false;
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
					reject();
				});
		});
	};
</script>

<style>
	.list {
		width: max-content;
		top: var(--top);
		left: var(--left);
	}
	.w-dropdown {
		height: 275px;
		overflow-y: auto;
	}
	.your-cart {
		color: #7e8299;
	}
	.img-cart-div {
		width: 55px;
		height: 55px;
	}
	.img-cart {
		width: 50px;
		height: 50px;
		object-fit: cover;
	}
	.w-name {
		width: 265px;
	}
	.type {
		color: #7e8299;
	}
	.button {
		position: sticky;
		bottom: 0;
		right: 0;
		transition: opacity 0.5s;
	}
	button:hover {
		opacity: 0.9;
	}
	.nowrap {
		white-space: nowrap;
	}
</style>

<ul
	class:w-dropdown={list.length > 2}
	transition:fade
	class="z-max absolute list ma0 pt3 ph0 bg-white br2 shadow-2 popup"
	style="--top: {top}px; --left: {left}px">
	<li class="your-cart ph3 b mb3 f6">{$_('cart.yourCart')}</li>
	{#if isLoadingRemove}
		<li class="flex items-center justify-center">
			<LoadingDefault color="#cccccc" />
		</li>
	{:else}
		{#each list as item}
			<li class="flex justify-between ph3 lh-title mb3">
				<div class="flex">
					<div class="ba br2 b--light-gray pa2 flex items-center img-cart-div">
						<img src={item.url} alt="" class="img-cart" />
					</div>
					<div class="w-name mh3">
						<a
							href={'device/' + item.device_id}
							class="link dim f6 db near-black fw5">{item.model}
							{item.color}
							{item.capacity}
							{$_('label.GB')}</a>
						{#if item.cart_type === config.exchange}
							{#if item.exchange_model}
								<span class="f7 type">{$_('message.exchangeWith')}
									{item.exchange_model.model_name}
								</span>
							{/if}
						{/if}
					</div>
				</div>
				<div>
					<div class="nowrap b f6">
						{#if item.cart_type === config.exchange}
							{#if item.real_exchange_price >= 0}
								{displayCurrency(item.real_exchange_price, $currency)}
							{:else}
								<span
									class="fw5 f7">{$_(displayProposalBuyerExchangeStr(item.real_exchange_price))}</span>
								{displayCurrency(item.real_exchange_price, $currency)}
							{/if}
						{:else}{displayCurrency(item.real_sale_price, $currency)}{/if}
						{$currency}
					</div>

					<div
						class="flex items-center mt1 justify-end pointer"
						on:click|stopPropagation={() => handleDeleteCart(item)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#7e8299"
							width="24px"
							height="24px"><path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
						</svg>
					</div>
				</div>
			</li>
		{/each}
	{/if}

	{#if list.length > 0}
		<div class="tc button w-100 bg-white">
			<button
				on:click={async () => {
					await goto('/cart');
				}}
				class="db h-40-px w-100 white tc ba bg-dark-blue b--dark-blue btn-width pointer br2 br--bottom
					b f6">{$_('cart.viewCart')}
				({list.length})</button>
		</div>
	{/if}
</ul>
