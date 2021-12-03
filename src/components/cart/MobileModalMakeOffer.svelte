<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcOfferSell from './PcOfferSell.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { addBuyerCreatedProposal as apiAddBuyerCreatedProposal } from '../../services/proposal';
	import { auth, currency } from '../../stores';
	import { convertToUsd, displayCurrency } from '../../functions';
	import config from '../../config';
	import { fade } from 'svelte/transition';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import IconClose from '../icon/IconClose.svelte';

	const { session } = stores();
	const { domainProposal } = $session;

	export let onClose;
	export let onSuccess;
	export let cart;

	let isLoadingComplete = false;

	let sellingPrice = -1;
	let exchangeDevices = [];
	let isOpenModal = false;

	const addBuyerCreatedProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingComplete = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiAddBuyerCreatedProposal(domainProposal, {
				token,
				cartId: cart.id,
				buyerSalePrice: convertToUsd(sellingPrice, $currency),
				buyerExchangePrice: 0,
				type: config.sell,
				exchangeDevices: exchangeDevices,
			})
				.then(() => {
					isLoadingComplete = false;
					resolve();
				})
				.catch((error) => {
					onClose();
					if (error.response) {
						if (error.response.status === 400) {
							if (error.response.data.obj === config.proposal.sellerAccept) {
								isLoadingComplete = false;

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

		if (Math.floor(sellingPrice) === 0) {
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
		}

		if (flag) {
			let textDesc = '';

			if (cart.cart_type === config.exchange) {
				textDesc = getContentSellAcceptCartExchangeToSell({
					money_sell: displayCurrency(sellingPrice, $currency),
					money_exchange: displayCurrency(cart.exchange_price, $currency),
					device: cart.exchange_model,
				});
			}
			try {
				if (cart.cart_type === config.exchange) {
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
						await addBuyerCreatedProposal();
						onSuccess();
					}
				} else {
					await addBuyerCreatedProposal();
					onSuccess();
				}
			} catch (error) {}
		}
	};
</script>

<DimmerModal type="modal" zIndex={isOpenModal ? 1 : 9999} onClick={onClose} />
<div class="fixed wrapper" class:z-9999={!isOpenModal} transition:fade>
	<div class="modal__container">
		<div
			class="modal__header h-50-px flex items-center justify-between bg-light-gray
			 ph4 b panel"
		>
			<div>{$_('message.makeOffer')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<IconClose fill="#7e8299" />
			</div>
		</div>
		<div class="modal__body">
			<div class="">
				<PcOfferSell bind:bindValue={sellingPrice} {cart} />
			</div>
		</div>
		<div class="modal__footer">
			<div class="mt4 flex justify-between">
				<div />
				{#if isLoadingComplete}
					<button
						type="button"
						class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
								items-center justify-center grow  h-40-px w-btn tracked"
					>
						<LoadingDefault />
					</button>
				{:else}
					<button
						type="button"
						on:click={handleSubmit}
						class="bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
						pointer items-center justify-center dim h-40-px w-btn tracked"
						>{$_('message.send')}</button
					>
				{/if}
			</div>
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
		height: 100%;
		overflow: hidden;
		width: calc(100% - 30px);
		padding-top: 30px;
	}
	.modal__container {
		display: flex;
		flex-direction: column;
	}
	.modal__header {
		min-height: 50px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}
	.modal__body {
		flex: 1;
		max-height: calc(100vh - 180px);
		background-color: white;
		padding: 20px 20px 10px;
		overflow: auto;
	}
	.modal__footer {
		background-color: white;
		padding: 0 20px 20px;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}
	.w-btn {
		width: 130px;
	}
</style>
