<script>
	import { _ } from 'svelte-i18n';
	import ContentLoader from 'svelte-content-loader';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcDatepicker from '../form/PcDatepicker.svelte';

	export let values = {};

	export let countries = [];
	export let submitAccount;
	export let isLoading = false;
	export let isLoadingCountry = false;
	export let isServerErrorCountry = false;

	const handleSubmit = async () => {
		submitAccount();
	};
	const handleChangeCountry = (event) => {
		let countryId = event.target.value;
		values.country = countryId;
	};
</script>

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
	select:invalid {
		color: #b5b5c3;
	}
</style>

<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
	<div class="flex mb4 pb4 bb b--light-gray">
		<div class="avatar flex items-center">
			<picture class="avatar-image w-80-px h-80-px bg-light-gray mr3">
				<img src="" alt="" />
			</picture>
			<div class="avatar-content flex-auto">
				<h4 class="mb1">{values.firstName} {values.lastName}</h4>
				<div href="/" class="link fw6 light-blue ">Change avatar</div>
			</div>
		</div>
	</div>
	<h4 class="fw6 mb4">{$_('label.generalInformation')}</h4>
	<div class="flex mb4">
		<div class="label w-25 fw6 lh-50-px"><span>{$_('cart.name')}</span></div>
		<div class="w-75">
			<div class="flex">
				<div class="w-50 mr3">
					<div class="form-group">
						<div class="input">
							<input
								type="text"
								class="form-control w-100 ba b--light-gray br1 h-50-px ph3"
								bind:value={values.firstName}
								placeholder={$_('checkout.firstName')} />
						</div>
					</div>
				</div>
				<div class="w-50 ml3">
					<div class="form-group">
						<div class="input">
							<input
								type="text"
								class="form-control w-100 ba b--light-gray br1 h-50-px ph3"
								bind:value={values.lastName}
								placeholder={$_('checkout.lastName')} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex mb4">
		<div class="label w-25 fw6 lh-50-px">
			<span>{$_('label.idNumber')}</span>
		</div>
		<div class="w-75">
			<div class="flex">
				<div class="w-100">
					<div class="form-group">
						<div class="input">
							<input
								type="text"
								class="form-control w-100 ba b--light-gray br1 h-50-px ph3"
								bind:value={values.idNumber}
								placeholder={$_('label.idNumber')} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex mb4">
		<div class="label w-25 fw6 lh-50-px"><span>{$_('label.dob')}</span></div>
		<div class="w-75">
			<div class="flex">
				<div class="w-50 mr3">
					<div class="form-group">
						<PcDatepicker bind:bindValue={values.dob} />
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex mb4 pb4 bb b--light-gray">
		<div class="label w-25 fw6 lh-50-px"><span>{$_('label.gender')}</span></div>
		<div class="w-75">
			<div class="flex">
				<div class="flex-auto flex items-center h-50-px mr3">
					<label class="radio">
						<input
							type="radio"
							name="gender"
							bind:group={values.gender}
							value="male" />
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
							value="female" />
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
							value="other" />
						<span class="box" />
						<span class="ml3">{$_('label.other')}</span>
					</label>
				</div>
			</div>
		</div>
	</div>

	<h4 class="fw6 mb4">{$_('label.physicalAddress')}</h4>
	<div class="flex mb4">
		<div class="label w-25 fw6 lh-50-px">
			<span>{$_('label.country')}</span>
		</div>
		<div class="w-75">
			<div class="w-50 pr3">
				{#if isServerErrorCountry}
					<p class="red">{$_('error.serverErrorMessage')}</p>
				{:else if isLoadingCountry}
					<ContentLoader width="300" height="50" uniqueKey="loadingCountry">
						<rect x="0" y="0" rx="5" ry="5" width="200" height="50" />
					</ContentLoader>
				{:else}
					<div class="form-group" id="country">
						<div class="select">
							<!-- svelte-ignore a11y-no-onchange -->
							<select
								bind:value={values.country}
								on:change={handleChangeCountry}
								class="form-control w-100 ba b--light-gray br1 h-50-px ph3">
								<option value={0}>{$_('label.selectCountry')}</option>
								{#if countries.length > 0}
									{#each countries as country}
										<option value={country.id}>{country.name}</option>
									{/each}
								{/if}
							</select>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex mb4">
		<div class="label w-25 fw6 lh-50-px">
			<span>{$_('checkout.province')}</span>
		</div>
		<div class="w-75 pr3">
			<div class="flex">
				<div class="w-50 Pl3">
					<div class="form-group">
						<div class="input">
							<input
								type="text"
								placeholder={$_('checkout.province')}
								bind:value={values.province}
								class="form-control w-100 ba b--light-gray br1 h-50-px ph3" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex mb4">
		<div class="label w-25 fw6 lh-50-px">
			<span>{$_('checkout.address')}</span>
		</div>
		<div class="w-75">
			<div class="form-group">
				<div class="input">
					<input
						type="text"
						class="form-control w-100 ba b--light-gray br1 h-50-px ph3"
						bind:value={values.address}
						placeholder={$_('checkout.address')} />
				</div>
			</div>
		</div>
	</div>
	<div class="flex mb4 pb4 bb b--light-gray">
		<div class="label w-25 fw6 lh-50-px">
			<span>{$_('checkout.postalCode')}</span>
		</div>
		<div class="w-25 pr3">
			<div class="form-group">
				<div class="input">
					<input
						type="text"
						class="form-control w-100 ba b--light-gray br1 h-50-px ph3"
						bind:value={values.postalCode}
						placeholder={$_('checkout.postalCode')} />
				</div>
			</div>
		</div>
	</div>

	<div class="flex justify-end">
		{#if isLoading}
			<button
				type="submit"
				class="btn h-50-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow">
				<LoadingDefault />
			</button>
		{:else}
			<button
				type="submit"
				class="btn h-50-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow">{$_('message.save')}</button>
		{/if}
	</div>
</form>
