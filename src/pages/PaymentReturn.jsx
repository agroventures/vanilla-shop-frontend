import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { completePayment } from "../api/payment.api";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const reqid = searchParams.get("reqid");
    if (!reqid) {
      setStatus("error");
      return;
    }

    const finalize = async () => {
      try {
        const res = await completePayment(reqid);

        if (res.data.responseCode === "00") {
          setStatus("success");
        } else {
          setStatus("failed");
        }

        setResult(res.data);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    finalize();
  }, [searchParams]);

  if (status === "processing") {
    return <p className="p-6">Processing payment...</p>;
  }

  if (status === "success") {
    return (
      <div className="p-6 text-green-600">
        <h2 className="text-xl font-bold">Payment Successful 🎉</h2>
        <p>Transaction Ref: {result?.txnReference}</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-red-600">
      <h2 className="text-xl font-bold">Payment Failed ❌</h2>
      <p>{result?.responseText || "Something went wrong"}</p>
    </div>
  );
};

export default PaymentReturn;
