<script lang="ts">
	import { totalPrice, totalQuantity } from '@stores/cart';
	import { cart } from '@stores/cart';

	function handleCheckout() {
		cart.update((old) => []);
	}
</script>

<header class="py-5 bg-gradient-to-r from-pink-500 to-yellow-500">
	<div class="container px-4 px-lg-5 my-3">
		<div class="text-center text-white">
			<h1 class="display-4 fw-bolder">Checkout</h1>
		</div>
	</div>
</header>
<div class="container p-3 max-w-4xl">
	<main>
		<div class="py-5 row g-5">
			<div class="col-md-6 col-lg-5 order-md-last">
				<h4 class="d-flex justify-content-end align-items-center mb-3">
					<span class="text-primary text-2xl pr-3">Your cart</span>
					<span class="badge bg-primary rounded-pill">{$totalQuantity}</span>
				</h4>
				<ul class="list-group mb-3">
					{#if $cart.length > 0}
						{#each $cart as item}
							<li class="list-group-item grid grid-flow-row-dense grid-cols-4 lh-sm">
								<img class="object-contain h-10 w-10" src={item.image} alt={item.name} />
								<div class="m-auto">{item.name}</div>
								<span class="text-body-secondary text-gray-500 m-auto">{item.quantity}</span>
								<span class="text-body-secondary text-gray-500 m-auto"
									>${item.price * item.quantity}</span
								>
							</li>
						{/each}
						<form method="POST" on:submit|preventDefault={handleCheckout}>
							<button
								class="w-100 btn btn-primary bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 border-none my-3"
								type="submit">Checkout</button
							>
						</form>
					{:else}
						<li class="list-group-item grid grid-flow-row-dense lh-sm">Your cart is empty</li>
					{/if}
				</ul>
			</div>
			<div class="col-md-6 col-lg-7">
				<h1 class="text-2xl mb-3 text-center">Purchase history</h1>
				<ul class="list-group mb-3">
					<li class="list-group-item grid grid-flow-row-dense lh-sm">No purchase history</li>
				</ul>
			</div>
		</div>
	</main>
</div>
