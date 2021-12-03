<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import * as animateScroll from 'svelte-scrollto';
	import ContentLoader from 'svelte-content-loader';
	import PcButtonNext from '../button/PcButtonNext.svelte';
	import PcButtonPrev from '../button/PcButtonPrev.svelte';

	export let scanDeviceQrCodeLink = '';
	export let isLoading = false;
	export let progressStep = 1;
	export let onClose;

	let isChecked = false;

	onMount(() => {
		animateScroll.scrollToTop();
	});
	const handleComplete = () => {
		onClose();
	};
</script>

<div class="custom">
	<h4 class="mb5 ttc">Scan device against</h4>

	<div class="progress-wrapper mb4">
		<div class="progress-info" />
		<div class="progress">
			<div class="progress-bar" style="width: {(progressStep * 100) / 20}%" />
		</div>
	</div>
	{#if progressStep === 1}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_1.jpg"
					alt="transaction_scan_1"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					Open the
					<b class="pointer dim" onclick={() => progressStep++}>
						Dingtoi Pro Phone Checker
					</b>
					App.
				</div>
				<div class="flex mt5">
					<div class="w40px mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
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
					src="images/transaction_scan_20.jpg"
					alt="transaction_scan_20"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					Tap
					<b class="pointer dim" on:click={() => progressStep++}
						>Sign in with exchanger</b
					>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
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
					src="images/transaction_scan_3.jpg"
					alt="transaction_scan_3"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					<p>Enter <b>Email</b> and <b>password</b>.</p>
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>Sign in</b>
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
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
					src="images/buyer_transaction_scan_4.jpg"
					alt="buyer_transaction_scan_4"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}
							>transaction scan</b
						>
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
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
					src="images/transaction_scan_5.jpg"
					alt="transaction_scan_5"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}
							>scan qr code
						</b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 6}
		<div class="flex items-center">
			<div class="w-40  flex justify-end">
				<div class="relative">
					<img
						src="images/phone_scan_qr_code.png"
						alt="phone_scan_qr_code"
						class="image"
					/>
					<div class="image-scan flex items-center justify-center">
						{#if isLoading}
							<ContentLoader width="140" uniqueKey="scanYourDevice">
								<rect x="0" y="0" rx="5" ry="5" width="140" height="140" />
							</ContentLoader>
						{:else if scanDeviceQrCodeLink}
							<div class="tc">
								<div class="mb3 f7 bounce animated infinite">Scan QR code.</div>
								<img src={scanDeviceQrCodeLink} alt="" width="140px" />
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					<p>Scan QR code.</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 7}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_7.jpg"
					alt="transaction_scan_7"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<p class="mb3">You have been given 15 minutes to complete the scan.</p>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>Next </b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 8}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_8.jpg"
					alt="transaction_scan_8"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<p class="mb3">Start general function.</p>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>start </b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 9}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_9.jpg"
					alt="transaction_scan_9"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					<p>
						The screen color will change from white to blue. Try to color the
						entire screen blue.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 10}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_10.jpg"
					alt="transaction_scan_10"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">Touchscreen verification.</div>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>Next</b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 11}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_11.jpg"
					alt="transaction_scan_11"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">Check Voice and SMS functions.</div>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>Check</b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 12}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_12.jpg"
					alt="transaction_scan_12"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb">Voice and SMS check results</div>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}
							>Check blacklist</b
						>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 13}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_13.jpg"
					alt="transaction_scan_13"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">Confirm IMEI.</div>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>Confirm</b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 14}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_14.jpg"
					alt="transaction_scan_14"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">
					By clicking Yes, you agree to cross check your IMEI against
					Blacklisted registry.
				</div>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>Yes</b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 15}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_15.jpg"
					alt="transaction_scan_15"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>Skip</b>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 16}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_16.jpg"
					alt="transaction_scan_16"
					class="image pointer"
					on:click={() => progressStep++}
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
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 17}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_17.jpg"
					alt="transaction_scan_17"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">Physical grading.</div>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}
							>go to summary report</b
						>.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 18}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_18.jpg"
					alt="transaction_scan_18"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">Summary report.</div>
				<div class="f4">
					<p>
						Tap
						<b class="pointer dim" on:click={() => progressStep++}>complete</b>.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 19}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_19.jpg"
					alt="transaction_scan_19"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">
					Input password to open your phone.
					<br />
					This password will be sent to Dingtoi's system.
				</div>
				<div class="f4">
					<p>
						Input <b>password</b>.
					</p>
					<p class="mb4">
						Or click <b>check</b>, if your phone doesn't have any password.
					</p>
					<p>
						Tap <b class="pointer dim" on:click={() => progressStep++}
							>send password</b
						>
						button.
					</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
					<PcButtonNext
						onClickButton={() => progressStep++}
						bg="bg-dark-blue"
						color="white"
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if progressStep === 20}
		<div class="flex items-center">
			<div class="w-40 flex justify-end">
				<img
					src="images/transaction_scan_20.jpg"
					alt="transaction_scan_20"
					class="image pointer"
					on:click={() => progressStep++}
				/>
			</div>
			<div class="w-60 pl6">
				<div class="mb3">Finish.</div>
				<div class="f4">
					<p>Tap <b>sign in with exchanger</b> button.</p>
				</div>
				<div class="flex mt5">
					<PcButtonPrev onClickButton={() => progressStep--} className="mr3" />
				</div>
			</div>
		</div>
	{/if}

	{#if progressStep === 20}
		<div class="mt5 relative">
			<label class="checkbox-default">
				<input type="checkbox" bind:checked={isChecked} />
				<span />
				<span class="ml3 fw6">{$_('label.confirmNextStepScanTransaction')}</span
				>
			</label>
			<img
				src="images/hand_guide.png"
				alt="hand_guide"
				class="arrow-guide bounce animated infinite slower"
			/>
		</div>
		<div class="flex justify-between mt5">
			<button
				type="button"
				disabled={!isChecked}
				on:click={handleComplete}
				class="btn--primary bn br2 bg-dark-blue pv3 ph5 white pointer grow ttc fw6"
				>{$_('message.complete')}
			</button>
		</div>
	{/if}
</div>

<style>
	.image {
		display: block;
		width: 200px;
		height: intrinsic;
	}
	.image-scan {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: auto;
	}
	.btn--primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.arrow-guide {
		position: absolute;
		bottom: 100%;
		left: 0;
		width: 50px;
	}
	.w40px {
		width: 40px;
	}
</style>
