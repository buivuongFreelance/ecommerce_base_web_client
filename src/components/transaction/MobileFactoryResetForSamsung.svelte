<script>
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	import PcButtonNext from '../button/PcButtonNext.svelte';
	import PcButtonPrev from '../button/PcButtonPrev.svelte';

	export let progressStep = 1;
	export let handleSkip;

	let agree = false;

	onMount(() => {});
	onDestroy(() => {});

	const nextProgressStep = () => {
		progressStep++;
		agree = false;
	};
	const prevProgressStep = () => {
		progressStep--;
		agree = false;
	};
</script>

<div class="custom">
	<h4 class="mb3">{$_('label.titleFRSS')}</h4>
	<div class="mb4">
		Please read carefully and complete the following steps. You have to complete
		all the slides to go to the next step (Download App).
	</div>

	<div class="h-30-px">
		{#if progressStep < 7}
			<div
				class="tr fw6 f5 blue link i mb3 pointer dim"
				on:click={() => handleSkip(7)}
			>
				Skip
			</div>
		{/if}
	</div>

	<div class="progress-wrapper mb2rem">
		<div class="progress-info" />
		<div class="progress">
			<div class="progress-bar" style="width: {(progressStep * 100) / 7}%" />
		</div>
	</div>

	{#if progressStep === 1}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img src="images/FR_SS_1.png" alt="FR_SS_1" class="image pointer" />
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Go to
						<b class="blue pointer dim"> Settings </b>.
					</div>
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
		</div>
	{/if}
	{#if progressStep === 2}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img src="images/FR_SS_2.png" alt="FR_SS_2" class="image pointer" />
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap <b class="blue pointer dim" on:click={() => progressStep++}
							>General Management</b
						>.
					</div>
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
		</div>
	{/if}
	{#if progressStep === 3}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img src="images/FR_SS_3.png" alt="FR_SS_3" class="image pointer " />
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap on
						<b class="blue pointer dim"> Reset </b>.
					</div>
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
		</div>
	{/if}
	{#if progressStep === 4}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img src="images/FR_SS_4.png" alt="FR_SS_4" class="image pointer" />
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap <b class="blue pointer dim">Factory data reset</b>. You should
						then see a long list of accounts, apps, etc. which will be erased
						from your phone.
					</div>
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
		</div>
	{/if}
	{#if progressStep === 5}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img src="images/FR_SS_5.png" alt="FR_SS_5" class="image pointer" />
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						If you've made up your mind, scroll to the bottom, and tap
						<b class="blue pointer dim"> Reset </b>.
					</div>
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
		</div>
	{/if}
	{#if progressStep === 6}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img src="images/FR_SS_6.png" alt="FR_SS_6" class="image pointer" />
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap
						<b class="blue pointer dim"> Delete all </b>.
					</div>
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
		</div>
	{/if}
	{#if progressStep === 7}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img src="images/FR_SS_7.png" alt="FR_SS_7" class="image" />
				</div>
				<div class="w-60 pl2rem">
					<p>
						You might be also asked to login to a Samsung Account in case you
						have one before resetting the phone. If yes, make sure you know your
						Samsung Account password before you proceed.
					</p>
					<p class="mt3">
						In case you have forgotten the password, you can tap the 'Forgot my
						password' option and follow the on-screen steps.
					</p>
					<div class="mt5">
						<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.image {
		display: block;
		height: intrinsic;
	}
	.w40px {
		width: 40px;
	}
	.arrow-guide {
		width: 30px;
	}
</style>
