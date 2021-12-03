<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { auth } from '../../stores';
	import { detailTransaction as apiDetailTransaction } from '../../services/transaction';
	import { listQuestionBuyerReject as apiListQuestionBuyerReject } from '../../services/model';

	import { onMount } from 'svelte';
	import { extractNamesFromQuestions } from '../../functions';

	import IconCall from '../icon/IconCall.svelte';

	const { session, page } = stores();
	const { domainTransaction, domainModel } = $session;

	export let transCode;
	export let deviceName;
	export let deviceId;
	export let isBuyer;
	export let purchaseCode;
	export let saleCode;
	export let purchaseId;
	export let saleId;
	export let id;

	let isLoading = false;
	let isServerError = false;
	let listQuestion = null;
	let detail = null;

	onMount(async () => {
		await detailTransaction();
		await listQuestionBuyerReject();
	});
	const listQuestionBuyerReject = () => {
		return new Promise((resolve, reject) => {
			apiListQuestionBuyerReject(domainModel)
				.then((items) => {
					listQuestion = items.list;
					resolve();
				})
				.catch(() => {
					reject();
				});
		});
	};
	const detailTransaction = () => {
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailTransaction(domainTransaction, {
				token,
				id: $page.params.id,
			})
				.then((rs) => {
					detail = rs;
					id = rs.id;
					transCode = rs.transaction_code;
					deviceName = rs.model;
					deviceId = rs.device_id;
					isBuyer = rs.is_buyer;
					purchaseCode = rs.order_number;
					saleCode = rs.order_seller_number;
					purchaseId = rs.order_id;
					saleId = rs.order_seller_id;

					resolve();
				})
				.catch(() => {
					reject();
				});
		});
	};
</script>

<div class="dispute  mt5">
	<div class="dispute__image w-50">
		<img src="images/dispute.png" alt="dispute" class="" />
	</div>
	<div class="dispute__content w-50">
		<div class="dispute__title">{$_('dispute.openDispute')}</div>
		{#if isServerError}
			error
		{:else if isLoading}
			Loading...
		{:else if listQuestion && detail}
			{#if listQuestion.length > 0}
				<ul class="dispute__list ul ">
					{#each extractNamesFromQuestions(listQuestion, detail.questions) as item}
						<li>{item}</li>
					{/each}
				</ul>
			{:else}
				...
			{/if}
		{/if}
		<div class="dispute__contact f4">
			<div class="light-silver">Contact us immediately by number:</div>
			<div class="f2 b red flex items-center flex-gap10px">
				<IconCall size="40" fill="#f64e60" />
				<span>0123.456.789</span>
			</div>
		</div>
	</div>
</div>

<style>
	.dispute {
		display: flex;
		align-items: center;
	}
	.dispute__title {
		font-size: 3rem;
		font-weight: 300;
	}
	.dispute__list {
		margin-top: 2rem;
	}
	.dispute__list li {
		margin-top: 0.5rem;
	}
	.dispute__image {
		text-align: center;
	}
	.dispute__image img {
		width: 60%;
	}
	.dispute__contact {
		margin-top: 2rem;
	}
</style>
