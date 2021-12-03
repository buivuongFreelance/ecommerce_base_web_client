<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { auth, currency, linkToBack, settings } from '../../stores';
	import {
		detailProposal as apiDetailProposal,
		sellerDeleteProposal as apiDeleteProposal,
		updateSellerReplyProposal as apiUpdateSellerReplyProposal,
		sellerAcceptProposal as apiSellerAcceptProposal,
		sellerCancelProposal as apiSellerCancelProposal,
		sellerRejectProposal as apiSellerRejectProposal,
		sellerCancelReplyProposal as apiSellerCancelReplyProposal,
	} from '../../services/proposal';
	import ContentLoader from 'svelte-content-loader';
	import { onMount, onDestroy } from 'svelte';
	import {
		convertToUsd,
		displayCurrencyDb,
		displayDateDefault,
	} from '../../functions';
	import config from '../../config';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import MobileOfferExchangeDetail from './MobileOfferExchangeDetail.svelte';
	import MobileOfferSellDetail from './MobileOfferSellDetail.svelte';
	import { tweened } from 'svelte/motion';
	import { differenceInSeconds } from 'date-fns';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import MobileModalRejectOffer from './MobileModalRejectOffer.svelte';

	const { session, page } = stores();
	const { domainProposal } = $session;

	let isServerError = false;
	let isLoading = false;
	let isLoadingDelete = false;
	let isLoadingAccept = false;
	let isLoadingCancel = false;
	let isLoadingReject = false;
	let sellingPrice;
	let exchangePrice;
	let exchangeDevices = [];
	let detail = null;
	let isLoadingComplete = false;
	let isLoadingCancelReply = false;
	let isUpdatePrice = false;
	let isUpdateExchangeDevices = false;
	let remainingAcceptTimeout = 0;
	let timer = null;
	let intervalTimer = null;
	let isOpenModal = false;
	let selectQuestion = [];

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
		await detailProposal();
		init();
		countdown();
	});
	onDestroy(() => {
		if (intervalTimer) {
			clearInterval(intervalTimer);
		}
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
		if (detail) {
			if (detail.status === config.proposal.sellerAccept) {
				const result = Math.abs(
					differenceInSeconds(new Date(detail.updated_at), new Date())
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
			}
		}
	};
	const init = () => {
		if (detail) {
			if (detail.status.includes(config.seller)) {
				if (detail.type === config.sell) {
					sellingPrice = displayCurrencyDb(detail.buyer_sale_price, $currency);
				} else if (detail.type === config.exchange) {
					if (detail.detail_exchange_devices) {
						exchangeDevices = detail.detail_exchange_devices;
					}
					if (detail.status === config.proposal.sellerAccept) {
						exchangePrice = displayCurrencyDb(
							-detail.buyer_real_exchange_price,
							$currency
						);
					} else {
						exchangePrice = displayCurrencyDb(
							-detail.buyer_exchange_price,
							$currency
						);
					}
				}
			} else {
				if (detail.type === config.sell) {
					sellingPrice = displayCurrencyDb(
						detail.buyer_real_sale_price,
						$currency
					);
				} else if (detail.type === config.exchange) {
					if (detail.detail_exchange_devices) {
						exchangeDevices = detail.detail_exchange_devices;
					}
					exchangePrice = displayCurrencyDb(
						-detail.buyer_real_exchange_price,
						$currency
					);
				}
			}
		}
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
			title: $_('proposal.viewOffer'),
			text: $_('proposal.warningCancel'),
		});
		if (result.value) {
			await sellerCancelProposal();
			await goto('my-devices/offers/' + $page.query.deviceId);
		}
	};

	const handleSellerAccept = async () => {
		if (detail.type == config.exchange) {
			if (exchangeDevices.length == 0) {
				if (Math.floor(exchangePrice) == 0) {
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.formError'),
						text: $_('error.salePrice'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
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
					text: $_('proposal.warningAccept'),
				});
				if (result.value) {
					await sellerAcceptProposal();
					await goto('my-devices/offers/' + $page.query.deviceId);
				}
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
				text: $_('proposal.warningAccept'),
			});
			if (result.value) {
				await sellerAcceptProposal();
				await goto('my-devices/offers/' + $page.query.deviceId);
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

			apiSellerCancelProposal(domainProposal, { token, id: $page.params.id })
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

	const sellerCancelReplyProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingCancelReply = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiSellerCancelReplyProposal(domainProposal, {
				token,
				id: $page.params.id,
			})
				.then(() => {
					isLoadingCancelReply = false;
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
					isLoadingCancelReply = false;
					reject();
				});
		});
	};

	const sellerRejectProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingReject = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiSellerRejectProposal(domainProposal, {
				token,
				id: $page.params.id,
				questions: selectQuestion,
			})
				.then(() => {
					isLoadingReject = false;
					resolve();
				})
				.catch(() => {
					isOpenModal = false;
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
					isLoadingReject = false;
					reject();
				});
		});
	};

	const sellerAcceptProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingAccept = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiSellerAcceptProposal(domainProposal, { token, id: $page.params.id })
				.then(() => {
					isLoadingAccept = false;
					resolve();
				})
				.catch(() => {
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

	const detailProposal = () => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiDetailProposal(domainProposal, { token, id: $page.params.id })
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					detail = obj;
					resolve();
				})
				.catch(() => {
					isServerError = true;
					isLoading = false;
					reject();
				});
		});
	};

	const handleReset = async () => {
		linkToBack.set($page.path + '?deviceId=' + $page.query.deviceId);
		await goto('/empty');
	};

	const handleDelete = async () => {
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
			await deleteProposal();
			await goto('my-devices/offers/' + $page.query.deviceId);
		}
	};

	const deleteProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingDelete = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiDeleteProposal(domainProposal, {
				token,
				id: detail.id,
			})
				.then(() => {
					isLoadingDelete = false;
					resolve();
				})
				.catch(() => {
					isLoadingDelete = false;
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

	const updateSellerReplyProposal = () => {
		return new Promise((resolve, reject) => {
			isLoadingComplete = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}

			apiUpdateSellerReplyProposal(domainProposal, {
				token,
				id: detail.id,
				cartId: detail.cart_id,
				buyerSalePrice:
					exchangeDevices.length == 0 && detail.type == config.exchange
						? convertToUsd(exchangePrice, $currency)
						: convertToUsd(sellingPrice, $currency),
				buyerExchangePrice: convertToUsd(exchangePrice, $currency),
				type: exchangeDevices.length > 0 ? detail.type : config.sell,
				exchangeDevices: exchangeDevices,
			})
				.then(() => {
					isLoadingComplete = false;
					resolve();
				})
				.catch(() => {
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
					reject();
				});
		});
	};

	const handleSubmit = async () => {
		let flag = true;
		if (detail.type === config.sell) {
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
				});
			}
		}

		if (flag) {
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
					title: $_('proposal.viewOffer'),
					text: $_('proposal.questionChange'),
				});
				if (result.value) {
					await updateSellerReplyProposal();
					await goto('my-devices/offers/' + $page.query.deviceId);
				}
			} catch (error) {}
		}
	};

	const handleReject = async () => {
		isOpenModal = true;
	};

	const handleCancelReply = async () => {
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
			text: $_('proposal.warningCancelReply'),
		});
		if (result.value) {
			await sellerCancelReplyProposal();
			await goto('my-devices/offers/' + $page.query.deviceId);
		}
	};
