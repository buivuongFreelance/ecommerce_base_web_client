<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import * as yup from 'yup';
	import InputEmailLarge from '../input/InputEmailLarge.svelte';
	import { extractError, extractErrors } from '../../functions';
	import { forgotPassword as apiForgotPassword } from '../../services/user';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	export let onSuccess;

	const { session } = stores();
	const { domainAuthWeb } = $session;

	let values = {
		email: '',
	};
	let errors = {};
	let isLoading = false;

	const schema = yup.object().shape({
		email: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(255, $_('error.maxString', { values: { count: 255 } }))
			.email($_('error.email')),
	});

	const forgotPassword = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiForgotPassword(domainAuthWeb, {
				email: values.email,
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
						text: $_('error.emailNotExist'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
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

	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			errors = {};
			await forgotPassword();
			values.email = '';
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
				values.email = '';
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
			<InputEmailLarge
				tabindex={0}
				name="email"
				bind:bindValue={values.email}
				error={errors.email}
				onInput={() => validate('email')}
				onBlur={() => validate('email')}
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
		{/if}
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
				{$_('message.submit')}
			</button>
		{/if}
	</div>
</form>
