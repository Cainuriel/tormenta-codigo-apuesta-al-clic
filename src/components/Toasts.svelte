<script lang="ts">
    import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';

    export let data;
    export let active = false;
    let ok = false;
    const showToast = (title: string, desc: string, status: any) => {
		toasts.add({
			title: title,
			description: desc,
			duration: 5000,
			placement: 'bottom-center',
			type: status /* error, info, success, warning */,
			theme: 'dark',
			showProgress: true,
			onClick: () => {},
			onRemove: () => {}
		});
	};
    if(active) {
        showToast(data.title, data.desc, data.status);
        ok = true
    }
</script>
<div>
{#if ok}
<ToastContainer placement="bottom-right" let:data>
	<FlatToast {data} />
</ToastContainer>
{/if}	
</div>


<style>
	div {

	font-family: 'Courier New', Courier, monospace;

	}
</style>
