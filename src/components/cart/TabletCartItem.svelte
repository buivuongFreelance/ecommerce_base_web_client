<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import {
		displayCurrency,
		displayProposalBuyerExchangeStrReverse,
		msToSeconds,
	} from '../../functions';
	import {
		currency,
		auth,
		cartChanged,
		anonymous,
		settings,
	} from '../../stores';
	import swal from 'sweetalert2';
	import { removeCart as apiRemoveCart } from '../../services/cart';
	import { buyerDeleteProposal as apiBuyerDeleteProposal } from '../../services/proposal';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import config from '../../config';
	import PcCartQuickOfferBuyer from './PcCartQuickOfferBuyer.svelte';
	import IconDelete from '../icon/IconDelete.svelte';
	import PcExchangeInfo from './PcExchangeInfo.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { differenceInSeconds } from 'date-fns';
	import { tweened } from 'svelte/motion';
	import IconHistoryToggleOff from '../icon/IconHistoryToggleOff.svelte';
	import IconInfo from '../icon/IconInfo.svelte';
	import IconClose from '../icon/IconClose.svelte';

	const { session } = stores();
	const { domainCart, domainProposal } = $session;

	let isLoadingAccept = false;
	let isLoadingRemove = false;

	export let item;
	export let onRemoved;
	export let onMakeOffer;
	export let onViewOffer;
	export let onMakeOfferDevice;
	export let onViewOfferDevice;
	export let listQuestion;

	export let isOpenModalCommission = false;

	let timer = null;
	let intervalTimer = null;
	let remainingAcceptTimeout = 0;

	$: hours =
		Math.floor($timer / 3600) < 10
			? '0' + Math.floor($timer / 3600)
			: Math.floor($timer / 3600);
	$: minutes =
		Math.floor(Math.floor($timer - hours * 3600) / 60) < 10
			? '0' + Math.floor(Math.floor($timer - hours * 3600) / 60)
			: Math.floor(Math.floor($timer - hours * 3600) / 60);
	$: minname = minutes > 1 ? $_('message.minutes') : $_('message.minute');
	$: seconds =
		Math.floor($timer - (hours * 3600 + minutes * 60)) < 10
			? '0' + Math.floor($timer - (hours * 3600 + minutes * 60))
			: Math.floor($timer - (hours * 3600 + minutes * 60));

	onMount(async () => {
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
		if (item) {
			if (item.proposal_status === config.proposal.sellerAccept) {
				const result = Math.abs(
					differenceInSeconds(new Date(item.proposal_updated_at), new Date())
				);
				const timeAccept = msToSeconds(
					$settings[config.sellerCancelAcceptedTime]
				);

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

	const handleRemove = async () => {
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
				handleCloseWarning();
				cartChanged.update((n) => n + 1);
				onRemoved();
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

	const removeProposal = (cartId, proposalId) => {
		isLoadingRemove = true;
		let token = '';
		if ($auth) token = $auth.accessToken;
		return new Promise((resolve, reject) => {
			apiBuyerDeleteProposal(domainProposal, {
				token,
				proposalId,
				cartId,
			})
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

	const handleOffer = () => {
		if ($auth) {
			onMakeOffer();
		} else {
			swal.fire({
				title: $_('message.warning'),
				text: $_('error.mustLogin'),
				reverseButtons: true,
			});
		}
	};

	const handleViewOffer = () => {
		if ($auth) {
			onViewOffer();
		} else {
			swal.fire({
				title: $_('message.warning'),
				text: $_('error.mustLogin'),
				reverseButtons: true,
			});
		}
	};
	const handleOfferDevice = () => {
		if ($auth) {
			onMakeOfferDevice();
		} else {
			swal.fire({
				title: $_('message.warning'),
				text: $_('error.mustLogin'),
				reverseButtons: true,
			});
		}
	};

	const handleViewOfferDevice = () => {
		if ($auth) {
			onViewOfferDevice();
		} else {
			swal.fire({
				title: $_('message.warning'),
				text: $_('error.mustLogin'),
				reverseButtons: true,
			});
		}
	};

	const handleCloseWarning = () => {
		if (item.isSystemCancelProposal) item.isSystemCancelProposal = false;
	};

	const handleRemoveOffer = async (it) => {
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
			await removeProposal(item.id, it.proposal_id);
			cartChanged.update((n) => n + 1);
			onRemoved();
		}
	};
</script>

{#if isLoadingRemove}
	<div class="flex justify-center items-center pb4 bb b--light-gray mt4">
		<LoadingDefault color="#cccccc" />
	</div>
{:else}
	<div class="box-shadow flex pb4 bg-light-gray pa1rem br2 mt1rem">
		<div class="min-w20px">
			{#if item.validate}
				<slot />
			{/if}
		</div>
		<div class="flex  ml1rem">
			<img src={item.url} alt="no" class="image ba b--white" />
		</div>

		<div class="device-info ml1rem flex flex-1 justify-between">
			<div class="flex-1">
				<a
					href={'device/' + item.device_id}
					title=""
					class="name b link near-black dim ttc"
				>
					{item.model}

					{item.capacity}
					{$_('label.GB')}

					{item.color}
				</a>
				<div class="light-silver">{$_('device.brand')}: {item.brand_name}</div>

				{#if item.isSystemCancelProposal}
					<div class="flex mt1rem">
						<div class="alert-info flex bg-blue white ph4 pv4 br2">
							<div class="mr1rem">
								<IconInfo fill="#fff" size="40" />
							</div>
							<div>
								<p class="">{$_('proposal.warningBuyerTimeout')}</p>
							</div>
							<div class="pointer grow" on:click={handleCloseWarning}>
								<IconClose fill="white" />
							</div>
						</div>
					</div>
				{/if}

				{#if item.is_proposal_accepted && item.proposal_status !== config.proposal.sellerAccept}
					<div class="bg-blue-20 dark-blue pa1rem mt1rem br2">
						{$_('proposal.ThisDeviceIsNoLongerAvailableForNegotiation')}
					</div>
				{:else}
					{#if item.proposal_id && item.proposal_status !== config.proposal.systemCancelAccept}
						<div class="mt1rem flex">
							<PcCartQuickOfferBuyer
								{item}
								{listQuestion}
								onRemoveOffer={() => handleRemoveOffer(item)}
							/>
						</div>
					{/if}
					{#if item.proposal_status !== config.proposal.sellerAccept}
						<div class="mt1rem">
							{#if item.proposal_id}
								{#if item.proposal_status == config.proposal.sellerReject || item.proposal_status == config.proposal.systemCancelAccept}
									<div
										on:click={() => handleViewOffer()}
										class="grow pointer flex items-center"
									>
										<span
											class="h-40-px w2 bg-dark-blue br2 flex items-center justify-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												viewBox="0 0 24 24"
												fill="#fff"
												width="24"
											>
												<path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
												/>
											</svg>
										</span>
										<span class="dark-blue fw6 ml1rem">
											{$_('proposal.sendOffer')}</span
										>
									</div>
								{/if}
							{:else}
								<div
									on:click={() => handleOffer()}
									class="grow pointer flex items-center"
								>
									<span
										class="h-40-px w2 bg-dark-blue br2 flex items-center justify-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="24"
											viewBox="0 0 24 24"
											fill="#fff"
											width="24"
										>
											<path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
											/>
										</svg>
									</span>
									<span class="dark-blue fw6 ml1rem">
										{$_('proposal.sendOffer')}</span
									>
								</div>
							{/if}

							{#if item.proposal_id}
								{#if item.proposal_status == config.proposal.sellerReject || item.proposal_status == config.proposal.systemCancelAccept}
									<div
										on:click={() => handleViewOfferDevice()}
										class="mt3 grow pointer flex items-center"
									>
										<span
											class="h-40-px w2 bg-dark-blue br2 flex items-center justify-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												viewBox="0 0 24 24"
												fill="#fff"
												width="24"
												><path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"
												/>
											</svg>
										</span>
										<span class="flex-1 dark-blue fw6 ml1rem">
											{$_('proposal.sendOfferWithDevice')}</span
										>
									</div>
								{/if}
							{:else}
								<div
									on:click={() => handleOfferDevice()}
									class="mt3 grow pointer flex items-center"
								>
									<span
										class="h-40-px w2 bg-dark-blue br2 flex items-center justify-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="24"
											viewBox="0 0 24 24"
											fill="#fff"
											width="24"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"
											/>
										</svg>
									</span>
									<span class="flex-1 dark-blue fw6 ml1rem">
										{$_('proposal.sendOfferWithDevice')}</span
									>
								</div>
							{/if}
						</div>
					{/if}
				{/if}
				{#if item.proposal_status === config.proposal.sellerAccept}
					<div class="mt3">
						<div class="flex items-center justify-end red i">
							<IconHistoryToggleOff size="20" fill="#F64E60" />
							<span class="ml3">{$_('label.theTimeLeftForYouToCheckout')}</span>
						</div>
						<div class="flex items-center justify-end">
							<b class="f4 red fadeInDown ">{hours} : {minutes} : {seconds}</b>
						</div>
					</div>
				{/if}
			</div>
			<div class="flex-1 flex justify-end tr">
				{#if !item.is_proposal_accepted}
					{#if item.cart_type === config.exchange}
						{#if item.exchange_model}
							<div class="">
								<PcExchangeInfo {item} />
								<div class="red mt3 f7">
									{#if !item.proposal_status || item.proposal_status === config.proposal.sellerReject}
										{$_('checkout.deviceCannotCheckoutPleaseMakeOffer')}
									{:else if item.proposal_status === config.proposal.buyerCreated}
										{$_('checkout.deviceCannotCheckoutWaitingApprove')}
									{/if}
								</div>
							</div>
						{/if}
					{/if}
				{/if}
				{#if item.cart_type === config.sell && item.proposal_status !== config.proposal.sellerAccept}
					<div class="tr">
						<div>
							<!-- <div>{$_('device.sellingPrice')}</div> -->
							<div class="b f4">
								<span class="money"
									>{displayCurrency(
										Math.abs(item.real_sale_price),
										$currency
									)}</span
								>
								<sup class="currency"><u>{$currency}</u></sup>
							</div>
						</div>
						{#if $auth}
							<div
								on:click={() => (isOpenModalCommission = true)}
								class="help f6"
							>
								<span class="link blue fw6">
									{$_('cart.commission')}
									<sup>ⓘ</sup>:
								</span>
								<b>
									{displayCurrency(item.dingtoi_fee, $currency)}
									<u>{$currency}</u>
								</b>
							</div>
						{/if}
					</div>
				{:else if item.proposal_status == config.proposal.sellerAccept}
					<div>
						{#if item.proposals[0].exchange_devices.length > 0}
							<div class="tr">
								<div class="b f4">
									{#if item.proposals[0].buyer_real_exchange_price > 0}
										<span
											>{$_(
												displayProposalBuyerExchangeStrReverse(
													Number(item.proposals[0].buyer_real_exchange_price)
												)
											)}
										</span>
										<span class="money">
											{displayCurrency(
												item.proposals[0].buyer_real_exchange_price,
												$currency
											)}
										</span>
										<sup class="currency">{$currency}</sup>
									{:else}
										<span class="money"
											>{displayCurrency(
												item.proposals[0].buyer_real_exchange_price,
												$currency
											)}</span
										>
										<sup class="currency">{$currency}</sup>
									{/if}
								</div>
							</div>
							{#if $auth}
								<div
									on:click={() => (isOpenModalCommission = true)}
									class="help"
								>
									{$_('cart.commission')}
									<sup>ⓘ</sup>
									:
									{displayCurrency(item.dingtoi_fee, $currency)}
									{$currency}
								</div>
							{/if}
						{:else}
							<div class="tr">
								<!-- <div>{$_('cart.offerMoney')}</div> -->
								<div class="b f4">
									<span class="money">
										{displayCurrency(
											item.proposals[0].buyer_real_sale_price,
											$currency
										)}
									</span>
									<sup class="currency"><u>{$currency}</u></sup>
								</div>
							</div>
							{#if $auth}
								<div
									on:click={() => (isOpenModalCommission = true)}
									class="tr help"
								>
									{$_('cart.commission')}
									<sup>ⓘ</sup>
									:
									{displayCurrency(item.dingtoi_fee, $currency)}
									{$currency}
								</div>
							{/if}
						{/if}
					</div>
				{/if}
				<button
					type="button"
					on:click={handleRemove}
					class="h-30-px br1 f6 ttu bn near-black bg-transparent pointer
				grow ml2rem"
				>
					<IconDelete />
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.device-info {
		width: calc(100% - 120px);
	}
	.image {
		width: 60px;
		height: 60px;
		border-radius: 4px;
		object-fit: contain;
	}
	.money {
		font-size: 30px;
	}
	.box-shadow {
		box-shadow: 2px 2px 4px #ccc;
	}
	.min-w20px {
		min-width: 20px;
	}

	@-webkit-keyframes fadeInDown {
		0% {
			opacity: 0;
			-webkit-transform: translate3d(0, -50%, 0);
			transform: translate3d(0, -50%, 0);
		}

		to {
			opacity: 1;
			-webkit-transform: translateZ(0);
			transform: translateZ(0);
		}
	}

	@keyframes fadeInDown {
		0% {
			opacity: 0;
			-webkit-transform: translate3d(0, -50%, 0);
			transform: translate3d(0, -50%, 0);
		}

		to {
			opacity: 1;
			-webkit-transform: translateZ(0);
			transform: translateZ(0);
		}
	}
	.fadeInDown {
		animation-name: fadeInDown;
		animation-duration: 1s;
		animation-iteration-count: infinite;
	}
	.help {
		cursor: help;
	}
	.alert-info {
		max-width: 400px;
	}
</style>
