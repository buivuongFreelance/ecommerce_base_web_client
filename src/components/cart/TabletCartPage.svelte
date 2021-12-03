<script>
	import { _ } from 'svelte-i18n';
	import ContentLoader from 'svelte-content-loader';
	import { stores, goto } from '@sapper/app';

	import {
		listCart as apiListCart,
		confirmCart as apiConfirmCart,
	} from '../../services/cart';
	import { listQuestionSellerReject as apiListQuestionSellerReject } from '../../services/model';
	import { createOrder as apiCreateOrder } from '../../services/transaction';
	import {
		auth,
		anonymous,
		currency,
		selectedItemsCheckout,
		selectedItemsFullCheckout,
		listCartFailed,
		cartChanged,
		notifySellerChanged,
	} from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import {
		commissionPriceBuyerTotal,
		displayCurrency,
		displayProposalBuyerExchangeStr,
	} from '../../functions';
	import config from '../../config';

	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalCommission from '../modal/PcModalCommission.svelte';
	import TabletCartItem from './TabletCartItem.svelte';

	const { session } = stores();
	const { domainCart, domainTransaction, domainModel } = $session;

	export let onMakeOffer;
	export let onViewOffer;

	export let onMakeOfferDevice;
	export let onViewOfferDevice;
	export let isRefresh;

	let isLoadingCart = false;
	let isLoadingConfirm = false;
	let isServerError = false;
	let listConfirm = [];
	let listQuestion = [];
	let total = 0;
	let oldTotal = 0;
	let selectItemCarts = [];
	let oldSelectItemCarts = [];

	let isConfirm = false;
	let isSelectAll = false;
	let flagSelectAll = false;
	let mounted = false;
	let listCartFailedDis = [];

	let isOpenModalCommission = false;

	$: {
		if (isOpenModalCommission) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
		if (isRefresh > 0) {
			listCart();
		}
	}
	const unsubscribeNotifySellerChanged = notifySellerChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					listCart();
				}
			}
		}
	);

	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (mounted) {
				listCart();
			}
		}
	});

	onMount(async () => {
		try {
			getListCartFailed();
			await listCart();
			await listQuestionSellerReject();
			checkSelectAll();
			mounted = true;
		} catch (error) {}
	});

	onDestroy(() => {
		unsubscribeCartChanged();
		unsubscribeNotifySellerChanged();
		document.body.classList.remove('noscroll');
	});

	const getListCartFailed = () => {
		$selectedItemsFullCheckout.map((item) => {
			if ($listCartFailed.includes(item.id)) {
				listCartFailedDis.push(item);
			}
		});
		listCartFailed.set([]);
		selectedItemsFullCheckout.set([]);
	};

	const getPriceTotal = (item) => {
		const price = getAvailablePrice(item);
		const realPrice = parseFloat(
			commissionPriceBuyerTotal(price, item.dingtoi_fee)
		);
		return realPrice;
	};

	const listQuestionSellerReject = () => {
		return new Promise((resolve, reject) => {
			apiListQuestionSellerReject(domainModel)
				.then((items) => {
					listQuestion = items.list;
					isServerError = false;
					resolve();
				})
				.catch(() => {
					isServerError = true;
					reject();
				});
		});
	};
	const checkValidateProposal = (item) => {
		let flag = false;
		if (
			item.proposal_status === config.proposal.sellerAccept ||
			item.cart_type === config.sell
		) {
			flag = true;
		}
		return flag;
	};

	const getAvailablePrice = (item) => {
		if (
			(item.proposals &&
				item.proposal_status === config.proposal.sellerAccept) ||
			(item.proposals && item.proposal_status === config.proposal.buyerAccept)
		) {
			if (item.proposals.length > 0) {
				if (item.proposals[0].exchange_devices.length > 0) {
					if (item.proposals[0].buyer_real_exchange_price > 0) {
						return -Number(item.proposals[0].buyer_real_exchange_price);
					} else {
						return Math.abs(
							Number(item.proposals[0].buyer_real_exchange_price)
						);
					}
				} else return Number(item.proposals[0].buyer_real_sale_price);
			}
		}
		return Number(item.real_sale_price);
	};

	const confirmListCart = (l) => {
		let arr = [];
		selectItemCarts = [];
		total = 0;
		for (let i = 0; i < l.length; i++) {
			const item = l[i];
			if (item.proposal_status === config.proposal.systemCancelAccept) {
				item.isSystemCancelProposal = true;
			}
			arr.push({ ...item, validate: false });
			if (checkValidateProposal(item)) {
				const realPrice = parseFloat(getPriceTotal(item));
				total += realPrice;
				arr[i].validate = true;
				if (!selectItemCarts.includes(item.id)) {
					selectItemCarts.push(item.id);
					selectItemCarts = selectItemCarts;
					oldSelectItemCarts = Object.assign([], selectItemCarts);
					oldTotal = total;
				}
			}
		}
		listConfirm = arr;
	};

	const tickAll = () => {
		selectItemCarts = Object.assign([], oldSelectItemCarts);
		total = oldTotal;
	};

	const changePriceCartItem = (type, it) => {
		for (let i = 0; i < listConfirm.length; i++) {
			const item = listConfirm[i];
			if (it.id === item.id) {
				if (checkValidateProposal(item)) {
					if (type === '-') {
						total -= getPriceTotal(item);
					} else {
						total += getPriceTotal(item);
					}
				}
			}
		}
	};
	const checkSelectAll = () => {
		for (let i = 0; i < listConfirm.length; i++) {
			const item = listConfirm[i];
			if (item.validate === true) return (flagSelectAll = true);
			else flagSelectAll = false;
		}
	};
	const confirmSelectAll = () => {
		if (selectItemCarts.length === oldSelectItemCarts.length) {
			return true;
		} else return false;
	};

	const listCart = () => {
		isLoadingCart = true;
		let token = '';
		if ($auth) token = $auth.accessToken;
		return new Promise((resolve, reject) => {
			apiListCart(domainCart, { token, anonymous: $anonymous })
				.then((l) => {
					if ($selectedItemsFullCheckout.length === 0) {
						selectedItemsFullCheckout.set(l);
					}
					isServerError = false;
					isLoadingCart = false;
					confirmListCart(l);
					isSelectAll = true;
					resolve(l);
				})
				.catch(() => {
					isServerError = true;
					isLoadingCart = false;
					reject();
				});
		});
	};

	const confirmCart = () => {
		isLoadingConfirm = true;
		let token = '';
		if ($auth) token = $auth.accessToken;
		return new Promise((resolve, reject) => {
			apiConfirmCart(domainCart, { token })
				.then((list) => {
					isLoadingConfirm = false;
					let customTotal = 0;
					for (let l of list) {
						if (l.proposal_type) {
							if (l.proposal_type === config.sell) {
								customTotal += Number(l.proposal_sale_price);
							} else if (l.proposal_type === config.exchange) {
								customTotal += Number(l.proposal_exchange_price);
							}
						} else {
							customTotal += Number(l.real_sale_price);
						}
					}
					total = customTotal;
					resolve(list);
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
					isLoadingConfirm = false;
					reject();
				});
		});
	};

	const handleConfirm = async () => {
		if ($auth) {
			selectedItemsCheckout.set(selectItemCarts);
			if (selectItemCarts.length > 0) {
				await goto('/checkout');
			} else {
				swal.fire({
					icon: 'warning',
					title: $_('message.prompt'),
					text: $_('cart.noDeviceCheckout'),
					reverseButtons: true,
					customClass: {
						icon: 'icon-warning',
					},
				});
			}
		} else {
			swal.fire({
				title: $_('message.warning'),
				text: $_('error.mustLogin'),
				reverseButtons: true,
			});
		}
	};

	const handleBack = async () => {
		if (isConfirm) {
			isConfirm = false;
			listConfirm = false;
		} else await goto('/');
	};

	const handleCheckout = async () => {
		try {
			const result = await apiCreateOrder(domainTransaction, { token: token });
		} catch (error) {
			console.log(error);
		}
	};

	const handleSelectAll = (event) => {
		if (event.target.checked) {
			tickAll();
		} else {
			selectItemCarts = [];
			total = 0;
		}
	};

	const handleChangeCartItem = (event, item) => {
		if (event.target.checked) {
			setTimeout(() => {
				isSelectAll = confirmSelectAll();
				changePriceCartItem('+', item);
			}, 200);
		} else {
			isSelectAll = false;
			changePriceCartItem('-', item);
		}
	};

	const onClose = () => {
		isOpenModalCommission = false;
	};
