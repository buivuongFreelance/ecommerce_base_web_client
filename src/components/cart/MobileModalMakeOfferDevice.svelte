<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcOfferExchange from './PcOfferExchange.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { addBuyerCreatedProposal as apiAddBuyerCreatedProposal } from '../../services/proposal';
	import { auth, currency } from '../../stores';
	import { convertToUsd, displayCurrency } from '../../functions';
	import config from '../../config';
	import { fade } from 'svelte/transition';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import MobileOfferExchange from './MobileOfferExchange.svelte';
	import IconClose from '../icon/IconClose.svelte';

	const { session } = stores();
	const { domainProposal } = $session;

	export let onClose;
	export let onSuccess;
	export let cart;

	let isLoadingComplete = false;

	let exchangePrice = 0;
	let exchangeDevices = [];
	let isOpenModal = false;
	let typeExchange = config.exchangeType.offer;

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
				buyerSalePrice: 0,
				buyerExchangePrice:
					typeExchange == config.exchangeType.request
						? convertToUsd(exchangePrice, $currency)
						: convertToUsd(-exchangePrice, $currency),
				type: config.exchange,
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
	const getContentSellAcceptCartSellToExchange = ({
		action,
		devices,
		money_exchange,
		price,
	}) => {
		let textDesc = '';
		let strDevices = '';

		if (devices.length > 0) {
			devices.forEach((device, index) => {
				strDevices += `${device.model} - ${device.capacity} ${$_(
					'label.GB'
				)} - ${device.color}${index < devices.length - 1 ? ', ' : ''}`;
			});
		}

		textDesc = $_('proposal.offerConfirmCartTypeFromSellToExchange', {
			values: {
				action: action,
				devices: strDevices,
				money_exchange: money_exchange + ' ' + $currency,
				price: price + ' ' + $currency,
			},
		});

		return textDesc;
	};
	const handleSubmit = async () => {
		isOpenModal = true;

		let flag = true;
		if (exchangeDevices.length === 0) {
			flag = false;
			swal.fire({
				position: 'top',
				icon: 'error',
				title: $_('error.formError'),
				text: $_('error.exchangeError'),
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
			if (cart.cart_type === config.sell) {
				textDesc = getContentSellAcceptCartSellToExchange({
					action:
						typeExchange == config.exchangeType.request
							? $_('cart.exchangeReceive')
							: $_('cart.exchangePay'),
					devices: exchangeDevices,
					money_exchange: displayCurrency(exchangePrice, $currency),
					price: displayCurrency(cart.real_sale_price, $currency),
				});
			}

			try {
				if (cart.cart_type === config.sell) {
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
	<div class="modal-default">
		<div class="modal__header bg-light-gray b">
			<span>{$_('proposal.makeOfferWithDevice')}</span>
			<div class="pointer" on:click={onClose}>
				<IconClose fill="7e8299" />
			</div>
		</div>
		<div class="modal__body">
			<MobileOfferExchange
				{cart}
				bind:typeExchange
				bind:bindValue={exchangePrice}
				bind:selectedExchangeDevices={exchangeDevices}
			/>
		</div>
		<div class="modal__footer">
			{#if isLoadingComplete}
				<button
					type="button"
					class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
								items-center justify-center grow h-40-px w-btn tracked"
				>
					<LoadingDefault />
				</button>
			{:else}
				<button
					type="button"
					on:click={handleSubmit}
					class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
								pointer items-center justify-center dim h-40-px w-btn tracked near-black"
					>{$_('message.send')}</button
				>
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
		height: 100%;
		overflow: hidden;
		border-radius: 10px;
		width: calc(100% - 30px);
		padding-top: 30px;
	}

	.w-btn {
		width: 130px;
	}
</style>
