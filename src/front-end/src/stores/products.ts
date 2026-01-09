import { derived, writable } from 'svelte/store';
import axios from 'axios';

const apiUrl = "http://localhost:3001";

function staticCatalog() {
	return [
		{ name: 'Brocolli', price: 2.73, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg', category: 'Vegetables' },
		{ name: 'Cauliflower', price: 6.3, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg', category: 'Vegetables' },
		{ name: 'Cucumber', price: 5.6, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg', category: 'Vegetables' },
		{ name: 'Beetroot', price: 8.7, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/beetroot.jpg', category: 'Vegetables' },
		{ name: 'Apple', price: 2.34, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/apple.jpg', category: 'Fruits' },
		{ name: 'Banana', price: 1.69, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/banana.jpg', category: 'Fruits' },
		{ name: 'Grapes', price: 5.98, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/grapes.jpg', category: 'Fruits' },
		{ name: 'Mango', price: 6.8, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/mango.jpg', category: 'Fruits' }
	];
}

export const products = writable({});

async function seedProducts() {
	const catalog = staticCatalog();
	for (const p of catalog) {
		try {
			await axios.post(`${apiUrl}/product`, {
				name: p.name,
				description: '',
				price: p.price,
				imageUrl: p.image,
				stock: 100,
				category: p.category
			});
		} catch (err) {
		}
	}
}

export async function loadProducts() {
	try {
		const res = await axios.get(`${apiUrl}/products`);
		const data = res.data.products || [];
		if (data.length === 0) {
			await seedProducts();
			const res2 = await axios.get(`${apiUrl}/products`);
			const data2 = res2.data.products || [];
			setProductsFromData(data2);
		} else {
			setProductsFromData(data);
		}
	} catch (err) {
		const grouped = {};
		for (const p of staticCatalog()) {
			if (!grouped[p.category]) grouped[p.category] = [];
			grouped[p.category].push({ id: p.name, name: p.name, price: p.price, image: p.image, category: p.category });
		}
		products.set(grouped);
	}
}

function setProductsFromData(data) {
	const grouped = {};
	for (const p of data) {
		const cat = p.category || 'Other';
		if (!grouped[cat]) grouped[cat] = [];
		grouped[cat].push({
			id: p._id,
			name: p.name,
			price: p.price,
			image: p.imageUrl || '',
			category: cat
		});
	}
	products.set(grouped);
}

export async function createProduct(product) {
	try {
		await axios.post(`${apiUrl}/product`, {
			name: product.name,
			description: product.description || '',
			price: product.price,
			imageUrl: product.image,
			stock: product.stock || 100,
			category: product.category
		});
		await loadProducts();
	} catch (err) {
	}
}

export async function updateProduct(product) {
	try {
		await axios.put(`${apiUrl}/product/${product.id}`, {
			name: product.name,
			description: product.description || '',
			price: product.price,
			imageUrl: product.image,
			stock: product.stock || 100,
			category: product.category
		});
		await loadProducts();
	} catch (err) {
	}
}

export async function deleteProduct(productId) {
	try {
		await axios.delete(`${apiUrl}/product/${productId}`);
		await loadProducts();
	} catch (err) {
	}
}

export async function resetProducts() {
	try {
		const res = await axios.get(`${apiUrl}/products`);
		const data = res.data.products || [];
		for (const p of data) {
			await axios.delete(`${apiUrl}/product/${p._id}`);
		}
		await seedProducts();
		await loadProducts();
	} catch (err) {
	}
}

export const productsMerged = derived(products, ($products) => {
	return Object.values($products).flat();
});
