<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';

	import Portal from 'svelte-portal';
	import { onMount } from 'svelte';
	import PcBasicInfoDetail from '../device/PcBasicInfoDetail.svelte';
	import PcGradeDeviceDetail from '../device/PcGradeDeviceDetail.svelte';
	import { auth, infoImei } from '../../stores';
	import config from '../../config.js';
	import { isObjectEmpty } from '../../functions';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalUserAgreement from '../modal/PcModalUserAgreement.svelte';

	let visible = false;
	let isOpenUserAgreement = false;

	export let handleGotoEdit;
	export let handleDelete;

	onMount(() => {
		visible = true;
	});
	const handlePostDevice = () => {
		isOpenUserAgreement = true;
	};
</script>

<style>
	.mw150 {
		min-width: 150px;
	}
	summary:focus {
		outline: none;
	}
	.btn-skip {
		width: 170px;
		border-top-right-radius: 5px;
	}
</style>

{#if isOpenUserAgreement}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal
			type="modal"
			onClick={() => {
				isOpenUserAgreement = false;
			}} />
		<PcModalUserAgreement
			item={$infoImei}
			onClose={() => {
				isOpenUserAgreement = false;
			}} />
	</Portal>
{/if}
{#if visible}
	<div
		class="h-60-px white bg-dark-blue mt5 b--light-gray br--top br2 flex
			items-center justify-between f4 fw6 pl4">
		{$_('device.basicInfo')}
		{#if $infoImei.status === config.device.created}
			<button
				on:click={handlePostDevice}
				class="btn-skip link fw6 h-60-px ba white bg-blue b--blue">{$_('device.postDevice')}</button>
		{:else if $infoImei.status == config.device.inTransaction}
			{#if $infoImei.charge_stripe == null && $infoImei.transaction_type != config.buyer}
				{#if $infoImei.transaction_email_buyer != $auth.email}
					<button
						on:click={() => goto(`/my-sales/${$infoImei.order_seller_id}`)}
						class="btn-skip link fw6 h-60-px ba white bg-blue b--blue pointer">{$_('order.viewSale')}</button>
				{:else}
					<button
						on:click={() => goto(`/my-purchases/${$infoImei.order_id}`)}
						class="btn-skip link fw6 h-60-px ba white bg-blue b--blue pointer">{$_('order.viewOrder')}</button>
				{/if}
			{/if}
		{/if}
	</div>
	<div
		class="w-100 b--light-gray br2 br--bottom ba flex flex-column items-center">
		<div class="w-70">
			<PcBasicInfoDetail />
			<div id="physicalGrading">
				<h3 class="tc mv5 ttc">{$_('device.physicalGrading')}</h3>
				<PcGradeDeviceDetail />
			</div>
			{#if $infoImei}
				{#if $infoImei.other_detail}
					{#if !isObjectEmpty($infoImei.other_detail)}
						<details class="more-infomation mt5">
							<summary class="link tc light-blue u pointer fw6 mb3 mb5">
								{$_('device.moreInfo')}
							</summary>
							<div class="content-info flex justify-center">
								<div class="ba b--light-gray">
									{#each Object.entries($infoImei.other_detail) as [key, value], i}
										<div class="flex" class:bg-light-gray={i % 2 === 0}>
											<span class="pa3 b--light-gray fw6 mw150 br">{key}</span>
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
				<div class="flex justify-end mt4 mb5">
					<button
						type="button"
						on:click={handleGotoEdit}
						class="br2 bg-yellow b--yellow ba grow ttu h-50-px fw6 w-30 tracked
						mr3 near-black">
						{$_('device.editDevice')}
					</button>
					<button
						type="button"
						on:click={handleDelete}
						class="br2 bg-red b--red ba grow ttu h-50-px fw6 w-30 tracked ml3
						white">
						{$_('device.removeDevice')}
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
