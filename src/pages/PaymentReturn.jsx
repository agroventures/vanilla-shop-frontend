import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { completePayment } from '../api/payment.api';

const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, failed, error
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const processPaymentReturn = async () => {
            try {
                // Get reqId from URL query parameter
                const reqId = searchParams.get('reqId');
                
                if (!reqId) {
                    setStatus('error');
                    setErrorMessage('Missing payment reference ID');
                    return;
                }

                // Get stored orderId from sessionStorage
                const orderId = sessionStorage.getItem('orderId');

                // Complete the payment with Paycenter
                const paymentResponse = await completePayment(reqId);

                if (paymentResponse.data?.success) {
                    const paymentData = paymentResponse.data.data;
                    
                    // Check response code (00 = success)
                    if (paymentData.responseCode === '00') {
                        setPaymentDetails(paymentData);
                        
                        // Update order status in your backend
                        if (orderId) {
                            try {
                                await axios.patch(
                                    `${import.meta.env.VITE_API_URL}/orders/${orderId}/payment`,
                                    {
                                        paymentStatus: 'paid',
                                        transactionId: paymentData.txnReference,
                                        paymentDetails: {
                                            responseCode: paymentData.responseCode,
                                            responseText: paymentData.responseText,
                                            cardType: paymentData.creditCard?.type,
                                            cardLast4: paymentData.creditCard?.number?.slice(-4)
                                        }
                                    }
                                );
                            } catch (updateError) {
                                console.error('Failed to update order:', updateError);
                                // Don't fail the whole flow if order update fails
                            }
                        }
                        
                        setStatus('success');
                        toast.success('Payment successful!');
                        
                        // Clean up session storage
                        sessionStorage.removeItem('paymentReqId');
                        sessionStorage.removeItem('orderId');
                        
                        // Redirect to success page after 2 seconds
                        setTimeout(() => {
                            navigate(`/order-success/${orderId || 'unknown'}`);
                        }, 2000);
                    } else {
                        // Payment failed
                        setStatus('failed');
                        setErrorMessage(paymentData.responseText || 'Payment was declined');
                        setPaymentDetails(paymentData);
                        toast.error('Payment failed');
                    }
                } else {
                    setStatus('failed');
                    setErrorMessage('Payment verification failed');
                    toast.error('Payment verification failed');
                }
            } catch (error) {
                console.error('Payment processing error:', error);
                setStatus('error');
                setErrorMessage(
                    error.response?.data?.message || 
                    'An error occurred while processing your payment'
                );
                toast.error('Payment processing error');
            }
        };

        processPaymentReturn();
    }, [searchParams, navigate]);

    const handleTryAgain = () => {
        const orderId = sessionStorage.getItem('orderId');
        sessionStorage.removeItem('paymentReqId');
        sessionStorage.removeItem('orderId');
        
        if (orderId) {
            navigate(`/order-success/${orderId}?payment=failed`);
        } else {
            navigate('/cart');
        }
    };

    const handleContactSupport = () => {
        navigate('/contact');
    };

    return (
        <div className="min-h-screen bg-vanilla-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Processing State */}
                {status === 'processing' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <Loader2 className="w-16 h-16 text-gold-500 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-vanilla-900 mb-2 font-serif">
                            Processing Payment
                        </h2>
                        <p className="text-vanilla-800/60">
                            Please wait while we verify your payment...
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-vanilla-800/50">
                            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && paymentDetails && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-green-50 p-8 text-center">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-900 mb-2 font-serif">
                                Payment Successful!
                            </h2>
                            <p className="text-green-700">
                                Your payment has been processed successfully
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="bg-vanilla-50 rounded-lg p-4">
                                <h3 className="font-bold text-vanilla-900 mb-3 text-sm uppercase tracking-wide">
                                    Payment Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-vanilla-800/60">Transaction ID:</span>
                                        <span className="font-medium text-vanilla-900">
                                            {paymentDetails.txnReference}
                                        </span>
                                    </div>
                                    {paymentDetails.amount && (
                                        <div className="flex justify-between">
                                            <span className="text-vanilla-800/60">Amount:</span>
                                            <span className="font-medium text-vanilla-900">
                                                {paymentDetails.amount.currency} {(paymentDetails.amount.paymentAmount / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {paymentDetails.creditCard && (
                                        <div className="flex justify-between">
                                            <span className="text-vanilla-800/60">Payment Method:</span>
                                            <span className="font-medium text-vanilla-900">
                                                {paymentDetails.creditCard.type} •••• {paymentDetails.creditCard.number?.slice(-4)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-center text-vanilla-800/60 text-sm">
                                Redirecting to order confirmation...
                            </p>
                        </div>
                    </div>
                )}

                {/* Failed State */}
                {status === 'failed' && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-red-50 p-8 text-center">
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-red-900 mb-2 font-serif">
                                Payment Failed
                            </h2>
                            <p className="text-red-700">
                                {errorMessage || 'Your payment could not be processed'}
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {paymentDetails && (
                                <div className="bg-vanilla-50 rounded-lg p-4">
                                    <h3 className="font-bold text-vanilla-900 mb-2 text-sm">
                                        Details:
                                    </h3>
                                    <p className="text-sm text-vanilla-800/70">
                                        {paymentDetails.responseText || 'Transaction was declined'}
                                    </p>
                                    {paymentDetails.txnReference && (
                                        <p className="text-xs text-vanilla-800/50 mt-2">
                                            Reference: {paymentDetails.txnReference}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handleTryAgain}
                                    className="w-full px-6 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-all"
                                >
                                    View Order Details
                                </button>
                                <button
                                    onClick={handleContactSupport}
                                    className="w-full px-6 py-3 bg-vanilla-100 text-vanilla-900 rounded-xl font-bold hover:bg-vanilla-200 transition-all"
                                >
                                    Contact Support
                                </button>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> Your order has been created but payment failed. 
                                    You can try paying again from your order page or contact support for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-amber-50 p-8 text-center">
                            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-2 font-serif">
                                Processing Error
                            </h2>
                            <p className="text-amber-700">
                                {errorMessage || 'An unexpected error occurred'}
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="bg-vanilla-50 rounded-lg p-4">
                                <p className="text-sm text-vanilla-800/70">
                                    We encountered an error while processing your payment. 
                                    Please contact support if you were charged.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleContactSupport}
                                    className="w-full px-6 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-all"
                                >
                                    Contact Support
                                </button>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="w-full px-6 py-3 bg-vanilla-100 text-vanilla-900 rounded-xl font-bold hover:bg-vanilla-200 transition-all"
                                >
                                    Return to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentReturn;