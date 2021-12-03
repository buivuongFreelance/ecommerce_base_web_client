<script>
	import { _ } from 'svelte-i18n';
	import * as animateScroll from 'svelte-scrollto';
	import PcButtonNext from '../button/PcButtonNext.svelte';
	import PcButtonPrev from '../button/PcButtonPrev.svelte';
	import {
		scanTransactionTimeout,
		settings,
		scanTransactionStep,
		auth,
	} from '../../stores';
	import { differenceInSeconds, format, parseISO } from 'date-fns';
	import { tweened } from 'svelte/motion';
	import { msToSeconds } from '../../functions';
	import config from '../../config';
	import { onDestroy, onMount } from 'svelte';
	import PcTransactionScanText from './PcTransactionScanText.svelte';

	export let step = 0;
	export let isChecked = false;
	export let progressStep = 1;

	let agree = false;
	let timer = null;
	let intervalTimer = null;
	let remainingAcceptTimeout = 0;
	let mounted = false;

	$: hours =
		Math.floor($timer / 3600) < 10
			? '0' + Math.floor($timer / 3600)
			: Math.floor($timer / 3600);
	$: minutes =
		Math.floor(Math.floor($timer - hours * 3600) / 60) < 10
			? '0' + Math.floor(Math.floor($timer - hours * 3600) / 60)
			: Math.floor(Math.floor($timer - hours * 3600) / 60);
	$: minname = minutes > 1 ? $_('message.minutes') : $_('message.minute');
	$: seconds =
		Math.floor($timer - (hours * 3600 + minutes * 60)) < 10
			? '0' + Math.floor($timer - (hours * 3600 + minutes * 60))
			: Math.floor($timer - (hours * 3600 + minutes * 60));

	const unsubscribeScanTransactionChanged = scanTransactionStep.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					if (value > 1) {
						countdown();
					}
				}
			}
		}
	);
	onMount(() => {
		mounted = true;
		if ($scanTransactionTimeout) {
			countdown();
		}
		animateScroll.scrollToTop();
	});
	onDestroy(() => {
		unsubscribeScanTransactionChanged();
		if (intervalTimer) {
			clearInterval(intervalTimer);
		}
	});
	const setTimer = () => {
		if ($timer === 0) {
			if (intervalTimer) {
				clearInterval(intervalTimer);
				timer = null;
				remainingAcceptTimeout = 0;
			}
		} else {
			if ($timer > 0) $timer--;
		}
	};

	const countdown = () => {
		setTimeout(() => {
			const result = Math.abs(
				differenceInSeconds(parseISO($scanTransactionTimeout), new Date())
			);
			const timeAccept = msToSeconds(Number($settings[config.timer]) * 60000);
			if (result < timeAccept) {
				remainingAcceptTimeout = timeAccept - parseFloat(result);
				timer = tweened(remainingAcceptTimeout);
				intervalTimer = setInterval(setTimer, 1000);
			} else {
				remainingAcceptTimeout = 0;
			}
		}, 500);
	};

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

<div class="flex justify-between items-center">
	<div class="b f4 ttc mb3">Confirm scan</div>
	{#if $scanTransactionTimeout}
		<div class="flex items-center">
			<small class="light-silver mr1"> Remaining time</small>
			<div class="red b f4 fadeInDown animated infinite ">
				{hours} : {minutes} : {seconds}
			</div>
		</div>
	{/if}
</div>
<div class="progress-wrapper mb5">
	<div class="progress-info" />
	<div class="progress">
		<div class="progress-bar" style="width: {(progressStep * 100) / 14}%" />
	</div>
</div>
{#if progressStep === 1}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_1.jpg"
				alt="confirm_scan_1"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">
				Tap
				<b class="pointer dim">Sign in.</b>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<div class="w40px mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
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
				src="images/confirm_scan_2.jpg"
				alt="confirm_scan_2"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">
				<p>Enter <b>Email</b> and <b>password</b>.</p>
				<p>
					Email:
					<span class="fw6">{$auth.email}</span>
				</p>
				<p>
					Tap
					<b class="pointer dim">Sign in</b>
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
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
				src="images/confirm_scan_3.jpg"
				alt="confirm_scan_3"
				class="image pointer"
				on:click={() => progressStep++}
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">transaction scan</b>
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<!-- <PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/> -->
			</div>
		</div>
	</div>
{/if}
{#if progressStep === 4}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_4.jpg"
				alt="confirm_scan_4"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<p class="mb3">You have been given 15 minutes to complete the scan.</p>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">Next </b>
					button.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
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
				src="images/confirm_scan_5.jpg"
				alt="confirm_scan_5"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">start </b>
					button.
				</p>
			</div>

			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
		</div>
	</div>
{/if}
{#if progressStep === 6}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_6.jpg"
				alt="confirm_scan_6"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="f4">
				<p>
					The screen color will change from white to blue. Try to color the
					entire screen blue.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}
{#if progressStep === 7}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_7.jpg"
				alt="confirm_scan_6"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="mb3">Touchscreen verification.</div>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">Next</b>
					button.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}
{#if progressStep === 8}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_8.jpg"
				alt="confirm_scan_8"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="mb3">Check Voice and SMS functions.</div>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">Check</b>
					button.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}
{#if progressStep === 9}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_9.jpg"
				alt="confirm_scan_9"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="mb">Voice and SMS check results</div>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">Check blacklist</b>
					button.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}
{#if progressStep === 10}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_10.jpg"
				alt="confirm_scan_10"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="mb3">Confirm IMEI.</div>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">Confirm</b>
					button.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}
{#if progressStep === 11}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_11.jpg"
				alt="confirm_scan_11"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<p>
				Tap
				<b class="pointer dim">Skip</b>
				button.
			</p>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}
{#if progressStep === 12}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_12.jpg"
				alt="confirm_scan_12"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="mb3">
				Scan report. You can see the scan result: blacklist, touch screen,
				camera, flash,...
			</div>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim" on:click={() => progressStep++}
						>go to physical grading</b
					>.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}
{#if progressStep === 13}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_13.jpg"
				alt="confirm_scan_13"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="mb3">Physical grading.</div>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">go to summary report</b>.
				</p>
			</div>
			<!-- <div class="mt3">
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
			</div> -->
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
				<PcButtonNext
					onClickButton={nextProgressStep}
					bg="bg-dark-blue"
					color="white"
				/>
			</div>
			<PcTransactionScanText />
		</div>
	</div>
{/if}

{#if progressStep === 14}
	<div class="flex items-center">
		<div class="w-40 flex justify-end">
			<img
				src="images/confirm_scan_14.jpg"
				alt="confirm_scan_14"
				class="image pointer"
			/>
		</div>
		<div class="w-60 pl6">
			<div class="mb3">Summary report.</div>
			<div class="f4">
				<p>
					Tap
					<b class="pointer dim">confirm</b>.
				</p>
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
			<div class="flex mt5">
				<PcButtonPrev onClickButton={prevProgressStep} className="mr3" />
			</div>
		</div>
	</div>
{/if}

<div class="flex justify-center mt5">
	<button
		type="button"
		on:click={() => step--}
		class="btn--cancel bn br2 bg-light-gray pv3 ph5 near-black pointer grow ttc fw6 mr3"
	>
		{$_('device.back')}
	</button>
	{#if progressStep === 14}
		<button
			type="button"
			disabled={!isChecked}
			on:click={handleNext}
			class="btn--primary bn br2 bg-dark-blue pv3 ph5 white pointer grow ttc fw6"
		>
			{$_('message.complete')}
		</button>
	{/if}
</div>

<style>
	.image {
		display: block;
		width: 200px;
		height: intrinsic;
	}
	.btn--primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.arrow-guide1 {
		position: absolute;
		bottom: 100%;
		left: 30%;
		width: 50px;
	}
	.w40px {
		width: 40px;
	}
	/* .arrow-guide {
		width: 30px;
	} */
</style>
