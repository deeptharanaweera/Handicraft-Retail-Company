import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminProductCard from '../component/AdminProductCard';

function AdminDashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
    })
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [customerPoints, setCustomerPoints] = useState({});
    const navigate = useNavigate();


    const handleInput = (event) => {
        setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/AddProduct', formData)
            .then(res => {
                console.log(res);
                toast.success('Product added successfully')
                setIsOpen(false);
                fetchProducts();

            })
            .catch(err => console.log(err));
    }



    //Fetch Products
    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/GetProducts");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    

    const fetchCustomers = async () => {
        try {
            const response = await axios.post('http://localhost:5000/GetCustomers');
            if (response.data !== "Error") {
                setCustomers(response.data);

                
            } else {
                console.error("Error fetching invoices");
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    }

    useEffect(() => {
        if (customers.length > 0) {
            fetchInvoice();
        }
    }, [customers]);
    console.log(customers);

    const fetchInvoice = async () => {
        try {
            let pointsMap = {};
    
            for (const customer of customers) {
                const response = await axios.post('http://localhost:5000/GetInvoices', { profile_id: customer.id });
                if (response.data !== "Error") {
                    const customerTotal = response.data.reduce((sum, invoice) => sum + invoice.points, 0);
                    pointsMap[customer.id] = customerTotal;
                } else {
                    console.error(`Error fetching invoices for customer ID: ${customer.id}`);
                    pointsMap[customer.id] = 0;
                }
            }
    
            setCustomerPoints(pointsMap);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };


    const handleLogout = () =>{
        navigate('/');
    }

    console.log(customers);

    return (
        <div className='m-2 relative mb-10'>
            <Toaster/>
            <button className='absolute top-0 right-0 bg-red-600 text-white px-2 py-3 text-xl rounded-md' onClick={handleLogout}>Logout</button>
            <h1 className='text-6xl font-semibold text-orange-500 text-center'>Admin Dashboard</h1>
            <div className='flex items-center justify-center mt-5'>
                <button className='bg-green-500 px-3 py-3 rounded-xl cursor-pointer font-semibold' onClick={() => setIsOpen(true)}>Add New Product</button>
            </div>
            <h2 className='text-2xl font-bold ml-10'>Our Products</h2>
            <div className='flex flex-col gap-4 mx-10 my-6'>
                {products.map((product) => (
                    <AdminProductCard key={product.id} product={product} />
                ))}
            </div>

            <h2 className='text-2xl font-bold ml-10'>All Customers</h2>
            <div className='mx-10'>
            <table className="w-full border mt-4">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="border px-4 py-2">Customer Name</th>
                                <th className="border px-4 py-2">Telephone Number</th>
                                <th className="border px-4 py-2">Earned Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((item) => (
                                <tr key={item.id} className="border text-center">
                                    <td className="border px-4 py-2 ">{item.salutation}. {item.firstName} {item.lastName}</td>
                                    <td className="border px-4 py-2">{item.tel}</td>
                                    <td className="border px-4 py-2">{customerPoints[item.id] || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>


            {/* PopUp Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            name="name"
                            onChange={handleInput}
                        />
                        <input
                            type="text"
                            placeholder="Brand Name"
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            name="brand"
                            onChange={handleInput}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            name="price"
                            onChange={handleInput}
                        />

                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-red-500 px-4 py-2 text-white rounded-lg "
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="bg-blue-500 px-4 py-2 text-white rounded-lg"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AdminDashboard