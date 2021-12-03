<script>
	import { _ } from 'svelte-i18n';

	export let step = 0;
	export let isChecked = false;
	export let progressStep = 1;
	import PcButtonNext from '../button/PcButtonNext.svelte';
	import PcButtonPrev from '../button/PcButtonPrev.svelte';

	let agree = false;

	const nextProgressStep = () => {
		progressStep++;
		agree = false;
	};
	const prevProgressStep = () => {
		progressStep--;
		agree = false;
	};

	const handleNext = () => {
		step++;
		isChecked = false;
	};
</script>

<h4>{$_('label.logoutIcloud')}</h4>
<div class="progress-wrapper mb5">
	<div class="progress-info" />
	<div class="progress">
		<div class="progress-bar" style="width: {(progressStep * 100) / 5}%" />
	</div>
</div>
{#if progressStep === 1}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/logout_icloud_1.jpg"
				alt="logout_icloud_1"
				class="image"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">Go to <b>settings</b></div>
			<div class="mt3">
				<label class="checkbox-default">
					<input type="checkbox" bind:checked={agree} />
					<span />
					<span class="ml3 b dark-blue">{$_('label.done')} ?</span>
				</label>

				<img
					src="images/hand_guide1.png"
					alt="hand_guide1"
					class="arrow-guide shake animated infinite slower ml4"
				/>
			</div>
			<div class="flex mt5">
				<div class="w40px mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					disabled={!agree}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
		</div>
	</div>
{/if}
{#if progressStep === 2}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/logout_icloud_2.jpg"
				alt="logout_icloud_2"
				class="image"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">Tap <b>[ your name ]</b></div>
			<div class="mt3 light-silver i">Example: Mark Jansen</div>
			<div class="mt3">
				<label class="checkbox-default">
					<input type="checkbox" bind:checked={agree} />
					<span />
					<span class="ml3 b dark-blue">{$_('label.done')} ?</span>
				</label>

				<img
					src="images/hand_guide1.png"
					alt="hand_guide1"
					class="arrow-guide shake animated infinite slower ml4"
				/>
			</div>
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					disabled={!agree}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
		</div>
	</div>
{/if}
{#if progressStep === 3}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/logout_icloud_3.jpg"
				alt="logout_icloud_3"
				class="image"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">Scroll down and tap <b>Sign Out</b></div>
			<div class="mt3">
				<label class="checkbox-default">
					<input type="checkbox" bind:checked={agree} />
					<span />
					<span class="ml3 b dark-blue">{$_('label.done')} ?</span>
				</label>

				<img
					src="images/hand_guide1.png"
					alt="hand_guide1"
					class="arrow-guide shake animated infinite slower ml4"
				/>
			</div>
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					disabled={!agree}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
		</div>
	</div>
{/if}
{#if progressStep === 4}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/logout_icloud_4.jpg"
				alt="logout_icloud_4"
				class="image"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">Tap <b>Sign Out of iCloud</b></div>
			<div class="mt3">
				<label class="checkbox-default">
					<input type="checkbox" bind:checked={agree} />
					<span />
					<span class="ml3 b dark-blue">{$_('label.done')} ?</span>
				</label>

				<img
					src="images/hand_guide1.png"
					alt="hand_guide1"
					class="arrow-guide shake animated infinite slower ml4"
				/>
			</div>
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					disabled={!agree}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
		</div>
	</div>
{/if}

{#if progressStep === 5}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/logout_icloud_5.jpg"
				alt="logout_icloud_5"
				class="image"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">
				Enter your Apple ID password and tap <b>Turn Off</b>.
			</div>
			<ul class="mt3 ul">
				<li>
					Turn on the data that you want to keep a copy of on your device.
				</li>
				<li>Tap <b>Sign Out</b>.</li>
				<li>
					Tap <b>Sign Out</b> again to confirm that you want to <b>sign out</b> of
					iCloud.
				</li>
			</ul>
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
			</div>
			<div class="mt6 relative">
				<label class="checkbox-default" style="align-items: flex-start">
					<input type="checkbox" bind:checked={isChecked} />
					<span />
					<span class="ml3 fw6"
						>{$_('label.confirmNextStepScanTransaction')}</span
					>
				</label>
				<img
					src="images/hand_guide.png"
					alt="hand_guide"
					class="arrow-guide1 bounce animated infinite slower"
				/>
			</div>
		</div>
	</div>
{/if}

<div class="flex justify-between flex-gap1rem mt4">
	<button
		type="button"
		on:click={() => step--}
		class="btn--cancel bn br2 bg-light-gray pv3 ph5 near-black pointer grow ttc fw6 mr3"
		>{$_('device.back')}</button
	>
	{#if progressStep === 5}
		<button
			type="button"
			disabled={!isChecked}
			on:click={handleNext}
			class="btn--primary bn br2 bg-dark-blue pv3 ph5 white pointer grow ttc fw6"
			>Complete logout iCloud
		</button>
	{/if}
</div>

<style>
	.image {
		display: block;
		width: 200px;
		height: intrinsic;
	}

	.w40px {
		width: 40px;
	}
	.arrow-guide {
		width: 30px;
	}
	.arrow-guide1 {
		position: absolute;
		bottom: 100%;
		left: 30%;
		width: 50px;
	}
</style>
