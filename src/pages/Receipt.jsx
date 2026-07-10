import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Package,
  ArrowRight,
  Home,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { emptyCart } from "../utils/Cart";
import useSEO from "../hooks/useSEO";
import { getTransaction } from "../api/payment.api";

/**
 * Destination of the Paycenter Web callback flow. The backend's
 * /api/payment/callback route breaks out of the payment iframe (via
 * window.top.location) and lands the whole tab here with ?reqid=...
 * so this is the first point where we're back in the parent window and can
 * safely read the final transaction status.
 */
const Receipt = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const reqid = params.get("reqid");
  const errorParam = params.get("error");
  const cancelled = params.get("cancelled") === "true";

  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const url = window.location.href;
  useSEO({ title: "Order Receipt - The Vanilla Shop", url });

  useEffect(() => {
    if (cancelled || !reqid) {
      setLoading(false);
      return;
    }

    let cancelledEffect = false;

    getTransaction(reqid)
      .then(({ data }) => {
        if (cancelledEffect) return;
        setTxn(data);
        // Cart was intentionally kept intact until we reach this page
        // with a confirmed result — only clear it once we know the
        // payment actually went through.
        if (data.status === "APPROVED") {
          emptyCart();
          window.dispatchEvent(new Event("cartUpdated"));
        }
      })
      .catch(() => {
        if (!cancelledEffect)
          setFetchError(
            "Could not retrieve your transaction. If you were charged, please contact support with your reference.",
          );
      })
      .finally(() => {
        if (!cancelledEffect) setLoading(false);
      });

    return () => {
      cancelledEffect = true;
    };
  }, [reqid, cancelled]);

  const Shell = ({ children }) => (
    <div className="pt-24 min-h-screen bg-vanilla-50 font-sans text-vanilla-800">
      <Navbar />
      <section className="py-10 sm:py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );

  if (cancelled) {
    return (
      <Shell>
        <div className="p-8 text-center">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-serif font-bold text-vanilla-900">
            Payment Cancelled
          </h1>
          <p className="text-vanilla-800/70 text-sm mt-2">
            You cancelled the payment before it was completed. Your order hasn't
            been charged.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/checkout"
              className="px-5 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-colors"
            >
              Return to Checkout
            </Link>
            <Link
              to="/"
              className="px-5 py-3 border border-vanilla-200 rounded-xl font-bold text-vanilla-800 hover:bg-vanilla-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (!reqid) {
    return (
      <Shell>
        <div className="p-8 text-center">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-serif font-bold text-vanilla-900">
            No Payment Reference Found
          </h1>
          <p className="text-vanilla-800/70 text-sm mt-2">
            This page is meant to be reached after a payment attempt. If you
            completed a payment and landed here without a reference, please
            contact support.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="px-5 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-colors inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <div className="p-12 text-center">
          <Loader2 className="w-10 h-10 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-vanilla-800/70 text-sm">
            Confirming your payment...
          </p>
        </div>
      </Shell>
    );
  }

  if (fetchError) {
    return (
      <Shell>
        <div className="p-8 text-center">
          <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-serif font-bold text-vanilla-900">
            Couldn't Confirm Payment
          </h1>
          <p className="text-vanilla-800/70 text-sm mt-2">{fetchError}</p>
          <p className="text-vanilla-800/50 text-xs mt-3">Reference: {reqid}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@bancstac.com"
              className="px-5 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> Contact Support
            </a>
            <Link
              to="/"
              className="px-5 py-3 border border-vanilla-200 rounded-xl font-bold text-vanilla-800 hover:bg-vanilla-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (!txn) {
    return (
      <Shell>
        <div className="p-8 text-center">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-serif font-bold text-vanilla-900">
            Transaction Not Found
          </h1>
          <p className="text-vanilla-800/70 text-sm mt-2">Reference: {reqid}</p>
        </div>
      </Shell>
    );
  }

  const approved = txn.status === "APPROVED";
  const currencyAmount = (txn.amount?.paymentAmount ?? 0) / 100;

  return (
    <Shell>
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          {approved ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
          )}
          <h1 className="text-2xl font-serif font-bold text-vanilla-900">
            {approved
              ? "Payment Approved"
              : `Payment ${txn.status === "DECLINED" ? "Declined" : txn.status}`}
          </h1>
          <p className="text-vanilla-800/60 text-sm mt-1">
            {approved
              ? "Thank you — your order has been confirmed."
              : txn.responseText || "The payment could not be completed."}
          </p>
          {errorParam && (
            <p className="text-amber-600 text-xs mt-2">
              Note: {errorParam.replaceAll("_", " ")}
            </p>
          )}
        </div>

        <div className="border border-vanilla-100 rounded-xl divide-y divide-vanilla-100 text-sm">
          <Row label="Reference" value={txn.reqid} />
          {txn.clientRef && <Row label="Order Ref" value={txn.clientRef} />}
          <Row
            label="Amount"
            value={`${currencyAmount.toFixed(2)} ${txn.amount?.currency || ""}`}
          />
          {txn.txnReference && (
            <Row label="Transaction ID" value={txn.txnReference} />
          )}
          {txn.responseCode && (
            <Row
              label="Response"
              value={`${txn.responseCode} - ${txn.responseText}`}
            />
          )}
          {txn.creditCard?.number && (
            <Row
              label="Card"
              value={`${txn.creditCard.type || ""} •••• ${txn.creditCard.number.slice(-4)}`}
            />
          )}
          {txn.tokenReference && (
            <Row label="Saved Card Token" value={txn.tokenReference} />
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {approved ? (
            <>
              {txn.orderId && (
                <button
                  onClick={() => navigate(`/order-success/${txn.orderId}`)}
                  className="px-5 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" /> View Order{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link
                to="/"
                className="px-5 py-3 border border-vanilla-200 rounded-xl font-bold text-vanilla-800 hover:bg-vanilla-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/checkout"
                className="px-5 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-colors"
              >
                Try Again
              </Link>
              <a
                href="mailto:support@bancstac.com"
                className="px-5 py-3 border border-vanilla-200 rounded-xl font-bold text-vanilla-800 hover:bg-vanilla-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Contact Support
              </a>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between px-4 py-3">
    <span className="text-vanilla-800/60">{label}</span>
    <span className="text-vanilla-900 font-medium text-right break-all ml-4">
      {value}
    </span>
  </div>
);

export default Receipt;
