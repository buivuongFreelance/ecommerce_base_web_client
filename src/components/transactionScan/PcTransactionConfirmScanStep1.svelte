<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import IconKey from '../icon/IconKey.svelte';
	import IconVisibility from '../icon/IconVisibility.svelte';
	import IconVisibilityOff from '../icon/IconVisibilityOff.svelte';

	export let step = 0;
	export let isChecked = false;
	export let passcode = '';

	let isShowPass = false;

	const handleNext = () => {
		step++;
		isChecked = false;
	};
	onMount(() => {});
</script>

<div class="custom">
	<div class="pa5">
		<div class="">
			<div class="tc">
				<IconKey fill="#B5B5C3" size="80" />
			</div>
			<div class="">
				<div class="f3 b tc">Passcode</div>
				<div class="tc light-silver i">
					This passcode to open your phone. Click to icon eye to show/hide the
					passcode.
				</div>
				<div class="passcode-container flex justify-center items-center">
					<ul class="passcode f4">
						{#if isShowPass}
							{#if passcode}
								{#each passcode.toString().split('') as p}
									<li>{p}</li>
								{/each}
							{:else}
								<li />
								<li />
								<li />
								<li />
							{/if}
						{:else}
							<li>✳</li>
							<li>✳</li>
							<li>✳</li>
							<li>✳</li>
						{/if}
					</ul>
					<span
						class="btn-only-icon h-40-px lh-40-px tc pointer grow flex items-center justify-center pointer ml3 bg-blue white br2"
						on:click={() => (isShowPass = !isShowPass)}
					>
						{#if isShowPass}
							<IconVisibility fill="#fff" size="20" />
						{:else}
							<IconVisibilityOff fill="#fff" size="20" />
						{/if}
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="mt5 flex flex-column justify-center">
		<div class="relative tc">
			<label class="checkbox-default" style="align-items: flex-start">
				<input type="checkbox" bind:checked={isChecked} />
				<span />
				<span class="fw6 ml3">{$_('label.confirmNextStepScanTransaction')}</span
				>
			</label>
			<img
				src="images/hand_guide.png"
				alt="hand_guide"
				class="arrow-guide bounce animated infinite slower"
			/>
		</div>
	</div>
	<div class="flex justify-center mt5">
		<button
			type="button"
			disabled={!isChecked}
			on:click={handleNext}
			class="btn--primary bn br2 bg-dark-blue pv3 ph5 white pointer grow ttc fw6"
			>{$_('message.next')}
		</button>
	</div>
</div>

<style>
	.btn--primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.arrow-guide {
		position: absolute;
		bottom: 100%;
		left: calc(50% - 25px);
		width: 50px;
	}

	.passcode-container {
		width: min(100%, 400px);
		margin: 30px auto 0;
		/* border-radius: 25px; */
		/* height: 50px; */
		/* box-shadow: 0 0 10px rgba(0, 0, 0, 0.16); */
		/* padding: 0 30px; */
		/* line-height: 1; */
	}
	.btn-only-icon {
		width: 40px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
	}
	.passcode {
		display: flex;
		gap: 10px;
	}
	.passcode li {
		display: block;
		text-align: center;
		width: 40px;
		height: 40px;
		line-height: 40px;
		border-radius: 4px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
		background-color: white;
	}
</style>
