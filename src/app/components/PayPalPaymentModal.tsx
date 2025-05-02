import React, { useState } from 'react';
import { Shield, X, Lock, CheckCircle2 } from 'lucide-react';
import { loadScript, PayPalButtonsComponent } from "@paypal/paypal-js";
import { toast } from 'react-toastify';
import { useUserFlow } from '../../contexts/UserFlowContext';

interface PayPalPaymentModalProps {
  onClose: () => void;
  amount: number;
  onValidatePayment: () => void;
}

function PayPalPaymentModal({
  onClose,
  amount,
  onValidatePayment,
}: PayPalPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPayPalInitialized, setIsPayPalInitialized] = useState(false);
  const { setHasPaid } = useUserFlow();
  const usdAmount = (amount / 150).toFixed(2);

  const initializePayPal = async () => {
    setIsLoading(true);
    let paypalButtons: PayPalButtonsComponent | null = null;

    try {
      const paypal = await loadScript({
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      });

      if (!paypal?.Buttons) {
        throw new Error("PayPal Buttons not available");
      }

      paypalButtons = paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'pay',
        },
        createOrder: (_data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: usdAmount,
                currency_code: "USD",
              },
              description: "Credit Report",
            }],
          });
        },
        onApprove: async (_data, actions) => {
          const order = await actions.order.capture();
          console.log('Payment successful:', order);
          // Update the user flow context to indicate payment is complete
          setHasPaid(true);
          toast.success('Payment completed successfully!');
          onValidatePayment();
        },
        onError: (err) => {
          console.error('PayPal Error:', err);
          toast.error('Payment failed. Please try again.');
          setIsLoading(false);
        },
        onInit: () => setIsLoading(false),
      });

      await paypalButtons.render('#paypal-button-container');
      setIsPayPalInitialized(true);
    } catch (error) {
      console.error('Failed to load PayPal JS SDK:', error);
      toast.error('Failed to initialize payment system');
      setIsLoading(false);
    }

    // Cleanup function (called when component unmounts or button is clicked again)
    return () => {
      if (paypalButtons) {
        paypalButtons.close();
      }
    };
  };

  const handlePayPalClick = () => {
    if (!isPayPalInitialized) {
      initializePayPal();
    }
  };

  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Close payment modal"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-6 max-h-[80vh] overflow-y-auto px-2">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <img
              src="https://raw.githubusercontent.com/derekkemoi/filesforprojects/refs/heads/main/paypal-svgrepo-com.svg"
              alt="PayPal"
              className="w-16 h-16"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Complete Your Payment</h3>
          <p className="text-sm text-gray-600 mt-1">Amount: ${usdAmount} USD</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 shadow-inner">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-5 h-5 text-[#0070ba]" />
            <p className="text-sm text-gray-700 font-medium">Secure Payment via PayPal</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">Order Summary:</h4>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Credit Score and Report</span>
                <span className="font-medium">${usdAmount}</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-3 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#0070ba]">${usdAmount} USD</span>
              </div>
            </div>

            <div className="space-y-4">
              {!isPayPalInitialized && (
                <button
                  onClick={handlePayPalClick}
                  disabled={isLoading}
                  className="w-full bg-[#0070ba] text-white py-2 px-4 rounded-full hover:bg-[#005ea6] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : 'Initiate PayPal Payments'}
                </button>
              )}
              <div id="paypal-button-container" className="relative min-h-[100px]">
                {isLoading && isPayPalInitialized && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse text-gray-400">Loading PayPal...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure</span>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">100% Secure Payment</span>
          </div>
          <p className="text-xs text-gray-400">
            By proceeding with the payment, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </>
  );
}

export default PayPalPaymentModal;