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
	<div class="form__body">
		<h1 class="page__title ttc tc">{$_('profile.title')}</h1>
		<div class="form-group mt4">
			<div class="label fw6">
				<span>{$_('label.idNumber')}</span>
			</div>
			<div class="input mt1">
				<input
					type="text"
					class="form-control w-100 ba b--light-gray br2 h-50-px ph3"
					bind:value={values.idNumber}
					placeholder={$_('label.idNumber')}
				/>
			</div>
		</div>

		<div class="form-group mt4">
			<div class="label fw6 mb1"><span>{$_('label.dob')}</span></div>
			{#if values.dob}
				<PcDatepicker bind:bindValue={values.dob} />
			{:else}
				<PcDatepicker bind:bindValue={values.dob} />
			{/if}
		</div>
		<div class="form-group mt4">
			<div class="label fw6"><span>{$_('label.gender')}</span></div>
			<div class="flex">
				<div class="flex-auto flex items-center h-50-px mr3">
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
				<div class="flex-auto flex items-center h-50-px mr3">
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
				<div class="flex-auto flex items-center h-50-px mr3">
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
	</div>

	<div class="flex justify-end mt4 mt4 pt4 bt b--light-gray b--dashed">
		{#if isLoading}
			<button
				type="submit"
				class="btn w-100 h-40-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br2 pointer grow"
			>
				<LoadingDefault />
			</button>
		{:else}
			<button
				type="submit"
				class="btn w-100 h-40-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br2 pointer grow"
				>{$_('message.save')}</button
			>
		{/if}
	</div>
</form>

<style>
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
