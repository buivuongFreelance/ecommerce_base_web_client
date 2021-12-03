<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { auth } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcPagination from '../form/PcPagination.svelte';
	import {
		listOrderSelling as apiListOrderSelling,
		detailSale as apiDetailSale,
		getShippingAndBilling as apiGetShipping,
		shipments as apiShipments,
	} from '../../services/transaction';
	import config from '../../config';
	import { isObjectEmpty } from '../../functions';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalPayShip from './PcModalPayShip.svelte';
	import PcItemSelling from './PcItemSelling.svelte';
	import PcButtonClearFilter from '../button/PcButtonClearFilter.svelte';
	import PcButtonSearch from '../button/PcButtonSearch.svelte';
	import IconSearch from '../icon/IconSearch.svelte';
	import MobileItemSelling from './MobileItemSelling.svelte';
	const { session } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let isServerError = false;
	let isOpenModal = false;
	let isLoadingDetail = false;
	let isLoadingShippo = false;
	let sale = {};
	let detailShip = null;
	let detailBill = null;
	let isSameShipping = true;
	let filter = { saleNumber: '', status: '' };
	let sort = { saleNumber: '', price: '', status: '', createdAt: '' };

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	onMount(async () => {
		await listOrderSelling();
		await getShippingAndBilling();
	});
	const shipments = (addressTo, parcelsShip) => {
		isLoadingShippo = true;
		return new Promise((resolve, reject) => {
			apiShipments(config.domainShippo, {
				token: config.shippoToken,
				address_from: {
					name: detailShip.first_name + ' ' + detailShip.last_name,
					street1: detailShip.address,
					city: detailShip.city_name,
					state: detailShip.province,
					zip: detailShip.postal_code,
					country: detailShip.country_code,
				},
				address_to: {
					name: addressTo.name,
					street1: addressTo.street1,
					city: addressTo.city,
					state: addressTo.state,
					zip: addressTo.zip,
					country: addressTo.country,
				},
				parcels: parcelsShip,
			})
				.then((obj) => {
					isLoadingShippo = false;
					resolve(obj.data.rates);
				})
				.catch((error) => {
					isLoadingShippo = false;
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
	const getShippingAndBilling = () => {
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiGetShipping(domainTransaction, {
				token,
			})
				.then((obj) => {
					if (!isObjectEmpty(obj)) {
						detailShip = obj.shipping;
						detailBill = obj.billing;
					}
					if (isSameShipping) {
						detailBill = obj.shipping;
					}
					isServerError = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					reject();
				});
		});
	};
	const detailSale = (id) => {
		isLoadingDetail = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailSale(domainTransaction, {
				token,
				id,
			})
				.then((items) => {
					isLoadingDetail = false;
					sale = items;

					isServerError = false;
					resolve();
				})
				.catch((e) => {
					isLoadingDetail = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handlePayment = async (item) => {
		goto('my-sales/checkout/' + item.id);
		// await detailSale(item.id);
		// if (!isLoadingDetail) {
		// 	isOpenModal = true;
		// }
	};
	const listOrderSelling = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListOrderSelling(domainTransaction, {
				token,
				limit: config.limit,
				offset,
				filter,
				sort,
			})
				.then((items) => {
					isLoading = false;
					list = items.list;
					countList = items.count;
					isServerError = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handlePage = async (page) => {
		offset = config.limit * (page - 1);

		await listOrderSelling();
	};
	const onClose = () => {
		isOpenModal = false;
	};
	const handleSuccessPayment = async () => {
		await listOrderSelling();
	};
	const handleFilter = async () => {
		offset = 0;
		await listOrderSelling();
	};
	const handleClearFilter = async () => {
		filter = {
			saleNumber: '',
			status: '',
		};
		offset = 0;
		await listOrderSelling();
	};
	const handleSort = async (e) => {
		offset = 0;
		sort.price = '';
		sort.status = '';
		sort.createdAt = '';
		sort.saleNumber = e.target.checked ? e.target.value : 'asc';
		await listOrderSelling();
	};
	const handleSortPrice = async (e) => {
		offset = 0;
		sort.createdAt = '';
		sort.saleNumber = '';
		sort.status = '';
		sort.price = e.target.checked ? e.target.value : 'asc';
		await listOrderSelling();
	};
	const handleSortStatus = async (e) => {
		offset = 0;
		sort.createdAt = '';
		sort.saleNumber = '';
		sort.price = '';
		sort.status = e.target.checked ? e.target.value : 'asc';
		await listOrderSelling();
	};
	const handleSortDate = async (e) => {
		offset = 0;
		sort.status = '';
		sort.saleNumber = '';
		sort.price = '';
		sort.createdAt = e.target.checked ? e.target.value : 'asc';
		await listOrderSelling();
	};
</script>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	{#if isOpenModal}
		<Portal target={document.getElementById('portal')}>
			<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
			<PcModalPayShip
				bind:isSameShipping
				onSuccess={handleSuccessPayment}
				{detailBill}
				{detailShip}
				{onClose}
				{sale}
				{shipments}
				{isLoadingShippo}
			/>
		</Portal>
	{/if}
	<h3 class="page__title tc ttc">{$_('order.mySelling')}</h3>
	<form
		class="flex flex-wrap flex-gap10px mb4"
		autocomplete="off"
		on:submit|preventDefault={handleFilter}
	>
		<div class="input-icon w-100 relative">
			<input
				id="name"
				autocomplete="off"
				class="input-reset w-100 ba b--light-gray br2 h-40-px fw6"
				type="text"
				bind:value={filter.saleNumber}
				placeholder={$_('order.saleNumber')}
				on:input={(e) => {
					if (e.target.value == '') {
						handleClearFilter();
					}
				}}
			/>
			<i
				class="icon absolute w40px left-0 pl1 top-0 bottom-0 flex justify-center items-center"
			>
				<IconSearch fill="#9fb0c9" />
			</i>
		</div>
		<!-- svelte-ignore a11y-no-onchange -->
		<select
			class="bg-white b--light-gray br2 ba fw6 ph3 h-40-px
					w-status-select w-100"
			value={filter.status}
			on:change={(event) => (filter.status = event.target.value)}
		>
			<option value="">{$_('device.allSta')}</option>
			<option value={config.order.processing}>
				{$_('message.processing')}
			</option>
			<option value={config.order.waitingForDevicePayment}>
				{$_('message.created')}
			</option>
		</select>
		<!-- <label class="checkbox-button pointer">
			<input
				type="checkbox"
				value="desc"
				checked={sort.saleNumber == 'desc' ? true : false}
				on:change={(e) => handleSort(e)}
			/>
			<span class="mr3">{$_('order.saleNumber')}</span>
			<span class="icon flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#9eabb4"
					width="18px"
					height="18px"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
					/></svg
				>
			</span>
		</label> -->
		<PcButtonSearch bg="bg-blue" />
		<PcButtonClearFilter className="" onClickButton={handleClearFilter} />
	</form>
	<main>
		{#if isLoading}
			<ContentLoader
				uniqueKey="tableSales"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={375 - 30}
				height="40"
			>
				<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
			</ContentLoader>
		{:else if list.length > 0}
			<table class="table-sales">
				<thead>
					<tr>
						<th width="40%" />
						<th />
					</tr>
				</thead>
				{#each list as item}
					<MobileItemSelling {item} {isLoadingDetail} {handlePayment} />
				{/each}
			</table>
			<div class="flex justify-end mt4">
				<PcPagination totalItems={countList} {offset} onPage={handlePage} />
			</div>
		{/if}

		<!-- <div class="ba b--light-gray br3 pv4">
			<table class="w-100">
				{#if isLoading}
					<ContentLoader
						uniqueKey="filterOrder"
						primaryColor="#e4e6ef"
						secondaryColor="#f8f8f8"
						width={config.containerDesktop - 30}
						height="40"
					>
						<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
					</ContentLoader>
				{:else}
					<thead class="tl">
						<tr class="bb b--light-gray">
							<th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.saleNumber == 'desc' ? true : false}
										on:change={(e) => handleSort(e)}
									/>
									<span class="mr3">{$_('order.saleNumber')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th>
							<th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.createdAt == 'desc' ? true : false}
										on:change={(e) => handleSortDate(e)}
									/>
									<span class="mr3">{$_('message.createdDate')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th>
							<th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.price == 'desc' ? true : false}
										on:change={(e) => handleSortPrice(e)}
									/>
									<span class="mr3">{$_('cart.total')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th>
							<th>
								<label class="checkbox-button pointer">
									<input
										type="checkbox"
										value="desc"
										checked={sort.status == 'desc' ? true : false}
										on:change={(e) => handleSortStatus(e)}
									/>
									<span class="mr3">{$_('device.status')}</span>
									<span class="icon flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="#9eabb4"
											width="18px"
											height="18px"
											><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
											/></svg
										>
									</span>
								</label>
							</th>
							<th class="">{$_('order.attention')}</th>
							<th class="tr" width="1">{$_('device.availableActions')}</th>
						</tr>
					</thead>
				{/if}
				<tbody>
					{#if isLoading}
						<ContentLoader
							uniqueKey="cartPage"
							primaryColor="#e4e6ef"
							secondaryColor="#f8f8f8"
							width={config.containerDesktop - 30}
							height="100"
						>
							<rect x="0" y="0" rx="3" ry="3" width="800" height="20" />
							<rect
								x="0"
								y="40"
								rx="3"
								ry="3"
								width={config.containerDesktop - 30}
								height="20"
							/>
							<rect
								x="0"
								y="40"
								rx="3"
								ry="3"
								width={config.containerDesktop - 30}
								height="20"
							/>
							<rect x="0" y="80" rx="3" ry="3" width="800" height="20" />
						</ContentLoader>
					{:else if list.length > 0}
						{#each list as item}
							<PcItemSelling {item} {isLoadingDetail} {handlePayment} />
						{/each}
					{:else}
						<div class="pb6 mt4 f4 pl4">{$_('message.noItems')}</div>
					{/if}
				</tbody>
			</table>
			{#if list.length > 0}
				<div class="flex justify-end mt5 pr4">
					<PcPagination totalItems={countList} {offset} onPage={handlePage} />
				</div>
			{/if}
		</div> -->
	</main>
{/if}

<style>
	.table-sales {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}
	.w-status-select {
		color: #9fb0c9;
	}
	/* .checkbox-button {
		display: flex;
		align-items: center;
	}
	.checkbox-button input {
		display: none;
	}
	.checkbox-button input[type='checkbox']:checked ~ .icon {
		transform: rotate(180deg);
	} */

	.input-icon input {
		padding-left: 45px;
		padding-right: 10px;
	}
</style>
