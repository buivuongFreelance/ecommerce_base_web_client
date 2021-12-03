<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import {
		sellerAcceptProposal as apiSellerAcceptProposal,
		sellerCancelProposal as apiSellerCancelProposal,
	} from '../../services/proposal';
	import PcQuickOfferBuyer from './PcQuickOfferBuyer.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { currency, auth, settings } from '../../stores';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalRejectOffer from './PcModalRejectOffer.svelte';
	import config from '../../config';
	import { differenceInSeconds } from 'date-fns';
	import { tweened } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';
	import { displayDisclaimer, displayCurrency } from '../../functions';
	import PcTagDevice from '../device/PcTagDevice.svelte';
	import IconInfo from '../icon/IconInfo.svelte';
	import IconClose from '../icon/IconClose.svelte';
	import MobileModalRejectOffer from './MobileModalRejectOffer.svelte';

	const { session } = stores();
	const { domainProposal } = $session;

	export let item;
	export let onSuccessReject = null;
	export let onSuccessAccept = null;
	export let onSuccessCancel = null;
	export let listQuestion;

	let isLoadingAccept = false;
	let isLoadingReject = false;
	let isLoadingCancel = false;
	let isOpenModal = false;
	let selectQuestion = [];
	let remainingAcceptTimeout = 0;
	let timer = null;
	let intervalTimer = null;

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	$: minutes =
		Math.floor($timer / 60) < 10
			? '0' + Math.floor($timer / 60)
			: Math.floor($timer / 60);
	$: minname = minutes > 1 ? $_('message.minutes') : $_('message.minute');
	$: seconds =
		Math.floor($timer - minutes * 60) < 10
			? '0' + Math.floor($timer - minutes * 60)
			: Math.floor($timer - minutes * 60);

	onMount(async () => {
		countdown();
	});

	onDestroy(() => {
		if (intervalTimer) {
			clearInterval(intervalTimer);
		}
		document.body.classList.remove('noscroll');
	});

	const setTimer = () => {
		if ($timer === 0) {
			if (intervalTimer) {
				clearInterval(intervalTimer);
				timer = null;
				remainingAcceptTimeout = 0;
			}
		} else {
			if ($timer > 0) $timer--;
		}
	};

	const countdown = () => {
		if (item) {
			if (item.proposal_status === config.proposal.sellerAccept) {
				const result = Math.abs(
					differenceInSeconds(new Date(item.updated_at), new Date())
				);
				const timeAccept =
					parseFloat($settings[config.sellerAcceptedTime]) * 60;
				if (result < timeAccept) {
					remainingAcceptTimeout = timeAccept - parseFloat(result);
					timer = tweened(remainingAcceptTimeout);
					intervalTimer = setInterval(setTimer, 1000);
				} else {
					remainingAcceptTimeout = 0;
				}
			} else if (item.proposal_status == config.proposal.buyerAccept) {
				const result = Math.abs(
					differenceInSeconds(new Date(item.updated_at), new Date())
				);
				const timeAccept = parseFloat($settings[config.buyerAcceptedTime]) * 60;
				if (result < timeAccept) {
					remainingAcceptTimeout = timeAccept - parseFloat(result);
					timer = tweened(remainingAcceptTimeout);
					intervalTimer = setInterval(setTimer, 1000);
				} else {
					remainingAcceptTimeout = 0;
				}
			}
		}
	};
	const sellerAcceptProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingAccept = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiSellerAcceptProposal(domainProposal, { token, id: item.id })
				.then(() => {
					isLoadingAccept = false;
					resolve();
				})
				.catch((error) => {
					if (error.response) {
						if (error.response.status === 400) {
							if (error.response.data.obj === config.proposal.sellerAccept) {
								isLoadingAccept = false;
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
							isLoadingAccept = false;
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
				)} - ${device.color} ${index < devices.length - 1 ? ',' : ''}`;
			});
		}

		textDesc = $_('proposal.acceptCartTypeFromSellToExchange', {
			values: {
				action: action,
				devices: strDevices,
				money_exchange: money_exchange + ' ' + $currency,
				price: price + ' ' + $currency,
			},
		});

		return textDesc;
	};

	const getContentSellAcceptCartExchangeToSell = ({
		device,
		money_exchange,
		money_sell,
	}) => {
		let textDesc = '';

		textDesc = $_('proposal.acceptCartTypeFromExchangeToSell', {
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
	const handleSellerAccept = async () => {
		let textDesc = '';
		if (item.cart_type === config.sell) {
			if (item.proposal_type === config.exchange) {
				textDesc = getContentSellAcceptCartSellToExchange({
					action: $_(displayDisclaimer(item.buyer_real_exchange_price)),
					devices: item.exchange_devices,
					money_exchange: displayCurrency(
						item.buyer_real_exchange_price,
						$currency
					),
					price: displayCurrency(item.price, $currency),
				});
			}
		}

		if (item.cart_type === config.exchange) {
			if (item.proposal_type === config.sell) {
				textDesc = getContentSellAcceptCartExchangeToSell({
					money_sell: displayCurrency(item.buyer_real_sale_price, $currency),
					money_exchange: displayCurrency(item.exchange_price, $currency),
					device: item.exchange_model,
				});
			}
		}

		await sellerAcceptProposal();
		if (onSuccessAccept) {
			onSuccessAccept();
		}

		if (
			(item.cart_type === config.sell &&
				item.proposal_type === config.exchange) ||
			(item.cart_type === config.exchange && item.proposal_type === config.sell)
		) {
			const result = await swal.fire({
				position: 'top',
				icon: 'info',
				// showCancelButton: true,
				// cancelButtonText: $_('message.no'),
				confirmButtonText: $_('message.ok'),
				reverseButtons: true,
				customClass: {
					icon: 'icon-info',
				},
				text: textDesc, //$_('proposal.warningAccept'),
			});
			if (result.value) {
			}
		}
	};

	const sellerCancelProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingCancel = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiSellerCancelProposal(domainProposal, { token, id: item.id })
				.then(() => {
					isLoadingCancel = false;
					resolve();
				})
				.catch(() => {
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
					isLoadingCancel = false;
					reject();
				});
		});
	};
	const handleSellerCancel = async () => {
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
			title: $_('proposal.cancelAccept'),
			text: $_('proposal.warningCancel'),
		});
		if (result.value) {
			await sellerCancelProposal();

			if (onSuccessCancel) {
				if (intervalTimer) {
					clearInterval(intervalTimer);
				}
				onSuccessCancel();
			}
		}
	};

	const handleSuccessReject = () => {
		isOpenModal = false;
		if (onSuccessReject) onSuccessReject(item, selectQuestion);
	};
</script>

<style>
	.device-info {
		width: calc(100% - 120px);
	}
	.w-image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}
	/* .icon-close {
		position: absolute;
		top: 10px;
		right: 10px;
	} */
	.offer {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
		border-radius: 10px;
	}
</style>

{#if isOpenModal}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
		<MobileModalRejectOffer
			{item}
			bind:isLoadingReject
			bind:selectQuestion
			onSuccess={handleSuccessReject}
			onClose={() => {
				isOpenModal = false;
			}} />
	</Portal>
{/if}
{#if item}
	<div class="offer pa4 bg-light-gray mt4">
		<div class="flex">
			<div class="ba b--white bw2 br2 flex items-center justify-center w-image">
				<img src={item.url} alt="no" class="image ba b--white" />
			</div>
			<div class="device-info ml4 flex justify-between">
				<div>
					<div class="b link near-black db ttc">
						{item.model}

						{item.capacity}
						{$_('label.GB')}

						{item.color}
					</div>
					<div class="mt3">
						{$_('device.status')}:

						<PcTagDevice status={item.device_status} className="ml1" />
					</div>
				</div>
			</div>
		</div>
		<div class="mt3 items-center">
			<PcQuickOfferBuyer {item} {listQuestion} />
		</div>

		{#if !item.is_proposal_accept || item.is_proposal_accept === item.id}
			{#if item.proposal_status == config.proposal.sellerAccept}
				{#if remainingAcceptTimeout}
					{#if isLoadingCancel}
						<button
							type="button"
							class="fw6 ph3 h-40-px br2 ba b--light-gray bg-white near-black flex items-center grow pointer mt3">
							<LoadingDefault />
						</button>
					{:else}
						<button
							type="button"
							on:click={handleSellerCancel}
							class="fw6 ph3 h-40-px br2 ba b--light-gray bg-white near-black flex items-center grow pointer mt3">{$_('proposal.cancelAccept')}
							({minutes}
							:
							{seconds})</button>
					{/if}
				{:else}
					<button
						disabled={true}
						type="button"
						class="fw6 ph3 h-40-px br2 ba b--light-gray bg-white near-black flex items-center grow pointer o-50 mt3">{$_('proposal.cancelAccept')}</button>
				{/if}
			{/if}
			<div class="flex mt3 m-btn">
				{#if item.proposal_status !== config.proposal.sellerReply && item.proposal_status !== config.proposal.sellerReject && item.proposal_status !== config.proposal.sellerAccept}
					{#if isLoadingAccept}
						<button
							type="button"
							class="bg-dark-blue b--dark-blue br1 ba fw6 ttu white flex items-center justify-center grow h-40-px ph4 tracked mr3">
							<LoadingDefault />
						</button>
					{:else}
						<button
							type="button"
							on:click={handleSellerAccept}
							class="fw6 ph4 h-40-px br1 white bg-dark-blue bn flex items-center grow pointer mr3">
							{$_('message.accept')}
						</button>
					{/if}
				{/if}

				{#if item.proposal_status == config.proposal.buyerCreated || item.proposal_status == config.proposal.buyerReply}
					{#if isLoadingReject}
						<button
							type="button"
							class="fw6 ph4 h-40-px br1 ba b--light-gray bg-white near-black flex items-center grow pointer">
							<LoadingDefault />
						</button>
					{:else}
						<button
							type="button"
							on:click={() => {
								isOpenModal = true;
							}}
							class="fw6 ph4 h-40-px br1 ba b--light-gray bg-white near-black flex items-center grow pointer">
							{$_('proposal.reject')}
						</button>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
{/if}
