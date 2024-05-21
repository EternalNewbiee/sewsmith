'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createClient } from '@/lib/supabase/client';
import { XMarkIcon } from "@heroicons/react/20/solid";

const supabase = createClient();

interface Item {
    id: number;
    status: string;
    fabric: string;
    shirt_type: string;
}

interface ModalProps {
    onClose: () => void;
    item: Item;
    onSubmit: () => void;
}

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
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full flex flex-nowrap">
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
                        <div className="flex flex-col">
                            <label htmlFor="status" className="text-sm font-semibold">Order Status</label>
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
                        <div>
                            <p className="text-sm font-semibold">Order ID: {item.id}</p>
                            <p className="text-sm font-semibold">Fabric: {item.fabric}</p>
                            <p className="text-sm font-semibold">Shirt Type: {item.shirt_type}</p>
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