</script>

{#if isServerError}
	<p class="red f4 tc">{$_('error.serverErrorMessage')}</p>
{:else}
	{#if isOpenModalCommission}
		<Portal target={document.getElementById('portal')}>
			<DimmerModal
				type="modal"
				onClick={() => (isOpenModalCommission = false)}
			/>
			<PcModalCommission {onClose} />
		</Portal>
	{/if}
	{#if isLoadingCart}
		<div class="flex items-center justify-center">
			<ContentLoader
				uniqueKey="cartPage"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width="800"
				height="560"
			>
				<rect x="0" y="0" width="800" height="180" />
				<rect x="0" y="190" width="800" height="180" />
				<rect x="0" y="380" width="800" height="180" />
			</ContentLoader>
		</div>
	{:else if listConfirm.length === 0}
		<p class="f4 tc">{$_('message.noItems')}</p>
	{:else}
		<!-- {#if listCartFailedDis}
			{#if listCartFailedDis.length > 0}
				<div class="mb5">
					<div class="mb3 fw6">List device has been sold:</div>
					{#each listCartFailedDis as item}
						<div class="box-shadow flex pb4 bg-red-10 pa4 br2 mt3 justify-end">
							<div
								class="ba bw2 b--white flex items-center justify-center w-image"
							>
								<img src={item.url} alt="no" class="image ba b--white" />
							</div>
							<div class="device-info ml4 flex justify-between">
								<div>
									<span class="name b link near-black dim db ttc"
										>{item.model}
										-
										{item.capacity}
										{$_('label.GB')}
										-
										{item.color}</span
									>
									<div class="light-silver">
										{$_('device.brand')}:
										{item.brand_name}
									</div>
								</div>
								<div class="flex tr">

									<button
										type="button"
										class="h-30-px br1 f6 ttu bn near-black bg-transparent pointer grow ml5"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="24"
											viewBox="0 0 24 24"
											width="24"
										>
											<path
												d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if} -->

		<div class="pb3 pl1rem">
			{#if flagSelectAll === true}
				<label class="checkbox flex items-center pointer w-15">
					<input
						type="checkbox"
						on:change={handleSelectAll}
						bind:checked={isSelectAll}
					/>
					<span class="box flex items-center justify-center" />
					<span class="label fw6 ml3">{$_('message.selectAll')}</span>
				</label>
			{/if}
		</div>

		{#each listConfirm as item}
			<TabletCartItem
				{listQuestion}
				{item}
				onMakeOffer={() => onMakeOffer(item)}
				onViewOffer={() => onViewOffer(item)}
				onMakeOfferDevice={() => onMakeOfferDevice(item)}
				onViewOfferDevice={() => {
					onViewOfferDevice(item);
				}}
				onRemoved={async () => {}}
				bind:isOpenModalCommission
			>
				<label class="checkbox pointer">
					<input
						type="checkbox"
						name="cart"
						on:change={(event) => handleChangeCartItem(event, item)}
						value={item.id}
						bind:group={selectItemCarts}
					/>
					<span class="box flex items-center justify-center" />
				</label>
			</TabletCartItem>
		{/each}
	{/if}
	{#if selectItemCarts.length > 0 && $auth}
		<div class="flex justify-between mt1rem">
			<div />
			<div>
				<span class="b">
					{$_('cart.total')}
					{selectItemCarts.length}
					{$_('cart.items')}
					:
				</span>
				{#if total >= 0}
					<span class="b price f4 tr">
						{displayCurrency(total, $currency)}
						{$currency}
					</span>
				{:else}
					<span class="fw6">{$_(displayProposalBuyerExchangeStr(total))}</span>
					<span class="b price f4 tr">
						{displayCurrency(total, $currency)}
						<u>{$currency}</u>
					</span>
				{/if}
			</div>
		</div>
	{/if}
	<div class="flex justify-between mt2rem">
		<button
			type="button"
			on:click={handleBack}
			class="bg-light-gray b--light-gray br1 ba fw6 ttu flex items-center
				justify-center grow h-60-px btn-width tracked pointer near-black mr3"
			>{$_('cart.continueShopping')}</button
		>
		{#if listConfirm.length > 0}
			{#if isLoadingConfirm}
				<button
					type="button"
					class="bg-light-yellow b--light-yellow br2 ba fw6 ttu dark-blue flex
						items-center justify-center grow h-60-px btn-width tracked f4
						pointer"
				>
					<LoadingDefault />
				</button>
			{:else if selectItemCarts.length <= 0}
				<button
					type="button"
					disabled
					class="bg-light-yellow b--light-yellow br2 ba fw6 ttu dark-blue flex
						items-center justify-center grow h-60-px btn-width tracked o-50"
					>{$_('cart.checkOut')}</button
				>
			{:else}
				<button
					type="button"
					on:click={handleConfirm}
					class="bg-light-yellow b--light-yellow br2 ba fw6 ttu dark-blue flex
						items-center justify-center grow h-60-px btn-width tracked
						pointer"
					>{$_('cart.checkOut')}</button
				>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.btn-width {
		min-width: 200px;
	}
	.checkbox .box {
		height: 20px;
		width: 20px;
		border: 2px solid #7e8299;
		border-radius: 3px;
		box-sizing: border-box;
	}
	.checkbox .box:after {
		content: '';
		display: block;
		width: 4px;
		height: 10px;
		transform: rotate(45deg);
		border-bottom: 2px solid #2f3a97;
		border-right: 2px solid #2f3a97;
		opacity: 0;
	}
	.checkbox > input:checked + .box {
		border-color: #2f3a97;
	}
	.checkbox > input:checked + .box:after {
		opacity: 1;
	}
	.checkbox input {
		display: none;
	}
</style>
