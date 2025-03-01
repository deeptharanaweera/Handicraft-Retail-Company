import React from 'react'

function AdminProductCard({product}) {
  return (
    <div className='flex py-4 px-2 justify-between items-center bg-gray-100 rounded-md shadow-md border border-blue-300'>
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-gray-400">Brand: <span className="text-xl text-black">{product.brand}</span></p>
      <p className="text-xl font-semibold text-orange-500">Rs. {product.price}</p>
      <div className='flex  gap-2'>
        <button className='bg-green-400 py-2 px-4 rounded-md'>Edit</button>
        <button className='bg-red-400 text-white py-2 px-4 rounded-md'>Delete</button>
      </div>
    </div>
  )
}

export default AdminProductCard