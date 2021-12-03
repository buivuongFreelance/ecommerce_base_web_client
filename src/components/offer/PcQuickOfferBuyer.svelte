<script>
	import { _ } from 'svelte-i18n';
	import {
		displayCurrencyReverse,
		displayCurrencyDb,
		displayProposalBuyerStrDevice,
		displayProposalSellerStrCart,
		extractNamesFromQuestions,
		displayCurrency,
		formatTimestamp,
	} from '../../functions';
	import { currency } from '../../stores';
	import config from '../../config';
	import IconAccepted from '../icon/IconAccepted.svelte';
	import IconComment from '../icon/IconComment.svelte';
	import IconRejected from '../icon/IconRejected.svelte';

	export let item;
	export let listQuestion;
</script>

<style>
	.w-proposal {
		width: 100%;
	}

	.list {
		list-style: inherit;
		padding-left: 50px;
	}
	.d-list {
		display: block;
		padding-left: calc(3rem + 4px);
		list-style-type: disc;
		margin-top: 10px;
	}
	.ml-50-px {
		margin-left: 50px;
	}
	.text-nowrap {
		white-space: nowrap;
	}
</style>

<div class="w-proposal bg-white ba b--light-gray br2">
	<div class="pv3 ph4">
		{#if item.proposal_status === config.proposal.buyerCreated || item.proposal_status === config.proposal.buyerReply}
			{#if item.exchange_devices.length > 0 && item.proposal_type != config.sell}
				<div class="flex items-center">
					<span class="flex items-center mr3">
						<IconComment />
					</span>
					<span class="fw6 dark-blue">
						{$_(displayProposalBuyerStrDevice(item.buyer_real_exchange_price))}

						{$_('proposal.forYourDeviceInExchangeWith')}:
					</span>
				</div>

				<ul class="list mt3">
					{#each item.exchange_devices as i}
						<li class="fw6 blue underline"><span> {i.model}</span></li>
					{/each}
				</ul>
				<div class="mt3 ml-50-px">
					<span>{$_('cart.and')} </span>

					{#if item.buyer_real_exchange_price < 0}
						<span> {$_('proposal.receiveAnAmountOf')} </span>
					{:else}<span> {$_('proposal.payAnAmountOf')} </span>{/if}

					<b>
						{#if item.buyer_real_exchange_price == 0}
							{displayCurrencyDb(item.buyer_real_exchange_price, $currency)}
						{:else}
							{displayCurrencyReverse(item.buyer_real_exchange_price, $currency)}
						{/if}
						{$currency}
					</b>
				</div>
			{:else}
				<div class="flex">
					<span class="flex mr4">
						<IconComment />
					</span>
					<div>
						<div>
							<span>{$_('proposal.theOfferForYourDevice')}</span>
							<span class="fw6">
								{displayCurrencyReverse(item.buyer_real_sale_price, $currency)}
								{$currency}
							</span>
						</div>
					</div>
				</div>
			{/if}
		{/if}

		{#if item.proposal_status === config.proposal.sellerReply}
			{#if item.exchange_devices}
				{#if item.exchange_devices.length > 0 && item.proposal_type != config.sell}
					<div class="flex items-center">
						<span class="flex items-center mr3">
							<IconComment />
						</span>
						<span class="fw6 dark-blue">
							{$_('label.you')}
							{$_(displayProposalSellerStrCart(item.buyer_real_exchange_price))}
							{$_('proposal.yourDeviceInExchangeWith')}
						</span>
					</div>

					<ul class="list mt3">
						{#each item.exchange_devices as i}
							<li class="fw6 blue underline">{i.model}</li>
						{/each}
					</ul>
					<div class="ml-50-px mt3">
						<span>{$_('cart.and')}</span>

						{#if item.buyer_real_exchange_price > 0}
							<span> {$_('proposal.receiveAnAmountOf')} </span>
						{:else}<span> {$_('proposal.payAnAmountOf')} </span>{/if}

						{#if item.buyer_real_exchange_price == 0}
							{displayCurrencyDb(item.buyer_real_exchange_price, $currency)}
						{:else}
							{displayCurrencyReverse(item.buyer_real_exchange_price, $currency)}
						{/if}
						{$currency}
					</div>
				{:else}
					<div class="flex items-center">
						<span class="flex items-center mr3">
							<IconComment />
						</span>
						<span>{$_('proposal.youRequested')}</span>
						&nbsp;
						<span class="fw6">
							{displayCurrencyReverse(item.buyer_real_sale_price, $currency)}
							{$currency}</span>
						&nbsp;
						<span> {$_('proposal.forYourDevice')} </span>
					</div>
				{/if}
			{/if}
		{/if}

		{#if item.proposal_status === config.proposal.sellerReject}
			{#if item.proposal_type === config.sell}
				<div class="flex items-center">
					<span class="flex items-center mr3"><IconRejected /></span>
					<span class="fw6 red">
						{$_('proposal.youRejectedTheOfferOf')}
						{item.buyer_real_sale_price}
						{$currency}
						{$_('proposal.forYourDeviceWithFollowingReasons')}
					</span>
				</div>
				{#if item.questions}
					{#if item.questions.length > 0}
						<ul class="d-list">
							{#each extractNamesFromQuestions(listQuestion, item.questions) as question}
								<li>{question}</li>
							{/each}
						</ul>
					{/if}
				{/if}
			{:else}
				<div class="flex items-center">
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
				{#if item.questions}
					{#if item.questions.length > 0}
						<ul class="d-list">
							{#each extractNamesFromQuestions(listQuestion, item.questions) as question}
								<li>{question}</li>
							{/each}
						</ul>
					{/if}
				{/if}
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

		{#if item.proposal_status === config.proposal.sellerAccept}
			{#if item.proposal_type === config.sell}
				<div class="flex items-center">
					<span class="flex items-center mr3"><IconAccepted /></span>
					<span class="fw6 green">
						{$_('proposal.youAcceptTheOfferOf')}
						{item.buyer_real_sale_price}
						{$currency}
						{$_('proposal.forYourDevice')}
					</span>
				</div>
			{:else}
				<div class="flex items-center">
					<span class="flex items-center mr3"><IconAccepted /></span>
					<span class="fw6 green">
						<!-- {$_('proposal.sellerAccepted')} -->

						{$_('proposal.youAcceptedTheExchangeOf')}
						{$_('proposal.yourDevice')}
						{$_('message.with')}
						<!-- {#if item.exchange_devices.length > 0 && item.proposal_type != config.sell}
						<span
							class="fw6 green">{$_(displayProposalBuyerStrAccept(item.buyer_real_exchange_price))}</span>
						{#if item.buyer_real_exchange_price == 0}
							{displayCurrencyDb(item.buyer_real_exchange_price, $currency)}
						{:else}
							{displayCurrencyReverse(item.buyer_real_exchange_price, $currency)}
						{/if}
						{$currency}
						{$_('proposal.inExchangeFor')}
					{:else}
						{displayCurrency(item.buyer_real_sale_price, $currency)}
						{$currency}
						{$_('proposal.forYourDevice')}
					{/if} -->
					</span>
				</div>
				<ul class="list mt3">
					{#each item.exchange_devices as i}
						<li class="fw6 ">
							<a href={'device/' + i.id} class="blue underline"> {i.model}</a>
						</li>
					{/each}
				</ul>
				<div class="ml-50-px mt3">
					{$_('cart.and')}
					{#if item.exchange_devices.length > 0 && item.proposal_type != config.sell}
						{#if item.buyer_real_exchange_price > 0}
							{$_('proposal.payAnAmountOf')}
						{:else}{$_('proposal.receiveAnAmountOf')}{/if}

						<b>
							{#if item.buyer_real_exchange_price == 0}
								{displayCurrencyDb(item.buyer_real_exchange_price, $currency)}
							{:else}
								{displayCurrencyReverse(item.buyer_real_exchange_price, $currency)}
							{/if}
							{$currency}
						</b>
					{:else}
						{#if item.buyer_real_sale_price > 0}
							{$_('proposal.payAnAmountOf')}
						{:else}{$_('proposal.receiveAnAmountOf')}{/if}
						<b>
							{displayCurrency(item.buyer_real_sale_price, $currency)}
							{$currency}
						</b>
					{/if}
				</div>
			{/if}
		{/if}
		{#if item.updated_at}
			<div class="i tr mt3 gray ">
				<small class="flex items-center justify-end">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="16"
						viewBox="0 0 24 24"
						width="16"
						fill="#9eabb4"><path d="M0 0h24v24H0V0z" fill="none" />
						<path
							d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
					</svg>
					<span class="ml1">{formatTimestamp(item.updated_at)}</span>
				</small>
			</div>
		{/if}
	</div>
</div>
<div class="text-nowrap ml3 mt3 i">
	{$_('label.by')}
	<span class="dark-blue">{item.cart_email}</span>
</div>
