<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import * as yup from 'yup';
	import InputEmailLarge from '../input/InputEmailLarge.svelte';
	import InputPasswordLarge from '../input/InputPasswordLarge.svelte';
	import { extractError, extractErrors } from '../../functions';
	import LoadingWidget from '../loading/LoadingWidget.svelte';
	import Dimmer from '../loading/Dimmer.svelte';
	import {
		checkEmail as apiCheckEmail,
		register as apiRegister,
	} from '../../services/user';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	export let onSuccess;

	const { session } = stores();
	const { domainAuthWeb } = $session;

	let values = {
		email: '',
		password: '',
		passwordConfirm: '',
	};
	let errors = {};
	let isLoadingEmail = false;
	let isLoading = false;
	let isErrorServerEmail = false;

	const schema = yup.object().shape({
		email: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(255, $_('error.maxString', { values: { count: 255 } }))
			.email($_('error.email')),
		password: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(100, $_('error.maxString', { values: { count: 100 } }))
			.matches(
				/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				$_('error.passwordStrong')
			),
		passwordConfirm: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.oneOf([yup.ref('password'), null], $_('error.passwordMatch')),
	});

	const checkEmail = async () => {
		isLoadingEmail = true;
		try {
			await apiCheckEmail(domainAuthWeb, { email: values.email });
			isErrorServerEmail = false;
		} catch (error) {
			isErrorServerEmail = true;
		}
		isLoadingEmail = false;
	};

	const register = async () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiRegister(domainAuthWeb, {
				email: values.email,
				password: values.password,
			})
				.then(() => {
					isLoading = false;
					resolve();
				})
				.catch(() => {
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
					});
					isLoading = false;
					reject();
				});
		});
	};

	const validate = async (field) => {
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};

	const validateEmail = async () => {
		try {
			await schema.validateAt('email', values);
			errors['email'] = '';
			if (errors['email'] === '') {
				await checkEmail();
			}
		} catch (error) {
			errors['email'] = extractError(error, 'email');
		}
	};

	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			if (errors['email'] === '') {
				await checkEmail();
			}
			if (!isErrorServerEmail) {
				errors = {};
				await register();
				values.password = '';
				values.passwordConfirm = '';
				swal.fire({
					position: 'top',
					icon: 'success',
					title: $_('account.signUpSuccess'),
					text: $_('account.infoRegisterSuccess'),
					reverseButtons: true,
					allowOutsideClick: false,
					allowEscapeKey: false,
					onClose: () => {
						onSuccess();
					},
				});
			}
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
			} else {
				values.password = '';
				values.passwordConfirm = '';
			}
		}
	};
</script>

<form
	class="mt5"
	autocomplete="off"
	on:submit|preventDefault={handleSubmit}
	novalidate>
	<div>
		<div class="relative">
			{#if isLoadingEmail}
				<div class="absolute w-100">
					<div class="flex items-center h-60-px justify-center z-2">
						<LoadingWidget color="#b5b5c3" />
					</div>
				</div>
				<div class="w-100 h-60-px absolute z-1">
					<Dimmer />
				</div>
			{/if}
			<InputEmailLarge
				tabindex={isLoadingEmail ? -1 : 0}
				name="email"
				bind:bindValue={values.email}
				error={errors.email || isErrorServerEmail}
				onInput={() => validate('email')}
				onBlur={validateEmail}
				placeholder={$_('account.email')} />
			<i class="absolute left-0 top-0 bottom-0 pl4 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#b5b5c3"
					width="23px"
					height="23px">
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
				</svg>
			</i>
		</div>
		{#if errors.email}
			<div class="red fw6 mt2 tc" transition:fade>{errors.email}</div>
		{:else if isErrorServerEmail}
			<div class="red fw6 mt2 tc" transition:fade>{$_('error.emailExist')}</div>
		{/if}
	</div>
	<div class="mt5">
		<div>
			<InputPasswordLarge
				name="password"
				bind:bindValue={values.password}
				onInput={() => validate('password')}
				onBlur={() => validate('password')}
				error={errors.password}
				placeholder={$_('account.password')}>
				<i class="absolute left-0 top-0 bottom-0 pl4 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#b5b5c3"
						width="23px"
						height="23px">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2
												.9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9
												2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2
												.9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1
												1.71 0 3.1 1.39 3.1 3.1v2z" />
					</svg>
				</i>
			</InputPasswordLarge>
			{#if errors.password}
				<div class="red fw6 mt2 tc" transition:fade>{errors.password}</div>
			{/if}
		</div>
	</div>
	<div class="mt5">
		<div>
			<div class="relative">
				<InputPasswordLarge
					name="passwordConfirm"
					bind:bindValue={values.passwordConfirm}
					onInput={() => validate('passwordConfirm')}
					onBlur={() => validate('passwordConfirm')}
					error={errors.passwordConfirm}
					placeholder={$_('account.confirmPassword')} />
				<i class="absolute left-0 top-0 bottom-0 pl4 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#b5b5c3"
						width="23px"
						height="23px">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2
												.9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9
												2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2
												.9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1
												1.71 0 3.1 1.39 3.1 3.1v2z" />
					</svg>
				</i>
			</div>
			{#if errors.passwordConfirm}
				<div class="red fw6 mt2 tc" transition:fade>
					{errors.passwordConfirm}
				</div>
			{/if}
		</div>
	</div>
	<div class="mt5">
		{#if isLoading}
			<button
				type="button"
				class="br2 bg-dark-blue b--dark-blue ba ttu white f5 h-50-px fw6 w-100
					tracked">
				<div class="flex w-100 items-center justify-center">
					<LoadingDefault />
				</div>
			</button>
		{:else}
			<button
				type="submit"
				class="br2 bg-dark-blue b--dark-blue ba grow ttu white f5 h-50-px fw6
					w-100 tracked pointer">
				{$_('account.createAcc')}
			</button>
		{/if}
	</div>
</form>
