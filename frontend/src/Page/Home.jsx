import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../component/ProductCard';

function Home() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [totalRewardPoints, setTotalRewardPoints] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchProducts();
    }, []);

    console.log(user)

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/GetProducts");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddToInvoice = (product, quantity) => {
        setInvoiceItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: quantity } : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };


    console.log('Invoice Items: ', invoiceItems);

    const totalPrice = invoiceItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const calculateRewardPoints = (totalPrice) => {
        if (totalPrice >= 10000) {
            return Math.floor(totalPrice / 10000) * 200;
        } else if (totalPrice >= 5000) {
            return 80;
        } else if (totalPrice >= 1500) {
            return 30;
        } else if (totalPrice >= 500) {
            return 5;
        } else {
            return 0;
        }
    };

    const rewardPoints = calculateRewardPoints(totalPrice);

    const handleCreateInvoice = async () => {
        try {
            const invoiceData = {
                totalPrice,
                rewardPoints,
                profile_id: user.id,
            };

            console.log("Invoice Data:", invoiceData);

            const invoiceResponse = await axios.post('http://localhost:5000/AddInvoice', invoiceData);

            if (invoiceResponse.status === 201 || invoiceResponse.status === 200) {
                const invoiceId = invoiceResponse.data.invoiceId;
                console.log("Invoice created successfully! ID:", invoiceId);

                for (const item of invoiceItems) {
                    const productData = {
                        invoice_id: invoiceId,
                        product_id: item.id,
                        qty: item.quantity,
                        subTotal: item.price * item.quantity,
                    };


                    console.log("Adding product to invoice:", productData);

                    await axios.post('http://localhost:5000/AddInvoiceProduct', productData);
                }

                toast.success("Invoice and products added successfully!");
                setInvoiceItems([]);
                setIsOpen(true);
            } else {
                alert("Failed to create invoice. Please try again.");
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Failed to create invoice.");
        }
    };

    useEffect(() => {
        if (isOpen && user) {
            fetchInvoice();
        }
    }, [isOpen, user])

    const fetchInvoice = async () => {
        try {
            const response = await axios.post('http://localhost:5000/GetInvoices', { profile_id: user.id });
            if (response.data !== "Error") {
                setInvoices(response.data);

                const totalPoints = response.data.reduce((sum, invoice) => sum + invoice.points, 0);
                setTotalRewardPoints(totalPoints);
            } else {
                console.error("Error fetching invoices");
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    }

    console.log(invoices);
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };


    return (
        <div className="mx-10 my-10 mb-10">
            <Toaster/>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-6xl font-semibold text-orange-500'>Welcome Our Online Shop</h1>
                <div className='flex gap-2'>
                    <button className='bg-red-600 text-white px-2 py-2 rounded-md' onClick={handleLogout}>Logout</button>
                    <button className='bg-green-600 text-white px-2 py-2 rounded-md' onClick={() => setIsOpen(true)}>My Invoice</button>
                </div>
            </div>
            <h2 className='text-2xl font-bold mb-2'>Our Products</h2>
            <div className="flex flex-col gap-4 mb-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToInvoice={handleAddToInvoice} />
                ))}
            </div>

            {/* Invoice Table */}
            <h2 className="text-2xl font-bold mt-6">Invoice</h2>
            {invoiceItems.length > 0 ? (
                <div>
                    <table className="w-full border mt-4">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="border px-4 py-2">Product Name</th>
                                <th className="border px-4 py-2">Price</th>
                                <th className="border px-4 py-2">Quantity</th>
                                <th className="border px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceItems.map((item) => (
                                <tr key={item.id} className="border text-center">
                                    <td className="border px-4 py-2 ">{item.name}</td>
                                    <td className="border px-4 py-2">Rs {item.price}</td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">Rs {item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between mt-4 p-4 bg-gray-100 rounded-md">
                        <div>
                            <p className="text-lg font-bold">Total Price: <span className='text-xl text-red-500'>Rs {totalPrice}</span></p>
                            <p className="text-lg font-bold">Reward Points: <span className='text-xl text-orange-500'>{rewardPoints}</span></p>
                        </div>
                        <div>
                            <button className='bg-green-500 text-black rounded-xl px-4 py-4 font-semibold' onClick={handleCreateInvoice}>Create Invoice</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No items added to the invoice.</p>
            )}


            {/* PopUp Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-semibold mb-4 text-center">My Invoices</h2>

                        <div className=''>
                            {invoices.length > 0 ? (
                                <table className="w-full border">
                                    <thead>
                                        <tr className="bg-gray-300">
                                            <th className="border px-4 py-2">Invoice Date</th>
                                            <th className="border px-4 py-2">Total Price</th>
                                            <th className="border px-4 py-2">Reward Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id} className="border text-center">
                                                <td className="border px-4 py-2">{dayjs(invoice.date).format('YYYY-MM-DD')}</td>
                                                <td className="border px-4 py-2">Rs {invoice.totalPrice}</td>
                                                <td className="border px-4 py-2">{invoice.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            ) : (
                                <p className="text-gray-500">No invoices found.</p>
                            )}
                        </div>

                        <div className='flex items-center justify-between mt-5'>
                            <p className="text-lg font-bold text-orange-500">Total Points You Earned: <span className='text-4xl text-green-500'>{totalRewardPoints}</span></p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="bg-red-500 px-4 py-2 text-white rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
