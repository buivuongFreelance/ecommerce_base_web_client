<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { goto } from '@sapper/app';
	import config from '../../config';
	import { auth, linkToBack, settings } from '../../stores';
	import { censorEmail, convertMillisecondsToHours } from '../../functions';
	import IconSMS from '../icon/IconSMS.svelte';
	import IconTimer from '../icon/IconTimer.svelte';
	import { differenceInSeconds } from 'date-fns';
	import { tweened } from 'svelte/motion';
	import { msToSeconds } from '../../functions';
	import { onDestroy, onMount } from 'svelte';
	import {
		apiTestScanSellerConfirm,
		apiTestScanBuyerConfirm,
		apiTestScanBuyerReject,
	} from '../../services/transaction';

	export let detail = null;

	let timer = null;
	let intervalTimer = null;
	let remainingAcceptTimeout = 0;

	const { session, page } = stores();
	const { domainTransaction } = $session;

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

	onMount(() => {
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
		let result = 0;
		if (
			detail.status == config.order.created ||
			(detail.status == config.order.ownerScanned && detail.passcode == null) ||
			detail.status == config.order.ready
		) {
			result = Math.abs(
				differenceInSeconds(new Date(detail.created_at), new Date())
			);
		} else if (detail.status == config.order.buyerReceived) {
			result = Math.abs(
				differenceInSeconds(new Date(detail.updated_at), new Date())
			);
		} else {
			result = Math.abs(
				differenceInSeconds(new Date(detail.updated_at), new Date())
			);
		}

		const timeAccept = msToSeconds($settings.timer_seller_must_scan);

		if (result < timeAccept) {
			remainingAcceptTimeout = timeAccept - parseFloat(result);
			timer = tweened(remainingAcceptTimeout);
			intervalTimer = setInterval(setTimer, 1000);
		} else {
			remainingAcceptTimeout = 0;
		}
	};

	const handleTestScanSellerConfirm = (detail) => {
		const token = $auth.accessToken;

		apiTestScanSellerConfirm(domainTransaction, {
			transactionCode: detail.id,
			token,
		})
			.then((rs) => {
				window.location.reload();
			})
			.catch((error) => {});
	};

	const handleTestScanBuyerConfirm = (detail) => {
		const token = $auth.accessToken;

		apiTestScanBuyerConfirm(domainTransaction, {
			transactionCode: detail.id,
			token,
		})
			.then((rs) => {
				window.location.reload();
			})
			.catch((error) => {});
	};

	const handleTestScanBuyerReject = (detail) => {
		const token = $auth.accessToken;

		apiTestScanBuyerReject(domainTransaction, {
			transactionCode: detail.id,
			token,
		})
			.then((rs) => {
				window.location.reload();
			})
			.catch((error) => {});
	};
</script>

{#if detail.type == config.buyer}
	{#if detail.status == config.order.created}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.inPrepared')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
		</div>
		{#if detail.email == $auth.email}
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}
					{$_('label.GB')}
					{$_('message.isNotScannedDeliveredBy')}
					<b>{detail.seller_email}</b>
				</p>
			</div>
		{:else}
			<div class="flex flex-column items-center">
				<div class="mv3 tc">
					{$_('transaction.youMustScan')}
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
				</div>
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
					on:click={() => goto('my-transactions/transaction-scan/' + detail.id)}
				>
					{$_('transaction.scanNow')}
				</button>
				{#if remainingAcceptTimeout != 0}
					<div class="mt2rem light-silver flex items-center justify-center">
						<IconTimer size="20" fill="#6c7293" />
						<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
					</div>
					<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
						{hours}:{minutes}:{seconds}
					</div>
				{/if}
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2"
					on:click={() => handleTestScanSellerConfirm(detail)}
				>
					Test Scan Seller Confirm
				</button>
			</div>
		{/if}
	{:else if detail.status == config.order.ownerScanned && detail.passcode == null}
		{#if detail.email != $auth.email}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
						{$_('message.inPrepared')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="flex flex-column items-center">
				<div class="mv3">
					{$_('transaction.youMustSubmitCode')}
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
				</div>
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
					on:click={() => goto('my-transactions/submit-passcode/' + detail.id)}
				>
					{$_('message.submitPasscode')}
				</button>
				{#if remainingAcceptTimeout != 0}
					<div class="mt2rem light-silver flex items-center justify-center">
						<IconTimer size="20" fill="#6c7293" />
						<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
					</div>
					<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
						{hours}:{minutes}:{seconds}
					</div>
				{/if}
			</div>
		{:else}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph4 pv3 f2 b">
						{$_('message.inPrepared')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.isNotScannedDeliveredBy')}
					<b>{detail.seller_email}</b>
				</p>
			</div>
		{/if}
	{:else if detail.status == config.order.ready}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.ready')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.scannedAndToBeShipped')}
				</p>
			</div>
			{#if detail.email != $auth.email}
				{#if detail.transactionsNotReady}
					{#if detail.transactionsNotReady.length > 0}
						<p class="tc mt2rem">{$_('transaction.remainingTransactions')}:</p>
						<ul class="tc">
							{#each detail.transactionsNotReady as item}
								<li>
									<span
										class="blue dim underline pointer"
										on:click={() => {
											if (item.charge_stripe == null) {
												goto('my-sales/' + item.order_seller_id);
											} else {
												linkToBack.set('my-transactions/' + item.id);
												goto('/empty');
											}
										}}
									>
										{item.model}
									</span>
									{item.charge_stripe == null ? '(Not yet payment)' : ''}
								</li>
							{/each}
						</ul>
					{:else}
						<div class="tc mt2rem">
							<button
								type="button"
								class="ttc bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
								on:click={() =>
									goto('my-transactions/pickup/' + detail.order_seller_id)}
							>
								{$_('pickup.createPickup')}
							</button>
							<div class="mt1rem red ">
								<span class="dif items-center pa1rem bg-red-10 br2">
									<IconSMS fill="#f64e60" />
									<span class="ml2">{$_('transaction.descPickup')}</span>
								</span>
							</div>
							{#if remainingAcceptTimeout != 0}
								<div
									class="mt2rem light-silver flex items-center justify-center"
								>
									<IconTimer size="20" fill="#6c7293" />
									<span class="ml1">
										{$_('transaction.remainingTimeToScan')}</span
									>
								</div>
								<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
									{hours}:{minutes}:{seconds}
								</div>
							{/if}
						</div>
					{/if}
				{/if}
			{/if}
		</div>
	{:else if detail.status == config.order.toBeShipped}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.toBeShipped')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.scannedAndToBeShipped')}
				</p>
			</div>
		</div>
	{:else if detail.status == config.order.shipped}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.shipped')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					<span class="ttl"> {$_('message.shipped')}</span>
				</p>
			</div>
		</div>
	{:else if detail.status == config.order.buyerReceived}
		{#if detail.email != $auth.email}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
						{$_('message.delivered')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.isNotScannedBy')}
					<b>{censorEmail(detail.email)}</b>
				</p>
			</div>
		{:else}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph4 pv3 f2 b">
						{$_('message.delivered')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="flex flex-column items-center">
				<div class="mv3 tc">
					{$_('transaction.youMustScan')}
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
				</div>
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
					on:click={() =>
						goto('my-transactions/transaction-confirm-scan/' + detail.id)}
				>
					{$_('cart.confirm')}
				</button>
				{#if remainingAcceptTimeout != 0}
					<div class="mt2rem light-silver flex items-center justify-center">
						<IconTimer size="20" fill="#6c7293" />
						<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
					</div>
					<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
						{hours}:{minutes}:{seconds}
					</div>
				{/if}
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2"
					on:click={() => handleTestScanBuyerConfirm(detail)}
				>
					Test Scan Buyer Confirm
				</button>
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2"
					on:click={() => handleTestScanBuyerReject(detail)}
				>
					Test Scan Buyer Reject
				</button>
			</div>
		{/if}
	{:else if detail.status == config.order.buyerAccept}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.confirmed')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
		</div>
	{:else if detail.status == config.order.buyerRejected}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.inDispute')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div>
				{#each detail.questions as question}
					<p>{question.name}</p>
				{/each}
			</div>
			{#if detail.status == config.order.buyerRejected && detail.questions}
				<div class="flex flex-column items-center">
					<button
						type="button"
						class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
						on:click={() => goto('my-transactions/dispute/' + detail.id)}
					>
						{$_('dispute.openDispute')}
					</button>
				</div>
			{/if}
		</div>
	{:else if detail.status == config.transaction.systemCancelled}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.cancelled')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{#if detail.email == $auth.email}
						{$_('transaction.descSystemCancelBuyer', {
							values: {
								hour: convertMillisecondsToHours(
									$settings.transaction_seller_must_scan_timer
								),
								device:
									detail.model +
									' ' +
									detail.color +
									' ' +
									detail.capacity +
									' ' +
									$_('label.GB'),
							},
						})}
					{:else}
						{$_('transaction.descSystemCancelSeller', {
							values: {
								hour: convertMillisecondsToHours(
									$settings.transaction_seller_must_scan_timer
								),
								device:
									detail.model +
									' ' +
									detail.color +
									' ' +
									detail.capacity +
									' ' +
									$_('label.GB'),
							},
						})}
					{/if}
				</p>
			</div>
		</div>
	{/if}
{:else if detail.type != config.buyer}
	{#if detail.status == config.order.created}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.inPrepared')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
		</div>
		{#if (detail.email == $auth.email && detail.type == config.seller) || (detail.email != $auth.email && detail.type == config.order.group)}
			<div class="flex flex-column items-center">
				<div class="mv3 tc">
					{$_('transaction.youMustScan')}
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
				</div>
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
					on:click={() => goto('my-transactions/transaction-scan/' + detail.id)}
				>
					{$_('transaction.scanNow')}
				</button>
				{#if remainingAcceptTimeout != 0}
					<div class="mt2rem light-silver flex items-center justify-center">
						<IconTimer size="20" fill="#6c7293" />
						<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
					</div>
					<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
						{hours}:{minutes}:{seconds}
					</div>
				{/if}
			</div>
		{:else}
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}
					{$_('label.GB')}
					{$_('message.isNotScannedDeliveredBy')}
					<b>{detail.seller_email}</b>
				</p>
			</div>
		{/if}
	{:else if detail.status == config.order.ownerScanned && detail.passcode == null}
		{#if (detail.email != $auth.email && detail.type == config.order.group) || (detail.email == $auth.email && detail.type == config.seller)}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
						{$_('message.inPrepared')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="flex flex-column items-center">
				<div class="mv3">
					{$_('transaction.youMustSubmitCode')}
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
				</div>
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
					on:click={() => goto('my-transactions/submit-passcode/' + detail.id)}
				>
					{$_('message.submitPasscode')}
				</button>
				{#if remainingAcceptTimeout != 0}
					<div class="mt2rem light-silver flex items-center justify-center">
						<IconTimer size="20" fill="#6c7293" />
						<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
					</div>
					<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
						{hours}:{minutes}:{seconds}
					</div>
				{/if}
			</div>
		{:else}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph4 pv3 f2 b">
						{$_('message.inPrepared')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.isNotScannedDeliveredBy')}
					<b>{detail.seller_email}</b>
				</p>
			</div>
		{/if}
	{:else if detail.status == config.order.ready}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.ready')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.scannedAndToBeShipped')}
				</p>
			</div>
		</div>
		{#if detail.transactionsNotReady}
			{#if detail.transactionsNotReady.length > 0 && detail.transactionsNotReady[0].device_email == $auth.email}
				<p class="tc mt2rem">{$_('transaction.remainingTransactions')}:</p>
				<ul class="tc">
					{#each detail.transactionsNotReady as item}
						<li>
							<span
								class="blue dim underline"
								on:click={() => {
									linkToBack.set('my-transactions/' + item.id);
									goto('/empty');
								}}
							>
								{item.model}</span
							>
						</li>
					{/each}
				</ul>
			{:else if detail.email != $auth.email && detail.type == config.order.group}
				<div class="tc mt2rem">
					<button
						type="button"
						class="ttc bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
						on:click={() =>
							goto('my-transactions/pickup/' + detail.order_seller_id)}
					>
						{$_('pickup.createPickup')}
					</button>
					<div class="mt1rem red ">
						<span class="dif items-center pa1rem bg-red-10 br2">
							<IconSMS fill="#f64e60" />
							<span class="ml2">{$_('transaction.descPickup')}</span>
						</span>
					</div>
					{#if remainingAcceptTimeout != 0}
						<div class="mt2rem light-silver flex items-center justify-center">
							<IconTimer size="20" fill="#6c7293" />
							<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
						</div>
						<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
							{hours}:{minutes}:{seconds}
						</div>
					{/if}
				</div>
			{:else if detail.email == $auth.email && detail.type == config.seller}
				<div class="tc mt2rem">
					<button
						type="button"
						class="ttc bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
						on:click={() =>
							goto('my-transactions/pickup/purchase/' + detail.order_id)}
					>
						{$_('pickup.createPickup')}
					</button>
					<div class="mt1rem red ">
						<span class="dif items-center pa1rem bg-red-10 br2">
							<IconSMS fill="#f64e60" />
							<span class="ml2">{$_('transaction.descPickup')}</span>
						</span>
					</div>
					{#if remainingAcceptTimeout != 0}
						<div class="mt2rem light-silver flex items-center justify-center">
							<IconTimer size="20" fill="#6c7293" />
							<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
						</div>
						<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
							{hours}:{minutes}:{seconds}
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	{:else if detail.status == config.order.toBeShipped}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.toBeShipped')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.scannedAndToBeShipped')}
				</p>
			</div>
		</div>
	{:else if detail.status == config.order.shipped}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.shipped')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					<span class="ttl"> {$_('message.shipped')}</span>
				</p>
			</div>
		</div>
	{:else if detail.status == config.order.buyerReceived}
		{#if (detail.email != $auth.email && detail.type == config.order.group) || (detail.email == $auth.email && detail.type == config.seller)}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
						{$_('message.delivered')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="tc mt3">
				<p class="f4 light-silver">
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
					{$_('message.isNotScannedBy')}
					<b>{censorEmail(detail.email)}</b>
				</p>
			</div>
		{:else if (detail.email == $auth.email && detail.type == config.order.group) || (detail.email != $auth.email && detail.type == config.seller)}
			<div class="tc">
				<div class="tc transaction-status">
					<span class="ba b--dark-blue bw2 dark-blue br2 ph4 pv3 f2 b">
						{$_('message.delivered')}
					</span>
				</div>
				<div class="light-silver mt2rem">
					{$_('order.transCode')}:
					<span class="fw6">{detail.transaction_code}</span>
				</div>
			</div>
			<div class="flex flex-column items-center">
				<div class="mv3">
					{$_('transaction.youMustScan')}
					{detail.model}
					{detail.color}
					{detail.capacity}{$_('label.GB')}
				</div>
				<button
					type="button"
					class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
					on:click={() =>
						goto('my-transactions/transaction-confirm-scan/' + detail.id)}
				>
					{$_('cart.confirm')}
				</button>
				{#if remainingAcceptTimeout != 0}
					<div class="mt2rem light-silver flex items-center justify-center">
						<IconTimer size="20" fill="#6c7293" />
						<span class="ml1"> {$_('transaction.remainingTimeToScan')}</span>
					</div>
					<div class="timeout fadeOutUp animated infinite f4 fw6 red mt4">
						{hours}:{minutes}:{seconds}
					</div>
				{/if}
			</div>
		{/if}
	{:else if detail.status == config.order.buyerAccept}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.confirmed')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
		</div>
	{:else if detail.status == config.order.buyerRejected}
		<div class="tc">
			<div class="tc transaction-status">
				<span class="ba b--dark-blue bw2 dark-blue br2 ph2rem pv3 f2 b">
					{$_('message.inDispute')}
				</span>
			</div>
			<div class="light-silver mt2rem">
				{$_('order.transCode')}:
				<span class="fw6">{detail.transaction_code}</span>
			</div>
			{#if detail.status == config.order.buyerRejected && detail.questions}
				<div class="flex flex-column items-center">
					<button
						type="button"
						class="bn mt3 fw6 bg-dark-blue white pointer grow ph5 f4 h-60-px br2 pulse animated infinite"
						on:click={() => goto('my-transactions/dispute/' + detail.id)}
					>
						{$_('dispute.openDispute')}
					</button>
				</div>
			{/if}
		</div>
	{/if}
{/if}
