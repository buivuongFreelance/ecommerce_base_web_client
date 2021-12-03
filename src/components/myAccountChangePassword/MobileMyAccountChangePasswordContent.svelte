<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';
	import InputPassword from '../input/InputPassword.svelte';

	export let isLoading = false;
	export let values = {};
	export let submit;
	let errors = {};

	const validate = async (field) => {
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};

	const schema = yup.object().shape({
		currentPassword: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(100, $_('error.maxString', { values: { count: 100 } }))
			.matches(
				/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				$_('error.passwordStrong')
			),
		newPassword: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(100, $_('error.maxString', { values: { count: 100 } }))
			.matches(
				/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				$_('error.passwordStrong')
			),
		confirmNewPassword: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.oneOf([yup.ref('newPassword'), null], $_('error.passwordMatch')),
	});

	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			submit();
		} catch (error) {
			errors = extractErrors(error);
		}
	};
</script>

<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
	<h1 class="page__title ttc tc">{$_('account.changePassword')}</h1>
	<p class="tc light-silver w-80 center">{$_('account.desChangePass')}</p>
	<div class="mt2rem">
		<div class="fw6 light-silver label mb1">
			{$_('account.currentPassword')}
		</div>
		<InputPassword
			name="currentPassword"
			bind:bindValue={values.currentPassword}
			onInput={() => validate('currentPassword')}
			onBlur={() => validate('currentPassword')}
			error={errors.currentPassword}
			placeholder={$_('account.currentPassword')}
		>
			<i class="absolute left-0 top-0 bottom-0 pl4 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#b5b5c3"
					width="23px"
					height="23px"
				>
					<path d="M0 0h24v24H0z" fill="none" />
					<path
						d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2
												.9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9
												2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2
												.9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1
												1.71 0 3.1 1.39 3.1 3.1v2z"
					/>
				</svg>
			</i>
		</InputPassword>
		{#if errors.currentPassword}
			<div class="red fw6 mt2" transition:fade>{errors.currentPassword}</div>
		{/if}
	</div>
	<div class="mt2rem">
		<div class="fw6 light-silver label mb1">
			{$_('account.newPassword')}
		</div>

		<InputPassword
			name="newPassword"
			bind:bindValue={values.newPassword}
			onInput={() => validate('newPassword')}
			onBlur={() => validate('newPassword')}
			error={errors.newPassword}
			placeholder={$_('account.newPassword')}
		>
			<i class="absolute left-0 top-0 bottom-0 pl4 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#b5b5c3"
					width="23px"
					height="23px"
				>
					<path d="M0 0h24v24H0z" fill="none" />
					<path
						d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2
                                                .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9
                                                2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2
                                                .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1
                                                1.71 0 3.1 1.39 3.1 3.1v2z"
					/>
				</svg>
			</i>
		</InputPassword>
		{#if errors.newPassword}
			<div class="red fw6 mt2" transition:fade>{errors.newPassword}</div>
		{/if}
	</div>
	<div class="mt2rem">
		<div class="fw6 light-silver label mb1">
			{$_('account.confirmNewPassword')}
		</div>
		<div class="">
			<InputPassword
				name="confirmNewPassword"
				bind:bindValue={values.confirmNewPassword}
				onInput={() => validate('confirmNewPassword')}
				onBlur={() => validate('confirmNewPassword')}
				error={errors.confirmNewPassword}
				placeholder={$_('account.confirmNewPassword')}
			>
				<i class="absolute left-0 top-0 bottom-0 pl4 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#b5b5c3"
						width="23px"
						height="23px"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2
                                                .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9
                                                2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2
                                                .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1
                                                1.71 0 3.1 1.39 3.1 3.1v2z"
						/>
					</svg>
				</i>
			</InputPassword>
			{#if errors.confirmNewPassword}
				<div class="red fw6 mt2" transition:fade>
					{errors.confirmNewPassword}
				</div>
			{/if}
		</div>
	</div>
	<div class="flex justify-end bt b--light-gray b--dashed pt2rem mt2rem">
		{#if isLoading}
			<button
				type="submit"
				class="btn flex justify-center items-center w-100 h-40-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow"
			>
				<LoadingDefault />
			</button>
		{:else}
			<button
				type="submit"
				class="btn flex justify-center items-center w-100 h-40-px tc ph5 fw6 bg-dark-blue white ba b--dark-blue br1 pointer grow"
				>{$_('message.save')}</button
			>
		{/if}
	</div>
</form>

<style>
	.label {
		white-space: nowrap;
	}
</style>
