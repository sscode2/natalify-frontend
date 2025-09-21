import React, { useState } from 'react';
import { CreditCard, Smartphone, Truck } from 'lucide-react';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, totalAmount }) => {
  const paymentMethods = [
    {
      id: 'COD',
      name: 'Cash on Delivery',
      icon: Truck,
      description: 'Pay when you receive your order',
      fees: 0,
      bengali: 'ক্যাশ অন ডেলিভারি'
    },
    {
      id: 'Stripe',
      name: 'Bank Card',
      icon: CreditCard,
      description: 'Visa, MasterCard, American Express',
      fees: Math.round(totalAmount * 0.029 + 30), // 2.9% + 30 BDT
      bengali: 'ব্যাংক কার্ড'
    },
    {
      id: 'bKash',
      name: 'bKash',
      icon: Smartphone,
      description: 'Pay with your bKash account',
      fees: Math.round(totalAmount * 0.018), // 1.8%
      bengali: 'বিকাশ'
    }
  ];

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const IconComponent = method.icon;
        const totalWithFees = totalAmount + method.fees;
        
        return (
          <label 
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === method.id 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            
            <div className="ml-3 flex items-center flex-1">
              <IconComponent className={`h-6 w-6 mr-3 ${
                selectedMethod === method.id ? 'text-primary-600' : 'text-gray-500'
              }`} />
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {method.bengali}
                  </span>
                  {method.fees > 0 && (
                    <span className="text-sm text-gray-600">
                      +৳{method.fees} fees
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{method.description}</p>
                {selectedMethod === method.id && method.fees > 0 && (
                  <p className="text-sm text-primary-600 mt-1">
                    Total: ৳{totalWithFees.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;