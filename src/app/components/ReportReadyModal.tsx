import React from 'react';
import { Shield, Check } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface ReportReadyModalProps {
  fullName: string;
  idNumber: string;
  features: Feature[];
  onMakePayment: (amount: number) => void;
}

function ReportReadyModal({
  fullName,
  idNumber,
  onMakePayment
}: ReportReadyModalProps) {
  const pricingTiers = [
    {
      name: 'Basic Report',
      price: 150,
      features: [
        'Credit score overview',
        'Basic payment history',
        'Current loans summary',
        'PDF report download',
        '24-hour access'
      ]
    },
    {
      name: 'Premium Report',
      price: 250,
      features: [
        'Everything in Basic, plus:',
        'Detailed credit analysis',
        'Credit score simulator',
        'Personalized improvement tips',
        'Historical credit trends',
        '7-day access',
        'Priority support'
      ]
    }
  ];

  return (
    <div className="p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
          Hello {fullName}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">ID Number: {idNumber}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {pricingTiers.map((tier, index) => (
          <div 
            key={index}
            className={`rounded-xl p-3 sm:p-4 transition-all duration-300 hover:transform hover:scale-[1.02] ${
              index === 1 
                ? 'bg-yellow-50 ring-2 ring-yellow-200' 
                : 'bg-white ring-1 ring-gray-200'
            }`}
          >
            <div className="text-center mb-3">
              <h3 className={`text-base sm:text-lg font-bold ${index === 1 ? 'text-yellow-700' : 'text-gray-900'}`}>
                {tier.name}
              </h3>
              <div className="mt-1 sm:mt-2">
                <span className={`text-xl sm:text-2xl font-bold ${index === 1 ? 'text-yellow-600' : 'text-blue-600'}`}>
                  KES {tier.price}
                </span>
              </div>
            </div>

            <ul className="space-y-1.5 mb-3 sm:mb-4">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start text-xs sm:text-sm">
                  <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0 ${
                    index === 1 ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onMakePayment(tier.price)}
              className={`w-full py-2 sm:py-2.5 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium ${
                index === 1
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Select {tier.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportReadyModal;