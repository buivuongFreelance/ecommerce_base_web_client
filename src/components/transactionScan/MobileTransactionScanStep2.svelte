<script>
	import { _ } from 'svelte-i18n';
	import ContentLoader from 'svelte-content-loader';
	import MobileLogoutIcloud from './MobileLogoutIcloud.svelte';

	export let step = 0;

	export let isChecked = false;

	export let downloadQrCodeLink = '';
	export let isLoading = false;

	export let deviceBrand = '';

	let step2 = 1;

	const handleNext = () => {
		if (deviceBrand === 'Apple') {
			step2++;
			isChecked = false;
		} else {
			step++;
			isChecked = false;
		}
	};
</script>

<div class="custom">
	{#if step2 === 1}
		<div class="tc relative w-60 center">
			<img
				src="images/phone_scan_qr_code.png"
				alt="phone_scan_qr_code"
				class="w-100"
			/>

			<div class="image-scan flex items-center justify-center">
				{#if isLoading}
					<ContentLoader width="140" uniqueKey="scanYourDevice">
						<rect x="0" y="0" rx="5" ry="5" width="140" height="140" />
					</ContentLoader>
				{:else if downloadQrCodeLink}
					<div class="">
						<div class="mb3 f7 bounce animated infinite">
							{$_('label.scanToDownload')}
						</div>
						<img src={downloadQrCodeLink} alt="" width="140px" />
					</div>
				{/if}
			</div>
		</div>
		<div class="mt2rem">
			<h4>{$_('label.downloadAppForScan')}</h4>
			<div class="mt5">
				{$_('label.downloadAppForScanDesc')}
			</div>
			<div class="mt5 flex flex-gap1rem">
				{#if deviceBrand === 'Apple'}
					<a
						class="pointer dim"
						href="https://apps.apple.com/ca/app/id1524735381"
						><img src="images/apple.png" alt="apple" class="h-50-px" /></a
					>
				{:else if deviceBrand === 'Samsung'}
					<a
						class="pointer dim"
						href="https://play.google.com/store/apps/details?id=com.dingtoi.dingtoimc"
						><img src="images/android.png" alt="android" class="h-50-px" /></a
					>
				{/if}
			</div>
			<div class="mt6 relative">
				<label class="checkbox-default" style="align-items: flex-start">
					<input type="checkbox" bind:checked={isChecked} />
					<span />
					<span class="fw6 ml3"
						>{$_('label.confirmNextStepScanTransaction')}</span
					>
				</label>
				<img
					src="images/hand_guide.png"
					alt="hand_guide"
					class="arrow-guide bounce animated infinite slower"
				/>
			</div>
			<div class="mt1rem">
				<button
					type="button"
					disabled={!isChecked}
					on:click={handleNext}
					class="btn--primary bn br2 bg-dark-blue h-40-px ph5 w-100 white pointer grow ttc fw6"
					>Complete download app
				</button>
				<button
					type="button"
					on:click={() => step--}
					class="mt1rem btn--cancel bn br2 bg-light-gray h-40-px ph5 w-100 near-black pointer grow ttc fw6 mr3"
				>
					{$_('transaction.backToFactoryReset')}
				</button>
			</div>
		</div>
	{:else if step2 === 2}
		<MobileLogoutIcloud bind:step {isChecked} />
	{/if}
</div>

<style>
	.btn--primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.image-scan {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: auto;
	}
	.arrow-guide {
		position: absolute;
		bottom: 100%;
		left: 0;
		width: 30px;
	}
</style>
