<script>
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';

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
	<h4 class="mb3">{$_('label.FRIOSHeader')}</h4>
	<div class="mb4">
		Please read carefully and complete the following steps. You have to complete
		all the slides to go to the next step (Download App).
	</div>

	<div class="h-30-px">
		{#if progressStep < 11}
			<div
				class="tr fw6 f5 blue link i mb3 pointer dim"
				on:click={() => handleSkip(11)}
			>
				Skip
			</div>
		{/if}
	</div>

	<div class="progress-wrapper mb4">
		<div class="progress-info" />
		<div class="progress">
			<div class="progress-bar" style="width: {(progressStep * 100) / 11}%" />
		</div>
	</div>

	{#if progressStep === 1}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img
						src="images/FR_ios_step1_1.png"
						alt="FR_ios_step1_1"
						class="image pointer"
					/>
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
							disabled={!agree}
							onClickButton={nextProgressStep}
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
					<img
						src="images/FR_ios_step1_2.png"
						alt="FR_ios_step1_2"
						class="image pointer"
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap <b class="blue pointer dim">[Your Name]</b>.
					</div>
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
		</div>
	{/if}
	{#if progressStep === 3}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img
						src="images/FR_ios_step1_3.png"
						alt="FR_ios_step1_3"
						class="image pointer "
						on:click={() => progressStep++}
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap <b class="blue pointer dim">iCloud</b>.
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
					<img
						src="images/FR_ios_step1_4.png"
						alt="FR_ios_step1_4"
						class="image pointer"
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Scroll down and tap <b class="blue pointer dim">iCloud Backup</b>.
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
					<img
						src="images/FR_ios_step1_5.png"
						alt="FR_ios_step1_5"
						class="image pointer"
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Then toogle it <b>On</b> (if it isn't already) and tap
						<b class="blue pointer dim">Backup Up Now</b>.
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
					<img
						src="images/FR_ios_step1_6.png"
						alt="FR_ios_step1_6"
						class="image pointer"
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap the main Settings icon when viewing the home screen, select
						<b class="blue pointer dim">General</b>
						from the resulting menu
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
					<img
						src="images/FR_ios_step1_7.png"
						alt="FR_ios_step1_7"
						class="image pointer"
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap the <b class="blue pointer dim">Reset</b> button at the bottom of
						the page.
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
	{#if progressStep === 8}
		<div class="min-height-content ">
			<div class="flex">
				<div class="w-40">
					<img
						src="images/FR_ios_step1_8.png"
						alt="FR_ios_step1_8"
						class="image pointer"
					/>
				</div>
				<div class="flex-1 pl2rem">
					<div class="f5">
						Tap the blue <b class="blue pointer dim"
							>Erase All Content and Settings</b
						> option.
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
	{#if progressStep === 9}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img
						src="images/FR_ios_step1_9.png"
						alt="FR_ios_step1_9"
						class="image pointer"
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						<p class="mb3">
							If you haven’t backed up as we suggested, Tap <b
								class="blue pointer">Back Up Then Erase</b
							>
						</p>
						<p class="mb3">
							Else, tap <b class="blue pointer dim">Erase Now</b>
						</p>
						<p class="f5">You’ll then be prompted to enter your passcode.</p>
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
	{#if progressStep === 10}
		<div class="min-height-content">
			<div class="flex">
				<div class="w-40">
					<img
						src="images/FR_ios_step1_10.png"
						alt="FR_ios_step1_10"
						class="image pointer"
					/>
				</div>
				<div class="w-60 pl2rem">
					<div class="f5">
						Tap the red <b class="blue pointer dim">Erase iPhone</b> option in the
						resulting pop-up window to confirm your decision.
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
	{#if progressStep === 11}
		<div class="min-height-content">
			<h5>{$_('label.FRIOS4')}</h5>
			<div class="mt1rem">{$_('label.FRIOS4_1')}</div>
			<div class="mt1rem">{$_('label.FRIOS4_2')}</div>
			<div class="mt1rem">{$_('label.FRIOS4_3')}</div>
			<div class="mt1rem">
				<PcButtonPrev onClickButton={prevProgressStep} />
			</div>
		</div>
	{/if}
</div>

<style>
	.image {
		display: block;
		height: intrinsic;
	}
	.flex-1 {
		flex: 1;
	}
	.w40px {
		width: 40px;
	}
	.arrow-guide {
		width: 30px;
	}
</style>
