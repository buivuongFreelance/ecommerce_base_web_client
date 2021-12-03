<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	export let status;
	export let className = '';

	export let right = false;

	let isOpenTooltip = false;

	const handleTooltipOpen = () => {
		if (!isOpenTooltip) isOpenTooltip = true;
	};
	const handleTooltipClose = () => {
		if (isOpenTooltip) isOpenTooltip = false;
	};
</script>

<style>
	.tooltip {
		display: inline-block;
		cursor: help;
		border-radius: 2px;
		font-weight: 400;
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

{#if status === config.device.created}
	<div class="relative dib {className} ">
		<span
			class="tooltip ttu f7 ttu pv1 ph3 light-blue ba b--light-blue text-nowrap"
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}>{$_('message.added')}
			<sup>&#9432;</sup></span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipStatusAdded')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.device.waitingForScan}
	<div class="relative dib {className}">
		<span
			class="tooltip ttu f7 pv1 ph2 br2 yellow ba b--bg-yellow text-nowrap"
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}>{$_('message.waitingForScan')}
			<sup>&#9432;</sup></span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipStatusWaitingForScan')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.device.waitingForApproval}
	<div class="relative dib {className}">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu fw7 f7 pv1 ph2 br2 yellow ba b--bg-yellow text-nowrap">{$_('message.waitingForApproval')}
			<sup>&#9432;</sup></span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipStatusWaitingForApproval')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.device.posted}
	<div class="relative dib {className}">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 ttu pv1 ph3 light-blue ba b--light-blue text-nowrap">
			{$_('message.posted')}
			<sup>&#9432;</sup>
		</span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipStatusPosted')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.device.inTransaction}
	<div class="relative dib {className}">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 ttu pv1 ph3 light-blue ba b--light-blue text-nowrap">
			{$_('message.inTransaction')}
			<sup>&#9432;</sup>
		</span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipStatusinTransaction')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.waitingForOwnerPayment}
	<div class="relative dib {className}">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 ttu pv1 ph3 red ba b--light-red text-nowrap">
			{$_('message.sellerNotPaidYet')}
			<sup>&#9432;</sup>
		</span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipOrderWaitingPayOwner')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.waitingForDevicePayment}
	<div class="relative dib {className}">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 ttu pv1 ph3 red ba b--light-red text-nowrap">
			{$_('message.youNotPaidYet')}
			<sup>&#9432;</sup>
		</span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipOrderWaitingPay')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.processTransaction}
	<div class="relative dib {className}">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip ttu f7 ttu pv1 ph3 light-blue ba b--light-blue text-nowrap">
			{$_('message.processingTrans')}
			<sup>&#9432;</sup>
		</span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipProcessTransaction')}</p>
			</div>
		{/if}
	</div>
{/if}
