<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { listProposal as apiListProposal } from '../../services/proposal';
	import { listQuestionSellerReject as apiListQuestionSellerReject } from '../../services/model';
	import {
		auth,
		currency,
		idsProposalDeleteOrReject,
		notifyBuyerChanged,
	} from '../../stores';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';
	import PcPagination from '../form/PcPagination.svelte';
	import PcProposalItem from './PcProposalItem.svelte';
	import IconRejected from '../icon/IconRejected.svelte';
	import { displayCurrency, extractNamesFromQuestions } from '../../functions';
	import PcButtonClearFilter from '../button/PcButtonClearFilter.svelte';
	import IconSort from '../icon/IconSort.svelte';
	import MobileProposalItem from './MobileProposalItem.svelte';

	const { session } = stores();
	const { domainProposal, domainModel } = $session;
	export let id;

	let isLoading = true;
	let offset = 0;
	let list = [];
	let listQuestion = [];
	let countList = 0;
	let isServerError = false;
	let mounted = false;
	let filter = {
		deviceName: '',
		status: '',
		type: '',
	};
	let sort = { price: '' };
	let listDeletedOrRejected = [];

	const unsubscribeNotifyBuyerChanged = notifyBuyerChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					listProposal();
				}
			}
		}
	);

	const unsubscribeIdsProposalDeleteOrReject = idsProposalDeleteOrReject.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					list.map((item) => {
						if (value.includes(item.cart_id)) {
							let flag = true;
							for (let i = 0; i < listDeletedOrRejected.length; i++) {
								const l = listDeletedOrRejected[i];
								if (l.cart_id === item.cart_id) {
									flag = false;
									break;
								}
							}
							if (flag) {
								listDeletedOrRejected.push(item);
							}
						}
					});
					listDeletedOrRejected = listDeletedOrRejected;
					listProposal();
				}
			}
		}
	);
	const handleRemoveItemDeletedOrRejected = (item) => {
		const index = listDeletedOrRejected.map((e) => e.id).indexOf(item.id);
		if (index !== -1) {
			listDeletedOrRejected.splice(index, 1);
			listDeletedOrRejected = listDeletedOrRejected;
		}
	};
	onMount(async () => {
		await listProposal();
		await listQuestionSellerReject();
		mounted = true;
	});

	onDestroy(() => {
		unsubscribeNotifyBuyerChanged();
		unsubscribeIdsProposalDeleteOrReject();
	});
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
	const listProposal = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListProposal(domainProposal, {
				token,
				limit: config.limit,
				offset,
				filter,
				sort,
				deviceId: id,
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
		await listProposal();
	};

	const handleFilter = async () => {
		offset = 0;
		await listProposal();
	};
	const handleFilterType = async (e) => {
		offset = 0;
		filter.type = e.target.value;
		await listProposal();
	};
	const handleSort = async (e) => {
		offset = 0;
		sort.price = e.target.checked ? e.target.value : '';

		await listProposal();
	};

	const handleClearFilter = async () => {
		filter = {
			deviceName: '',
			status: '',
			type: '',
		};
		sort = { price: '' };
		offset = 0;
		await listProposal();
	};

	const handleSuccessReject = (item, questions) => {
		item.questionList = questions;
		let flag = true;
		for (let i = 0; i < listDeletedOrRejected.length; i++) {
			const l = listDeletedOrRejected[i];
			if (l.cart_id === item.cart_id) {
				listDeletedOrRejected.splice(i, 1);
				break;
			}
		}
		if (flag) {
			listDeletedOrRejected.push(item);
		}
		listDeletedOrRejected = listDeletedOrRejected;
		item.questionList = questions;
		listProposal();
	};

	const handleSuccessAccept = async () => {
		await listProposal();
	};
	const handleSuccessCancel = async () => {
		await listProposal();
	};
</script>

<style>
	.d-list {
		display: block;
		padding-left: calc(1rem + 6px);
		list-style-type: disc;
		margin-top: 10px;
	}
	.w-status-select {
		width: 180px;
		color: #9fb0c9;
	}
	.checkbox-button .btn {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		padding: 0 17px;
		background-color: #e4e9ea;
		color: #6c7293;
		border-radius: 4px;
		font-weight: 600;
	}
	.checkbox-button input {
		display: none;
	}
	.checkbox-button input[type='checkbox']:checked + .btn {
		background-color: #2f3a97;
		color: white;
	}
	.device-info {
		/* width: 38%; */
		flex: 1;
	}
	.w-image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.image {
		/* width: 80px; */
		/* height: 110px; */
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}
	.offer {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
		border-radius: 10px;
	}
</style>

{#if isServerError}
	<div class="w-100 spacing-ext center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<div class="w-100 spacing-ext pt5 pb3">
		<h2 class="mb4 ttc">{$_('offer.myOffers')}</h2>
		<div class="justify-between flex">
			{#if isLoading}
				<ContentLoader
					uniqueKey="filterDevice"
					primaryColor="#e4e6ef"
					secondaryColor="#f8f8f8"
					width={config.containerDesktop - 30}
					height="40">
					<rect x="0" y="0" rx="3" ry="3" width="80%" height="40" />
				</ContentLoader>
			{:else}
				<form
					class="flex flex-wrap"
					autocomplete="off"
					on:submit|preventDefault={handleFilter}>
					<!-- svelte-ignore a11y-no-onchange -->
					<select
						class="bg-white b--light-gray br2 ba fw6 ph3 h-40-px ttc
							w-status-select mr3 mb3"
						value={filter.type}
						on:change={(e) => handleFilterType(e)}>
						<option value="">{$_('offer.allType')}</option>
						<option value={config.sell}>{$_('home.sell')}</option>
						<option value={config.exchange}>{$_('home.exchange')}</option>
					</select>

					<label class="checkbox-button pointer mr3">
						<input
							type="checkbox"
							value="price_desc"
							checked={sort.price == 'price_desc' ? true : false}
							on:change={(e) => handleSort(e)} />
						<span class="btn pointer dim f6">
							<IconSort
								fill={sort.price == 'price_desc' ? 'white' : '#6C7293'}
								size="20" />
							<span class="ml3">{$_('label.sortPriceDESC')}</span>
						</span>
					</label>
					<PcButtonClearFilter onClickButton={handleClearFilter} />
				</form>
			{/if}
		</div>
	</div>
	<div class="pb5 mt5 w-100 spacing-ext">
		{#if listDeletedOrRejected.length > 0}
			{#each listDeletedOrRejected as item}
				<div class="offer pa4 bg-red-10 mt4">
					<div class="flex">
						<div
							class="ba bw2 b--white bg-white flex items-center justify-center w-image">
							<img src={item.url} alt="no" class="image ba b--white" />
						</div>
						<div class="device-info ml4 flex justify-between">
							<div>
								<span class="db b link near-black db ttc">
									{item.model}

									{item.capacity}
									{$_('label.GB')}

									{item.color}
								</span>
							</div>
						</div>
						<button
							on:click={handleRemoveItemDeletedOrRejected(item)}
							type="button"
							class="h-30-px br1 f6 ttu bn near-black bg-transparent pointer grow ml5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24">
								<path
									d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
							</svg>
						</button>
					</div>
					{#if item.questionList}
						{#if item.proposal_type === config.sell}
							<div class="flex items-center">
								<span class="flex items-center mr3 mt3"><IconRejected /></span>
								<span class="fw6 red">
									{$_('proposal.youRejectedTheOfferOf')}
									{item.buyer_real_sale_price}
									{$currency}
									{$_('proposal.forYourDeviceWithFollowingReasons')}
								</span>
							</div>
							<ul class="d-list">
								{#each extractNamesFromQuestions(listQuestion, item.questionList) as question}
									<li>{question}</li>
								{/each}
							</ul>
						{:else}
							<div class="flex items-center mt3">
								<span class="flex items-center mr3"><IconRejected /></span>
								<span class="fw6 red">
									<!-- {$_('proposal.youRejected')} -->
									{#if item.proposal_type === config.exchange}
										{#if item.buyer_real_exchange_price > 0}
											{$_('proposal.youRejectedTheRequestOf')}
										{:else}{$_('proposal.youRejectedTheOfferOf')}{/if}
									{:else if item.buyer_real_sale_price > 0}
										{$_('proposal.youRejectedTheRequestOf')}
									{:else}{$_('proposal.youRejectedTheOfferOf')}{/if}
								</span>
							</div>

							<ul class="d-list">
								{#each extractNamesFromQuestions(listQuestion, item.questionList) as question}
									<li>{question}</li>
								{/each}
							</ul>

							<div class="mt3 ml-50-px">
								{$_('cart.and')}
								{$_('device.of')}
								<b>
									{#if item.proposal_type === config.exchange}
										{displayCurrency(item.buyer_real_exchange_price, $currency)}
									{:else}{item.buyer_real_sale_price}{/if}
									{$currency}
								</b>
								{$_('proposal.forYourDeviceWithFollowingReasons')}
							</div>
						{/if}
					{/if}
					{#if !item.questionList}
						<div class=" mt4">
							<div class="text-nowrap i red pa4 br2 bg-red-10">
								{$_('message.thisOfferWasRemovedBy')}
								<span class="dark-blue">{item.cart_email}</span>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
		{#if isLoading}
			<ContentLoader
				uniqueKey="listDevice"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={375}
				height="200">
				<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
				<rect x="0" y="60" rx="3" ry="3" width="100%" height="20" />
				<rect x="0" y="100" rx="3" ry="3" width="100%" height="20" />
				<rect x="0" y="140" rx="3" ry="3" width="100%" height="20" />
				<rect x="0" y="180" rx="3" ry="3" width="100%" height="20" />
			</ContentLoader>
		{:else if list.length > 0}
			{#each list as item}
				<MobileProposalItem
					{item}
					{listQuestion}
					onSuccessReject={handleSuccessReject}
					onSuccessAccept={handleSuccessAccept}
					onSuccessCancel={handleSuccessCancel} />
			{/each}
			<div class="flex justify-end mt5">
				<PcPagination totalItems={countList} {offset} onPage={handlePage} />
			</div>
		{:else if list.length <= 0 && listDeletedOrRejected.length <= 0}
			<div class="pb6 mt4 f4">{$_('message.noItems')}</div>
		{/if}
	</div>
{/if}
