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

<style>
	.tooltip {
		cursor: help;
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

{#if status === config.order.created}
	<div class="relative dib ">
		<span
			class="tooltip fw7 f7 pv1 ph2 br1 blue bg-blue-20 text-nowrap"
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}>{$_('label.created')}
			<sup>&#9432;</sup></span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipStatusAdded')}</p>
			</div>
		{/if}
	</div>
{:else if status === config.order.group}
	<div class="relative dib">
		<span
			on:mouseenter={handleTooltipOpen}
			on:mouseleave={handleTooltipClose}
			class="tooltip fw7 f7 pv1 ph4 br2 dark-blue bg-dark-blue-20 text-nowrap">{$_('label.group')}
			<sup>&#9432;</sup></span>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa3 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<p>{$_('message.tooltipStatusinTransaction')}</p>
			</div>
		{/if}
	</div>
{/if}
