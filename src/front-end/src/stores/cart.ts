import { derived, writable, get } from 'svelte/store';
import axios from 'axios';
import { user } from './auth';
import { productsMerged } from './products';

const apiUrl = "http://localhost:3001";

export const cart = writable([]);

export async function createCart() {
	const u = get(user);
	if (!u.username) return;
	try {
		await axios.post(`${apiUrl}/cart/${u.username}`);
	} catch (err) {
	}
}

export async function loadCart() {
	const u = get(user);
	if (!u.username) return;
	try {
		const res = await axios.get(`${apiUrl}/cart/${u.username}`);
		if (res.data && res.data.cart && res.data.cart.items) {
			const allProducts = get(productsMerged);
			const items = res.data.cart.items.map(item => {
				const product = allProducts.find(p => String(p.id) === String(item.productId));
				return {
					id: item.productId,
					name: item.productName,
					price: item.price,
					quantity: item.quantity,
					image: product ? product.image : ''
				};
			});
			cart.set(items);
		}
	} catch (err) {
		await createCart();
	}
}

export function addToCart(item) {
	const u = get(user);

	cart.update((oldCart) => {
		const itemIndex = oldCart.findIndex((e) => e.id === item.id);
		if (itemIndex === -1) {
			return [...oldCart, item];
		} else {
			oldCart[itemIndex].quantity += item.quantity;
			return oldCart;
		}
	});

	if (u.username) {
		axios.post(`${apiUrl}/cart/${u.username}/item`, {
			productId: String(item.id),
			productName: item.name,
			price: item.price,
			quantity: item.quantity
		}).catch(() => {});
	}
}

export const totalQuantity = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity, 0)
);

export const totalPrice = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
);
