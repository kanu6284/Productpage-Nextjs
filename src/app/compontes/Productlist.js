"use client";

import { useState, useEffect } from "react";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetch("https://fakestoreapi.com/products");
                if (!data.ok) {
                    throw new Error('Network response was not ok');
                }
                data = await data.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const filtered = products.filter((product) => {
            const price = parseFloat(product.price);
            if (!isNaN(price)) {
                if (searchQuery.includes("<")) {
                    const maxPrice = parseFloat(searchQuery.replace("<", ""));
                    return price <= maxPrice;
                } else if (searchQuery.includes(">")) {
                    const minPrice = parseFloat(searchQuery.replace(">", ""));
                    return price >= minPrice;
                } else {
                    return product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.price.toString().includes(searchQuery);
                }
            }
            return false;
        });
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-lightGray">
            <h1 className="text-2xl font-bold mb-4 text-center bg-blue-500 text-white p-2 rounded">Product List</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by product name or price (e.g., <50, >50)"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((item) => (
                    <div key={item.id} className="border p-4 rounded-lg">
                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover mb-4" />
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-red-500">Price: ${item.price}</p>
                        <p className="text-gray-700">Category: {item.category}</p>
                        <p className="text-gray-700">Description: {item.description}</p>
                        <p className="text-green-500">Rating: {item.rating.rate} ({item.rating.count} reviews)</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
