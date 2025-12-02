<script lang="ts">
	import { Toaster } from 'svelte-sonner';

	const { dir } = $props<{ dir?: 'rtl' | 'ltr' }>();
</script>

<Toaster position="bottom-center" {dir} expand closeButton richColors duration={3500} />
