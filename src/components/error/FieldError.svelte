<script>
    import {fade} from 'svelte/transition';
    export let errors;
    export let classes = '';

    let localClasses = 'red fw6 mt2';
</script>

<div class={classes ? `${localClasses} ${classes}`: localClasses } transition:fade>{errors}</div>
