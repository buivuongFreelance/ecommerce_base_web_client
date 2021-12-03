<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	export let status;

	export let right = false;

	let isOpenTooltip = false;

	const handleTooltipOpen = () => {
		if (!isOpenTooltip) isOpenTooltip = true;
	};
	const handleTooltipClose = () => {
		if (isOpenTooltip) isOpenTooltip = false;
	};
</script>

{#if status === config.device.created}
	<div class="relative dib ">
		<span
			class="tooltip ttu f7 pv1 ph2 br2 blue ba b--blue text-nowrap"
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			>{$_('message.created')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderCreated')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.device.inTransaction}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 dark-blue ba b--bg-dark-blue text-nowrap"
			>{$_('message.inTransaction')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderInTransaction')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.ownerScanned}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 dark-gray bb b--dark-gray text-nowrap"
			>{$_('message.ownerScanned')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderOwnerScanned')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.buyerRejected}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 red ba b--red text-nowrap"
			>{$_('message.buyerRejected')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderBuyerRejected')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.inDispute}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 red ba b--red text-nowrap"
			>{$_('message.inDispute')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderInDispute')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.proposal.buyerAccept}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 green ba b--green text-nowrap"
			>{$_('cart.accepted')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderBuyerAccept')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.pending}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 yellow ba b--yellow text-nowrap"
			>{$_('message.pending')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderPending')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.waitingForDevicePayment}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 yellow ba b--yellow text-nowrap"
			>{$_('message.youNotPaidYet')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipOrderWaitingPay')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.devicePayment}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 green ba b--green text-nowrap"
			>{$_('label.paid')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('label.paid')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.processing}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 green ba b--green text-nowrap"
			>{$_('message.processing')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.tooltipProcessing')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.shipped}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 green ba b--green text-nowrap"
			>{$_('message.tooltipShipped')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.shipped')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.confirm}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 green ba b--green text-nowrap"
			>{$_('message.tooltipConfirmed')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.confirmed')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.transaction.systemCancelled}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 pv1 ph2 br2 red ba b--red text-nowrap"
			>{$_('message.tooltipCancel')}
			<sup>&#9432;</sup></span
		>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}
			>
				<p>{$_('message.cancelled')}</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	.tooltip {
		cursor: help;
		text-transform: uppercase;
	}
	.tooltip-content {
		z-index: 2;
		bottom: calc(100% + 2px);
		left: 0;
		width: 180px;
		max-height: 300px;
		overflow: auto;
		display: block;
	}
	.tooltip-content.right {
		left: auto;
		right: 0;
		bottom: calc(100% + 5px);
	}
	.text-nowrap {
		white-space: nowrap;
	}
</style>
