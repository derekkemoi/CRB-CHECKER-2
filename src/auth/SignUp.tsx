import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { useUserFlow } from '../contexts/UserFlowContext';
import { useSignupCheck } from '../hooks/useSignupCheck';

function SignUp() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const { resetFlow } = useUserFlow();
  const { setSignedUp } = useSignupCheck();
  const [signupProgress, setSignupProgress] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useSignupCheck();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      phone: '',
      idNumber: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^(?:\+254|0)[17]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
      isValid = false;
    }

    if (!formData.idNumber) {
      newErrors.idNumber = 'ID number is required';
      isValid = false;
    } else if (!/^\d{8}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'Please enter a valid 8-digit ID number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const simulateSignup = async () => {
    const interval = setInterval(() => {
      setSignupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);

    return new Promise(resolve => {
      setTimeout(() => {
        clearInterval(interval);
        setSignupProgress(100);
        resolve(true);
      }, 4000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const { confirmPassword, ...signupData } = formData;
        
        setSignupProgress(0);
        await simulateSignup();
        
        const tempEmail = `${signupData.phone.replace(/[^0-9]/g, '')}@temp.com`;
        await signup({ ...signupData, email: tempEmail });
        
        const userData = {
          fullName: formData.fullName,
          phone: formData.phone,
          idNumber: formData.idNumber
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        setSignedUp();
        toast.success('Successfully signed up!');
        resetFlow();
        navigate('/app/report');
      } catch (error) {
        setSignupProgress(0);
        toast.error('Failed to sign up. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-900 hover:text-blue-600 transition-colors"
        >
          <Shield className="w-6 h-6 mr-2" />
          <span className="text-xl font-bold">CRB Check</span>
        </Link>

        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Get your credit report in minutes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="e.g., +254712345678"
                    disabled={isLoading}
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.idNumber ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your 8-digit ID number"
                    maxLength={8}
                    disabled={isLoading}
                  />
                  <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.idNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {signupProgress > 0 && (
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${signupProgress}%` }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    Creating Account
                    {signupProgress > 0 && ` (${Math.round(signupProgress)}%)`}
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;