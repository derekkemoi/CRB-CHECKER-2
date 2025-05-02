import React, { useState } from 'react';
import { Shield, Copy, X, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUserFlow } from '../../contexts/UserFlowContext';

interface MpesaPaymentModalProps {
  onClose: () => void;
  amount: number;
  onValidatePayment: () => void;
}

function MpesaPaymentModal({
  onClose,
  amount,
  onValidatePayment,
}: MpesaPaymentModalProps) {
  const [mpesaMessage, setMpesaMessage] = useState('');
  const { setHasPaid } = useUserFlow();
  
  const tillNumber = '5204479';
  const businessName = 'FOOTBALL HIGHWAY ENTERPRISES';

  const handleCopyTillNumber = () => {
    navigator.clipboard.writeText(tillNumber);
    toast.success('Till number copied to clipboard!');
  };

  const validateMpesaMessage = (message: string) => {
    if (!/^[A-Z0-9]+/.test(message)) {
      return { isValid: false, error: 'Invalid M-PESA message format' };
    }

    const amountRegex = /Ksh\s*(\d+(?:\.\d{2})?)/;
    const amountMatch = message.match(amountRegex);
    if (!amountMatch) {
      return { isValid: false, error: 'Could not find payment amount in message' };
    }

    const paidAmount = parseFloat(amountMatch[1]);
    if (paidAmount !== amount) {
      return { isValid: false, error: `Payment amount must be KES ${amount}` };
    }

    if (!message.includes(businessName)) {
      return { isValid: false, error: 'Invalid payment recipient' };
    }

    return { isValid: true };
  };

  const handleValidatePayment = () => {
    if (!mpesaMessage.trim()) {
      toast.error('Please paste the M-PESA confirmation message');
      return;
    }

    const validation = validateMpesaMessage(mpesaMessage);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setHasPaid(true);
    onValidatePayment();
    toast.success('Payment validated successfully!');
  };

  return (
    <div className="p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Pay KES {amount}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Follow the steps below</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="grid gap-3 sm:gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs sm:text-sm flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Go to M-PESA</p>
                <p className="text-xs text-gray-600">Open your M-PESA menu</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs sm:text-sm flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Select Lipa na M-PESA</p>
                <p className="text-xs text-gray-600">Choose "Buy Goods and Services"</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs sm:text-sm flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Enter Till Number</p>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="bg-gray-100 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-mono">{tillNumber}</code>
                  <button
                    onClick={handleCopyTillNumber}
                    className="p-1 sm:p-1.5 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs sm:text-sm flex-shrink-0">
                4
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Enter Amount</p>
                <p className="text-xs text-gray-600">KES {amount}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs sm:text-sm flex-shrink-0">
                5
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Enter M-PESA PIN</p>
                <p className="text-xs text-gray-600">Confirm and wait for SMS</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              M-PESA Message
            </label>
            <textarea
              value={mpesaMessage}
              onChange={(e) => setMpesaMessage(e.target.value)}
              className="w-full h-20 sm:h-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs sm:text-sm"
              placeholder="Paste your M-PESA confirmation message here..."
            />
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Secure payment verification</span>
          </div>

          <button
            onClick={handleValidatePayment}
            className="w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-xs sm:text-sm"
          >
            Validate Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default MpesaPaymentModal;