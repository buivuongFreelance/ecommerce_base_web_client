<script>
	import { _ } from 'svelte-i18n';
	export let grade = 'D';
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
	.tooltip-content {
		z-index: 2;
		bottom: calc(100% + 5px);
		left: 0;
		width: 200px;
		max-height: 300px;
		overflow: auto;
		display: block;
	}
	.tooltip-content.right {
		left: auto;
		right: 0;
		bottom: calc(100% + 5px);
	}
</style>

<b class="grade dark-blue relative">
	{$_('deviceDetail.grade')}
	{grade}
	<span
		class="tooltip "
		on:mouseenter={handleTooltipOpen}
		on:mouseleave={handleTooltipClose}>
		<sup class="cursor-help">
			<svg fill="#2F3A97" height="15" width="15" viewBox="0 0 24 24"><path
					d="M0 0h24v24H0z"
					fill="none" />
				<path
					d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" /></svg>
		</sup>
		{#if isOpenTooltip}
			<div
				class="tooltip-content absolute ma0 pa4 bg-black white br2 shadow-1 f6 fw4 near-black tl"
				class:right={right === true}>
				<dl>
					<dt class="b">{$_('label.gradeA')}:</dt>
					<dd class="mb3 i">{$_('label.gradeADesc')}</dd>
					<dt class="b">{$_('label.gradeB')}:</dt>
					<dd class="mb3 i">{$_('label.gradeBDesc')}</dd>
					<dt class="b">{$_('label.gradeC')}:</dt>
					<dd class="mb3 i">{$_('label.gradeCDesc')}</dd>
					<dt class="b">{$_('label.gradeD')}:</dt>
					<dd class="i">{$_('label.gradeDDesc')}</dd>
				</dl>
			</div>
		{/if}
	</span>
</b>
