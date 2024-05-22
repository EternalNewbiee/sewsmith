'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createClient } from '@/lib/supabase/client';
import { XMarkIcon } from "@heroicons/react/20/solid";

const supabase = createClient();

interface Item {
    id: number;
    fabric: string;
    shirt_type: string;
    design_file: string | null;
    color: string;
    sizes: string;
    quantities: number;
    order_date: string;
    shipping_address: string;
    shipping_fee: number;
    status: string;
    total_price: number;
}

interface ModalProps {
    onClose: () => void;
    item: Item;
    onSubmit: () => void;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString(); // This will give you the time in the normal format
    return `${month}/${day}/${year} at ${time}`;
};

const Modal: React.FC<ModalProps> = ({ onClose, item, onSubmit }) => {
    const [status, setStatus] = useState(item ? item.status : '');

    // Main Add & edit function
    const handleSubmit = async () => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .match({ id: item.id });
            
            if (error) throw error;
            console.log('Item updated successfully');
            Swal.fire('Updated!', 'The item has been updated successfully.', 'success');
            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error!', 'Something went wrong', 'error');
        }
    };

    // Status Change Color
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500';
            case 'completed':
                return 'text-green-500';
            case 'cancelled':
                return 'text-red-500';
            default:
                return '';
        }
    };

    // Bubble UI 
    if (!item) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-[600px] flex flex-nowrap">
                <div className="p-5 w-full">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-semibold">Edit Order Status</h3>
                        <XMarkIcon
                            className="w-8 h-8 text-red-500 hover:text-red-600 cursor-pointer"
                            aria-hidden="true"
                            onClick={onClose}
                        />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-500">Order Details</h3>
                            <p className="text-sm font-semibold [text-indent:2rem]">Order ID: <span className="font-normal">{item.id}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Fabric: <span className="font-normal">{item.fabric}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Shirt Type: <span className="font-normal">{item.shirt_type}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Color: <span className="font-normal">{item.color}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Size: <span className="font-normal">{item.sizes}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Quantities: <span className="font-normal">{item.quantities}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Order Date: <span className="font-normal">{formatDate(item.order_date)}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Shipping Address: <span className="font-normal">{item.shipping_address}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Shipping Fee: <span className="font-normal">{item.shipping_fee}</span></p>
                            <p className="text-sm font-semibold [text-indent:2rem]">Total Payment: <span className="font-normal">{item.total_price}</span></p>
                        </div>
                        <div className="flex flex-col" >
                            <h3 className="text-lg font-semibold text-blue-500">Order Status:</h3>
                            <select
                                id="status"
                                className="mt-2 p-2 w-full border rounded"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button onClick={onClose} className="px-4 py-2 rounded text-white bg-gray-500 hover:bg-gray-600">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600">Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
