<script>
	import { _ } from 'svelte-i18n';

	import config from '../../config';
	import {
		displayCurrencyNoReverse,
		displayCurrencyReverse,
		displayCurrencyDb,
		displayProposalBuyerStrCart,
		displayProposalSellerStrOwner,
		extractNamesFromQuestions,
		displayCurrency,
		uppercaseFirstLetter,
	} from '../../functions';
	import { currency } from '../../stores';
	import IconAccepted from '../icon/IconAccepted.svelte';
	import IconClose from '../icon/IconClose.svelte';
	import IconComment from '../icon/IconComment.svelte';
	import IconRejected from '../icon/IconRejected.svelte';
	import DimmerModal from '../loading/DimmerModal.svelte';

	export let item;
	export let listQuestion;
	export let onRemoveOffer = null;
</script>

<div
	class="w-proposal bg-white br2"
	class:bg-red-10={item.proposal_status == config.proposal.sellerReject}
	class:bg-green-10={item.proposal_status == config.proposal.sellerAccept}
>
	<div class="offer flex items-start justify-between">
		{#if item.proposals}
			{#if item.proposals.length > 0}
				<div>
					{#if item.proposal_status === config.proposal.buyerCreated || item.proposal_status === config.proposal.buyerReply}
						{#if item.proposals[0].exchange_devices.length > 0 && item.proposals[0].type == config.exchange}
							<div class="flex items-center">
								<span class="flex items-center mr3">
									<IconComment />
								</span>
								<div>
									{uppercaseFirstLetter($_('proposal.youOffered'))}
									{$_('proposal.followingDevices')}:
								</div>
							</div>
							<ul class="list mt3">
								{#each item.proposals[0].exchange_devices as i}
									<li class="fw6">
										<a
											href={'my-devices/' + i.id}
											class="blue underline pointer"
										>
											{i.model}
										</a>
									</li>
								{/each}
							</ul>
							<div class="mt3 pl-50-px">
								<span>{$_('cart.and')} </span>
								{#if item.proposal_status != config.proposal.sellerReply}
									<span>
										{$_(
											displayProposalBuyerStrCart(
												item.proposals[0].buyer_real_exchange_price
											)
										)}</span
									>
								{:else}
									<span>
										{$_(
											displayProposalSellerStrOwner(
												item.proposals[0].buyer_real_exchange_price
											)
										)}</span
									>
								{/if}
								<span class="fw6 dark-blue">
									{#if item.proposals[0].buyer_real_exchange_price == 0}
										{displayCurrencyDb(
											item.proposals[0].buyer_real_exchange_price,
											$currency
										)}
									{:else}
										{displayCurrencyNoReverse(
											item.proposals[0].buyer_real_exchange_price,
											$currency
										)}
									{/if}
									<u>{$currency}</u>
								</span>
							</div>
						{:else}
							<div class="flex items-center">
								<span class="flex items-center mr3">
									<IconComment />
								</span>
								<div class="flex flex-wrap flex-1">
									<span>
										{uppercaseFirstLetter($_('proposal.youOffered'))}
									</span>
									&nbsp;
									<span class="fw6">
										{displayCurrencyReverse(
											item.proposals[0].buyer_real_sale_price,
											$currency
										)}
										{$currency}
									</span>
									&nbsp;
									<span> {$_('proposal.forThisDevice')} </span>
								</div>
							</div>
						{/if}
					{/if}
					{#if item.proposal_status == config.proposal.sellerReply}
						{#if item}
							{#if item.proposals}
								{#if item.proposals.length > 0}
									{#if item.proposals[0].exchange_devices.length > 0}
										<div class="flex items-center">
											<span class="flex items-center mr3">
												<IconComment />
											</span>
											<span class="">
												<!-- {$_(displayProposalSellerStrOwner(item.proposals[0].buyer_real_exchange_price))} -->
												{#if item.proposals[0].buyer_real_exchange_price < 0}
													<span class="fw6">
														{uppercaseFirstLetter(
															$_('proposal.offerRequested')
														)}
													</span>
													<span class="light-silver">
														{item.model}
														-
														{item.capacity}{$_('label.GB')}
														-
														{item.color}
													</span>
													{$_('proposal.inExchangeWith')}
												{:else}
													<span class="fw6">
														{uppercaseFirstLetter($_('proposal.offerOffered'))}
													</span>
													<span class="light-silver">
														{item.model}
														-
														{item.capacity}{$_('label.GB')}
														-
														{item.color}
													</span>
													{$_('proposal.inExchangeWith')}
												{/if}
											</span>
										</div>
										<ul class="list">
											{#each item.proposals[0].exchange_devices as i}
												<li class="fw6 blue underline">{i.model}</li>
											{/each}
										</ul>
										<div class="mt3 pl-50-px">
											{$_('cart.and')}
											{#if item.proposals[0].buyer_real_exchange_price < 0}
												{$_('device.youTakePrice')}
											{:else}{$_('device.youPayPrice')}{/if}
											<b>
												{#if item.proposals[0].buyer_real_exchange_price == 0}
													{displayCurrencyDb(
														item.proposals[0].buyer_real_exchange_price,
														$currency
													)}
												{:else}
													{displayCurrencyReverse(
														item.proposals[0].buyer_real_exchange_price,
														$currency
													)}
												{/if}
											</b>
											<u>{$currency}</u>
										</div>
									{:else}
										<div class="flex items-center">
											<span class="flex items-center mr3">
												<IconComment />
											</span>
											<span class="fw6">
												{displayCurrencyNoReverse(
													item.proposals[0].buyer_real_sale_price,
													$currency
												)}
												{$currency}</span
											>
											&nbsp;
											<span>{$_('proposal.isRequested')}</span>
											&nbsp;
											<span>{$_('proposal.forThisDevice')}</span>
										</div>
									{/if}
								{/if}
							{/if}
						{/if}
					{/if}
					{#if item.proposal_status == config.proposal.sellerReject}
						{#if item.proposals[0].type === config.sell}
							<div class="flex items-center">
								<span class="flex items-center mr3"><IconRejected /></span>
								<span class="fw6 red">
									{#if item.proposals[0].buyer_real_sale_price > 0}
										{uppercaseFirstLetter($_('proposal.yourRequestOf'))}
									{:else}
										{uppercaseFirstLetter($_('proposal.yourOfferOf'))}
									{/if}
									{item.proposals[0].buyer_real_sale_price}
									{$currency}
									{$_('proposal.isRejected')}
									{$_('proposal.forFollowingReasons')}
								</span>
							</div>
							{#if item.questions}
								{#if item.questions.length > 0}
									<ul class="d-list ">
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
									<!-- {$_('proposal.isRejected')} -->
									{#if item.proposals[0].type === config.exchange}
										{#if item.proposals[0].buyer_real_exchange_price > 0}
											{uppercaseFirstLetter($_('proposal.yourRequestOf'))}
										{:else}{$_('proposal.yourOfferOf')}{/if}
									{:else if item.proposals[0].buyer_real_sale_price > 0}
										{uppercaseFirstLetter($_('proposal.yourRequestOf'))}
									{:else}
										{uppercaseFirstLetter($_('proposal.yourOfferOf'))}
									{/if}
									{$_('proposal.followingDevices')}
								</span>
							</div>
							{#if item.questions}
								{#if item.questions.length > 0}
									<ul class="d-list ">
										{#each extractNamesFromQuestions(listQuestion, item.questions) as question}
											<li>{question}</li>
										{/each}
									</ul>
								{/if}
							{/if}
							<div class="pl-50-px mt3">
								{$_('cart.and')}
								<b>
									{#if item.proposals[0].type === config.exchange}
										{#if item.proposals[0].buyer_real_exchange_price > 0}
											{$_('device.youTakePrice')}
										{:else}{$_('device.youPayPrice')}{/if}
										{displayCurrency(
											item.proposals[0].buyer_real_exchange_price,
											$currency
										)}
									{:else}
										{#if item.proposals[0].buyer_real_sale_price > 0}
											{$_('device.youTakePrice')}
										{:else}{$_('device.youPayPrice')}{/if}
										{item.proposals[0].buyer_real_sale_price}
									{/if}
									<u>{$currency}</u>
								</b>
								{$_('proposal.isRejectedForFollowingReasons')}
							</div>
						{/if}
					{/if}
					{#if item.proposal_status == config.proposal.sellerAccept}
						{#if item.proposals[0].exchange_devices.length > 0 && item.proposals[0].type == config.exchange}
							<div class="flex items-center">
								<span class="flex items-center mr3"><IconAccepted /></span>
								<div>
									<span class="fw6 green">
										<!-- {$_('proposal.ownerAccepted')} -->
										{uppercaseFirstLetter($_('proposal.theExchangeOf'))}
										{item.model}
										-
										{item.capacity}
										{$_('label.GB')}
										-
										{item.color}
										{$_('message.with')}
									</span>
								</div>
							</div>
							<ul class="list mt3">
								{#each item.proposals[0].exchange_devices as i}
									<li class="fw6 blue underline">{i.model}</li>
								{/each}
							</ul>
							<div class="pl-50-px mt3">
								{$_('cart.and')}
								{#if item.proposals[0].type === config.exchange}
									{#if item.proposals[0].buyer_real_exchange_price > 0}
										{$_('proposal.receiveAnAmountOf')}
									{:else}{$_('proposal.payAnAmountOf')}{/if}

									<span class="fw6">
										{#if item.proposals[0].buyer_real_exchange_price == 0}
											{displayCurrencyDb(
												item.proposals[0].buyer_real_exchange_price,
												$currency
											)}
										{:else}
											{displayCurrencyNoReverse(
												item.proposals[0].buyer_real_exchange_price,
												$currency
											)}
										{/if}
										<u>{$currency}</u>
									</span>
								{:else}
									{#if item.proposals[0].buyer_real_sale_price > 0}
										{$_('proposal.payAnAmountOf')}
									{:else}{$_('proposal.receiveAnAmountOf')}{/if}

									<span class="fw6">
										{#if item.proposals[0].buyer_real_sale_price == 0}
											{displayCurrencyDb(
												item.proposals[0].buyer_real_sale_price,
												$currency
											)}
										{:else}
											{displayCurrencyNoReverse(
												item.proposals[0].buyer_real_sale_price,
												$currency
											)}
										{/if}
										<u>{$currency}</u>
									</span>
								{/if}

								{$_('proposal.isAcceptedBytheOwner')}
							</div>
						{:else}
							<div class="flex items-center">
								<span class="flex items-center mr3"><IconAccepted /></span>
								<span class="fw6 green">{$_('proposal.isAccepted')}</span>
								&nbsp;
								<span class="fw6 green">
									{displayCurrencyReverse(
										item.proposals[0].buyer_real_sale_price,
										$currency
									)}
									<u>{$currency}</u>
								</span>
							</div>
						{/if}
					{/if}
				</div>
				<!-- button close -->
				{#if item.proposal_status !== config.proposal.sellerAccept}
					<div class="grow pointer ml4" on:click={onRemoveOffer}>
						<IconClose />
					</div>
				{/if}
			{/if}
		{/if}
	</div>
</div>

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
	.pl-50-px {
		padding-left: 50px;
	}
	.bg-green-10 {
		background-color: rgba(48, 136, 0, 0.1);
	}
	.offer {
		padding: 20px;
	}
</style>
