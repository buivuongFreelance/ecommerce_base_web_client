<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcOfferSell from './PcOfferSell.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		updateBuyerReplyProposal as apiUpdateBuyerReplyProposal,
		detailProposal as apiDetailProposal,
	} from '../../services/proposal';
	import { auth, currency } from '../../stores';
	import {
		convertToUsd,
		displayCurrency,
		displayCurrencyDb,
	} from '../../functions';
	import config from '../../config';
	import ContentLoader from 'svelte-content-loader';
	import { onMount } from 'svelte';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import { fade } from 'svelte/transition';

	const { session } = stores();
	const { domainProposal } = $session;

	export let onClose;
	export let onSuccessBuyerReply;
	export let cart;

	let isLoadingComplete = false;
	let isLoadingDetail = false;
	let isServerError = false;
	let detail = null;

	let sellingPrice = 0;
	let isOpenModal = false;

	onMount(async () => {
		detail = await detailProposal();
		init();
	});

	const init = () => {
		if (detail.status.includes(config.buyer)) {
			sellingPrice = displayCurrencyDb(detail.buyer_sale_price, $currency);
		} else {
			sellingPrice = displayCurrencyDb(detail.buyer_real_sale_price, $currency);
		}
	};

	const detailProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingDetail = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiDetailProposal(domainProposal, {
				token,
				id: cart.proposal_id,
			})
				.then((obj) => {
					isLoadingDetail = false;
					isServerError = false;
					resolve(obj);
				})
				.catch(() => {
					isLoadingDetail = false;
					isServerError = true;
					reject();
				});
		});
	};

	const updateBuyerReplyProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingComplete = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiUpdateBuyerReplyProposal(domainProposal, {
				token,
				id: cart.proposal_id,
				cartId: cart.id,
				buyerSalePrice: convertToUsd(sellingPrice, $currency),
				buyerExchangePrice: 0,
				type: config.sell,
				exchangeDevices: [],
			})
				.then(() => {
					isLoadingComplete = false;
					resolve();
				})
				.catch((error) => {
					if (error.response) {
						if (error.response.status === 400) {
							if (error.response.data.obj === config.proposal.sellerAccept) {
								isLoadingComplete = false;
								onClose();
								swal.fire({
									position: 'top',
									icon: 'warning',
									title: $_('error.deviceAccepted'),
									text: $_('error.descdeviceAccepted'),
									reverseButtons: true,
									customClass: {
										icon: 'icon-warning',
									},
								});
							}
						} else {
							isLoadingComplete = false;
							onClose();
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
					}
					reject();
				});
		});
	};
	const getContentSellAcceptCartExchangeToSell = ({
		device,
		money_exchange,
		money_sell,
	}) => {
		let textDesc = '';

		textDesc = $_('proposal.offerConfirmCartTypeFromExchangeToSell', {
			values: {
				device:
					device.model_name +
					' - ' +
					device.capacity_name +
					' - ' +
					device.color_name,
				money_exchange: money_exchange + ' ' + $currency,
				money_sell: money_sell + ' ' + $currency,
			},
		});
		return textDesc;
	};
	const handleSubmit = async () => {
		isOpenModal = true;

		let flag = true;
		if (Math.floor(Number(sellingPrice)) === 0) {
			flag = false;
			swal.fire({
				position: 'top',
				icon: 'error',
				title: $_('error.formError'),
				text: $_('error.salePrice'),
				reverseButtons: true,
				customClass: {
					icon: 'icon-error',
				},
				onClose: () => {
					isOpenModal = false;
				},
			});
		} else if (Number(sellingPrice) <= Number(detail.buyer_real_sale_price)) {
			flag = false;
			swal.fire({
				position: 'top',
				icon: 'error',
				title: $_('error.formError'),
				text: $_('error.salePriceLarge', {
					values: { number: detail.buyer_real_sale_price + ' ' + $currency },
				}),
				reverseButtons: true,
				customClass: {
					icon: 'icon-error',
				},
				onClose: () => {
					isOpenModal = false;
				},
			});
		}

		if (flag) {
			let textDesc = '';

			if (cart.cart_type === config.exchange) {
				textDesc = getContentSellAcceptCartExchangeToSell({
					money_sell: displayCurrency(sellingPrice, $currency),
					money_exchange: displayCurrency(cart.real_exchange_price, $currency),
					device: cart.exchange_model,
				});
			}
			try {
				if (cart.cart_type == config.exchange) {
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
						text: textDesc,
						onClose: () => {
							isOpenModal = false;
						},
					});
					if (result.value) {
						await updateBuyerReplyProposal();
						onSuccessBuyerReply();
					}
				} else {
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
						title: $_('proposal.viewOffer'),
						text: $_('proposal.questionChange'),
						onClose: () => {
							isOpenModal = false;
						},
					});
					if (result.value) {
						await updateBuyerReplyProposal();
						onSuccessBuyerReply();
					}
				}
			} catch (error) {}
		}
	};
</script>

<DimmerModal type="modal" zIndex={isOpenModal ? 1 : 9999} onClick={onClose} />
{#if detail}
	<div class="fixed wrapper" class:z-9999={!isOpenModal} transition:fade>
		<div class="w-100 bg-white container">
			<div
				class="h-50-px flex items-center justify-between bg-light-gray
			 ph4 b panel"
			>
				<div class="flex item-center">{$_('message.makeOffer')}</div>
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
			<div class="ph4 content">
				{#if isServerError}
					<p class="mt4 red f4 tc">{$_('error.serverErrorMessage')}</p>
				{:else if isLoadingDetail}
					<div class="flex justify-center mv4">
						<ContentLoader width="800" uniqueKey="slideshow">
							<rect x="0" y="0" rx="5" ry="5" width="800" height="400" />
						</ContentLoader>
					</div>
				{:else}
					<div class="mt4">
						<PcOfferSell {cart} bind:bindValue={sellingPrice} {detail} />
					</div>
					<div class="mt5 flex justify-between items-center">
						{#if detail}
							{#if detail.type == config.sell && detail.status !== config.proposal.systemCancelAccept}
								<p>
									{$_('proposal.lastOffer')}:
									{displayCurrency(detail.buyer_real_sale_price, $currency)}
									{$currency}
								</p>
							{:else}
								<div />
							{/if}
						{/if}
						{#if isLoadingComplete}
							<button
								type="button"
								class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
								items-center justify-center grow  h-40-px w-btn tracked"
							>
								<LoadingDefault />
							</button>
						{:else if detail}
							{#if detail.status.includes(config.buyer) || detail.status === config.proposal.sellerReject || detail.status === config.proposal.systemCancelAccept}
								<button
									type="button"
									on:click={handleSubmit}
									class="bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
						pointer items-center justify-center dim h-40-px w-btn tracked"
									>{$_('message.send')}</button
								>
							{/if}
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: 600px;
		overflow: hidden;
		border-radius: 10px;
		width: 575px;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.panel {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
	.w-btn {
		width: 130px;
	}
</style>
