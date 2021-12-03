<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import MobileBasicInfoDetail from '../device/MobileBasicInfoDetail.svelte';
	import MobileGradeDeviceDetail from '../device/MobileGradeDeviceDetail.svelte';
	import { auth, infoImei } from '../../stores';
	import config from '../../config.js';
	import { isObjectEmpty } from '../../functions';
	import { goto } from '@sapper/app';

	let visible = false;
	export let handleGotoEdit;
	export let handleDelete;

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
	<div class="tc mt2rem">
		{#if $infoImei.status === config.device.created}
			<button
				on:click={goto('my-devices/post-device/' + $infoImei.id)}
				class="btn-skip link fw6 h-40-px ba white bg-blue b--blue"
				>{$_('device.postDevice')}</button
			>
		{:else if $infoImei.status == config.device.inTransaction}
			{#if $infoImei.charge_stripe == null && $infoImei.transaction_type != config.buyer}
				{#if $infoImei.transaction_email_buyer != $auth.email}
					<button
						on:click={() => goto(`/my-sales/${$infoImei.order_seller_id}`)}
						class="btn-skip link fw6 h-40-px ba white bg-blue b--blue"
						>{$_('order.viewSale')}</button
					>
				{:else}
					<button
						on:click={() => goto(`/my-purchases/${$infoImei.order_id}`)}
						class="btn-skip link fw6 h-40-px ba white bg-blue b--blue"
						>{$_('order.viewOrder')}</button
					>
				{/if}
			{/if}
		{/if}
	</div>
	<div class="">
		<MobileBasicInfoDetail />
		<div id="physicalGrading" class="mt2rem ">
			<h4 class="tc ttc mb1rem">{$_('device.physicalGrading')}</h4>
			<MobileGradeDeviceDetail />
		</div>
		{#if $infoImei}
			{#if $infoImei.other_detail}
				{#if !isObjectEmpty($infoImei.other_detail)}
					<details class="more-infomation mt3">
						<summary class="link tc light-blue u pointer fw6 mb3">
							{$_('device.moreInfo')}
						</summary>
						<div class="content-info flex justify-center">
							<div class="ba b--light-gray">
								{#each Object.entries($infoImei.other_detail) as [key, value], i}
									<div class="flex" class:bg-light-gray={i % 2 === 0}>
										<span class="pa3 b--light-gray fw6 mw130 br">{key}</span>
										<span class="pa3 b--light-gray flex-auto">{value}</span>
									</div>
								{/each}
							</div>
						</div>
					</details>
				{/if}
			{/if}
		{/if}
		{#if $infoImei.status !== config.device.inTransaction}
			<div class="w-100 flex justify-between mt4 mb5">
				<button
					type="button"
					on:click={handleGotoEdit}
					class="br2 bg-yellow b--yellow ba grow ttu h-40-px fw6 w-100 tracked mr3
					near-black"
				>
					{$_('device.editDevice')}
				</button>
				<button
					type="button"
					on:click={handleDelete}
					class="br2 bg-red b--red ba grow ttu h-40-px fw6 w-100 tracked white"
				>
					{$_('device.removeDevice')}
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.mw130 {
		min-width: 130px;
	}
	summary:focus {
		outline: none;
	}
	.btn-skip {
		width: 120px;
		border-top-right-radius: 5px;
	}
</style>
