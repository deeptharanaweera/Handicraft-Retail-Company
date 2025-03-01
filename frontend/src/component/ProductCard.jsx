import React, { useState } from "react";

function ProductCard({ product, onAddToInvoice }) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        setQuantity(Number(e.target.value));
    };

    return (
        <div className="flex py-4 px-2 justify-between items-center bg-gray-100 rounded-md shadow-md border border-blue-300">
            <h2  className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-400">Brand: <span className="text-xl text-black">{product.brand}</span></p>
            <p className="text-xl font-semibold text-orange-500">Rs. {product.price}</p>
            <div className="flex items-center gap-2">
                <label htmlFor={`quantity-${product.id}`} className="text-xl">Qty:</label>
                <input
                    type="number"
                    id={`quantity-${product.id}`}
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 px-2 py-1 border rounded-md border-red-600"
                />
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    onClick={() => onAddToInvoice(product, quantity)}
                >
                    Add to Invoice
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