</script>

<style>
	.btn-width {
		width: 50%;
	}
	.btn-width-large {
		width: 200px;
	}
	.device-model {
		width: 60px;
		height: 80px;
		object-fit: cover;
	}
</style>

{#if isOpenModal}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
		<MobileModalRejectOffer
			bind:selectQuestion
			{sellerRejectProposal}
			onClose={() => {
				isOpenModal = false;
			}} />
	</Portal>
{/if}
{#if isServerError}
	<p class="mt4 red ">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="mt4">
		<ContentLoader width="1170" uniqueKey="offerDetail">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{:else if detail}
	<div class="mt5">
		<div class="flex mt5">
			<div class="mr4">
				<img
					src={detail.url}
					alt={detail.device_name}
					class="device-model br1" />
			</div>
			<div>
				<h4 class="mb3">
					{detail.device_name}
					-{detail.capacity}
					{$_('label.GB')}
					-
					{detail.color}
				</h4>
				<h5 class="fw5 light-silver">
					{$_('message.updatedDate')}:
					{displayDateDefault(detail.updated_at)}
				</h5>
			</div>
		</div>

		<div class="pt5">
			{#if detail.type === config.sell}
				<MobileOfferSellDetail
					onUpdate={(value) => {
						if (value != detail.buyer_real_sale_price) isUpdatePrice = true;
						else isUpdatePrice = false;
					}}
					{detail}
					bind:bindValue={sellingPrice}
					{handleReset}>
					<div slot="header" class="flex">
						{#if detail.status == config.proposal.buyerReply || detail.status == config.proposal.buyerCreated}
							{#if isLoadingReject}
								<button
									type="button"
									class="bg-light-gray br2 ba fw6 h-30-px f7 near-black
											b--pale-grey pointer flex items-center justify-center grow
											pa3 tracked">
									<LoadingDefault size="25" color="#cccccc" />
								</button>
							{:else}
								<button
									type="button"
									on:click={handleReject}
									class="bg-light-gray br2 ba fw6 h-30-px f7 near-black
											b--pale-grey pointer flex items-center justify-center
											pa3 tracked">{$_('proposal.reject')}</button>
							{/if}
						{/if}
						{#if isLoadingDelete}
							<button
								type="button"
								class="ml3 bg-light-gray br2 ba fw6 h-30-px f7  near-black
										b--pale-grey pointer flex items-center justify-center
										pa3 tracked">
								<LoadingDefault size="25" color="#cccccc" />
							</button>
						{:else}
							<button
								type="button"
								on:click={handleDelete}
								class="ml3 bg-light-gray br2 ba fw6 h-30-px f7  near-black
										b--pale-grey pointer flex items-center justify-center
										pa3 tracked">{$_('message.remove')}</button>
						{/if}
					</div>
				</MobileOfferSellDetail>
			{:else if detail.type === config.exchange}
				<MobileOfferExchangeDetail
					updateNotReply={() => {
						isUpdatePrice = false;
					}}
					bind:isUpdateExchangeDevices
					onUpdate={(value) => {
						if (detail.buyer_real_exchange_price > 0) {
							if (value > 0) {
								if (value != -detail.buyer_real_exchange_price) {
									isUpdatePrice = true;
								} else isUpdatePrice = false;
							} else {
								if (Math.abs(value) != detail.buyer_real_exchange_price) {
									isUpdatePrice = true;
								} else isUpdatePrice = false;
							}
						} else {
							if (value != Math.abs(detail.buyer_real_exchange_price)) {
								isUpdatePrice = true;
							} else isUpdatePrice = false;
						}
						if (exchangeDevices.length == 0) {
							if (value == 0) {
								isUpdatePrice = false;
							} else isUpdatePrice = true;
						}
					}}
					{handleReset}
					{detail}
					bind:bindValue={exchangePrice}
					bind:selectedExchangeDevices={exchangeDevices}>
					<div slot="header" class="flex">
						{#if detail.status == config.proposal.buyerReply || detail.status == config.proposal.buyerCreated}
							{#if isLoadingReject}
								<button
									type="button"
									class="link bg-light-gray br2 ba fw6 h-30-px f7  near-black
											b--pale-grey pointer flex items-center justify-center
											pa3 tracked">
									<LoadingDefault size="25" color="#cccccc" />
								</button>
							{:else}
								<button
									type="button"
									on:click={handleReject}
									class="link bg-light-gray br2 ba fw6 h-30-px f7  near-black
											b--pale-grey pointer flex items-center justify-center
											pa3 tracked">{$_('proposal.reject')}</button>
							{/if}
						{/if}
						{#if isLoadingDelete}
							<button
								on:click={handleReset}
								type="button"
								class="ml3 link bg-light-gray br2 ba fw6 h-30-px f7  near-black
										b--pale-grey pointer flex items-center justify-center
										pa3 tracked">
								<LoadingDefault size="25" color="#cccccc" />
							</button>
						{:else}
							<button
								type="button"
								on:click={handleDelete}
								class="ml3 link bg-light-gray br2 ba fw6 h-30-px f7  near-black
										b--pale-grey pointer flex items-center justify-center
										pa3 tracked">{$_('message.remove')}</button>
						{/if}
					</div>
				</MobileOfferExchangeDetail>
			{/if}
		</div>
	</div>
	<div class="mb5 mt5 flex justify-between">
		<button
			on:click={async () => await goto('my-devices/offers/' + $page.query.deviceId)}
			type="button"
			class="link bg-light-gray br2 ba fw6 ttu near-black b--pale-grey
						pointer flex items-center justify-center grow h-40-px btn-width
						tracked mr3">{$_('device.back')}</button>
		{#if detail}
			{#if detail.status === config.proposal.sellerAccept}
				{#if remainingAcceptTimeout}
					{#if isLoadingCancel}
						<button
							type="button"
							class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white flex
						items-center justify-center h-40-px btn-width tracked">
							<LoadingDefault />
						</button>
					{:else}
						<button
							on:click={handleSellerCancel}
							type="button"
							class="link bg-light-gray br2 ba fw6 ttu near-black b--pale-grey flex flex-column justify-center items-center justify-center h-40-px
			btn-width-large tracked">{$_('proposal.cancelAccept')}
							<span class="db">({minutes} : {seconds})</span>
						</button>
					{/if}
				{:else}
					<button
						on:click={handleSellerCancel}
						disabled={false}
						type="button"
						class="link bg-light-gray br2 ba fw6 ttu near-black b--pale-grey
							pointer flex items-center justify-center grow h-40-px
							btn-width-large tracked o-50">{$_('proposal.cancelAccept')}</button>
				{/if}
			{:else}
				{#if detail.status !== config.proposal.sellerReply && detail.status !== config.proposal.sellerAccept}
					{#if !isUpdatePrice && !isUpdateExchangeDevices}
						<button
							type="button"
							disabled
							class="link bg-light-gray br2 ba fw6 ttu near-black
										b--pale-grey flex items-center justify-center
										h-40-px btn-width tracked o-50">{$_('offer.reply')}</button>
					{:else if isLoadingComplete}
						<button
							type="button"
							class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white
										flex items-center justify-center grow h-40-px btn-width
										tracked ">
							<LoadingDefault />
						</button>
					{:else}
						<button
							type="button"
							on:click={handleSubmit}
							class="link bg-light-gray br2 ba fw6 ttu near-black
										b--pale-grey pointer flex items-center justify-center grow
										h-40-px btn-width tracked ">{$_('offer.reply')}</button>
					{/if}
				{/if}
				{#if detail.status !== config.proposal.sellerReply}
					{#if !isUpdatePrice && !isUpdateExchangeDevices}
						{#if isLoadingAccept}
							<button
								type="button"
								class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white
										flex items-center justify-center grow h-40-px btn-width
										tracked  ml3">
								<LoadingDefault />
							</button>
						{:else}
							<button
								type="button"
								on:click={handleSellerAccept}
								class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white
										flex pointer items-center justify-center grow h-40-px
										btn-width tracked  ml3">{$_('message.accept')}</button>
						{/if}
					{:else}
						<button
							type="button"
							disabled
							class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white
								flex items-center justify-center h-40-px btn-width tracked  ml3 o-50">{$_('message.accept')}</button>
					{/if}
				{/if}
				{#if detail.status === config.proposal.sellerReply}
					{#if isLoadingCancelReply}
						<button
							type="button"
							class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white
										flex items-center justify-center grow h-40-px btn-width tracked  ml3">
							<LoadingDefault />
						</button>
					{:else}
						<button
							type="button"
							on:click={handleCancelReply}
							class="link bg-dark-blue b--dark-blue br2 ba fw6 ttu white
										flex pointer items-center justify-center grow h-40-px
										btn-width-large tracked  ml3">{$_('proposal.cancelReply')}</button>
					{/if}
				{/if}
			{/if}
		{/if}
	</div>
{/if}
