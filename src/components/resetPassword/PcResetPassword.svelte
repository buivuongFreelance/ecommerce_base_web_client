<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import * as yup from 'yup';
	import InputPasswordLarge from '../input/InputPasswordLarge.svelte';
	import { extractError, extractErrors } from '../../functions';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { onMount } from 'svelte';
	import { resetPassword as apiResetPassword } from '../../services/user';

	const { session, page } = stores();
	const { domainAuthWeb } = $session;

	export let onSuccess;

	let values = {
		password: '',
	};
	let errors = {};
	let isLoading = false;

	onMount(() => {});

	const schema = yup.object().shape({
		password: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(100, $_('error.maxString', { values: { count: 100 } }))
			.matches(
				/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				$_('error.passwordStrong')
			),
	});
	const validate = async (field) => {
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};
	const resetPassword = () => {
		isLoading = true;
		let token = $page.query.token;

		return new Promise((resolve, reject) => {
			apiResetPassword(domainAuthWeb, { token, password: values.password })
				.then(() => {
					isLoading = false;
					resolve();
				})
				.catch((error) => {
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					isLoading = false;
					reject(error);
				});
		});
	};
	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			errors = {};
			await resetPassword();
			values.password = '';
			swal.fire({
				position: 'top',
				icon: 'success',
				title: $_('account.forgotPassword'),
				text: $_('account.infoRegisterSuccess'),
				reverseButtons: true,
				customClass: {
					icon: 'icon-success',
				},
				allowOutsideClick: false,
				allowEscapeKey: false,
				onClose: () => {
					onSuccess();
				},
			});
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
			} else {
				values.password = '';
			}
		}
	};
</script>

<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
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
				{$_('account.updatePassword')}
			</button>
		{/if}
	</div>
</form>
