<script>
	import { _ } from 'svelte-i18n';
	import MobileDropzone from '../form/MobileDropzone.svelte';

	export let id;
</script>

<div class="f4 fw6 steel-two tc">
	{$_('image.maximumUpload', { values: { count: 5 } })}
</div>
<div class="mt5">
	<MobileDropzone {id} />
</div>
