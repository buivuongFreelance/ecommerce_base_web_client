<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { auth } from '../../stores';
	import { changePassword } from '../../services/user';
	import config from '../../config';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import MobileMyAccountChangePasswordContent from './MobileMyAccountChangePasswordContent.svelte';

	const { session } = stores();
	const { domainAuthWeb } = $session;

	let isLoadingChangePassword = false;
	let valuesChangePassword = {
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	};

	const submitChangePassword = async () => {
		try {
			await postChangePassword();
			swal.fire({
				toast: true,
				position: 'top-end',
				icon: 'success',
				title: $_('account.changePasswordSuccess'),
				showConfirmButton: false,
				timerProgressBar: true,
				timer: 1000,

				onClose: () => {
					onSuccessChangePassword();
				},
			});
		} catch (error) {}
	};
	const postChangePassword = () => {
		isLoadingChangePassword = true;
		return new Promise((resolve, reject) => {
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			changePassword(domainAuthWeb, {
				token,
				currentPassword: valuesChangePassword.currentPassword,
				newPassword: valuesChangePassword.newPassword,
			})
				.then(() => {
					isLoadingChangePassword = false;
					resolve();
				})
				.catch((error) => {
					if (error.response.status === 400) {
						if (error.response.data) {
							if (error.response.data.obj === config.passwordNotCorrect) {
								valuesChangePassword = {
									currentPassword: '',
									newPassword: '',
									confirmNewPassword: '',
								};
								swal.fire({
									position: 'top',
									icon: 'error',
									title: $_('error.error'),
									text: $_('error.passwordNotCorrect'),
									reverseButtons: true,
								});
							}
						}
					} else {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.serverErrorTitle'),
							text: $_('error.serverErrorMessage'),
							reverseButtons: true,
						});
					}
					isLoadingChangePassword = false;
					reject();
				});
		});
	};
	const onSuccessChangePassword = () => {
		valuesChangePassword = {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		};
	};
</script>

<MobileMyAccountChangePasswordContent
	isLoading={isLoadingChangePassword}
	bind:values={valuesChangePassword}
	submit={submitChangePassword}
/>
