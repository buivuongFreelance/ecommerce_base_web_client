<script>
	import { _ } from 'svelte-i18n';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcDatepicker from '../form/PcDatepicker.svelte';
	import { auth } from '../../stores';

	export let values = {};

	export let submitAccount;
	export let isLoading = false;

	const handleSubmit = async () => {
		submitAccount();
	};
</script>

<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
	<div class="flex mb4 pb4 bb b--light-gray">
		<div class="avatar flex items-center">
			<picture
				class="avatar-image w-80-px h-80-px bg-light-gray mr4 flex items-center justify-center"
			>
				<svg fill="#7E8299" height="40" viewBox="0 0 24 24" width="40"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
					/>
				</svg>
			</picture>
			<div class="avatar-content flex-auto">
				<h4 class="">{values.firstName || ''} {values.lastName || ''}</h4>
				{#if $auth}
					<div class="i link fw6 dark-blue mt1">{$auth.email}</div>
				{/if}
			</div>
		</div>
	</div>
	<h4 class="fw6 mb4">{$_('label.generalInformation')}</h4>

	<div class="mb4">
		<div class="form-group">
			<div class="label light-silver fw6 lh-50-px">
				<span>{$_('label.idNumber')}</span>
			</div>
			<div class="input">
				<input
					type="text"
					class="form-control w-100 ba b--light-gray br1 h-50-px ph3"
					bind:value={values.idNumber}
					placeholder={$_('label.idNumber')}
				/>
			</div>
		</div>
	</div>
	<div class="mb4">
		<div class="form-group">
			<div class="label light-silver fw6 lh-50-px">
				<span>{$_('label.dob')}</span>
			</div>
			{#if values.dob}
				<PcDatepicker bind:bindValue={values.dob} />
			{:else}
				<PcDatepicker bind:bindValue={values.dob} />
			{/if}
		</div>
	</div>
	<div class="mb5 pb4 bb b--light-gray">
		<div class="label light-silver fw6 lh-50-px">
			<span>{$_('label.gender')}</span>
		</div>
		<div class="flex">
			<div class="flex-auto flex items-center mr3">
				<label class="radio">
					<input
						type="radio"
						name="gender"
						bind:group={values.gender}
						value="male"
					/>
					<span class="box" />
					<span class="ml3">{$_('label.male')}</span>
				</label>
			</div>
			<div class="flex-auto flex items-center mr3">
				<label class="radio">
					<input
						type="radio"
						name="gender"
						bind:group={values.gender}
						value="female"
					/>
					<span class="box" />
					<span class="ml3">{$_('label.female')}</span>
				</label>
			</div>
			<div class="flex-auto flex items-center mr3">
				<label class="radio">
					<input
						type="radio"
						name="gender"
						bind:group={values.gender}
						value="other"
					/>
					<span class="box" />
					<span class="ml3">{$_('label.other')}</span>
				</label>
			</div>
		</div>
	</div>

	<div class="flex justify-end">
		{#if isLoading}
			<button
				type="submit"
				class="btn flex items-center justify-center w-100 h-50-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow"
			>
				<LoadingDefault />
			</button>
		{:else}
			<button
				type="submit"
				class="btn w-100 tc h-50-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow"
				>{$_('message.save')}</button
			>
		{/if}
	</div>
</form>

<style>
	.avatar-image {
		border-radius: 50%;
	}
	.radio {
		display: inline-flex;
		align-items: center;
	}
	.radio input {
		display: none;
	}
	.radio .box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #7e8299;
		box-sizing: border-box;
	}
	.radio .box:after {
		content: '';
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #2f3a97;
		opacity: 0;
	}
	.radio > input:checked + .box {
		border-color: #2f3a97;
	}
	.radio > input:checked + .box:after {
		opacity: 1;
	}
</style>
