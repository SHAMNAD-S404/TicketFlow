import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getErrMssg from "@/components/utility/getErrMssg";
import { fetchPurchaseHistory } from "@/api/services/subscriptionService";
import { FaHistory } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RowsSkelton } from "@/components/common/RowsSkelton";

interface IPurchaseHistoryData {
  purchaseDate: string;
  plan: string;
  amount: string;
  stripeSessionId: string;
}

const PurchaseHistory: React.FC = () => {
  const navigate = useNavigate();

  //component states
  const [purchaseHistory, setPurchaseHistory] = useState<IPurchaseHistoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // navigation link to go to the payment details page
  const gotoPaymentDeailsPage = (id: string) => {
    navigate(`/company/dashboard/payment/success?session_id=${id}`);
  };
  const handleBack = () => {
    navigate("/company/dashboard/subscription");
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetchPurchaseHistory();
        if (response.data) {
          setPurchaseHistory(response.data);
        }
      } catch (error: any) {
        toast.error(getErrMssg(error));
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);

  return (
    <>
      <header>
        <div className="flex justify-between items-center mt-8 ">
          <div
            className="text-2xl bg-white px-4 py-2 rounded-2xl shadow-lg shadow-gray-400 hover:bg-blue-300"
            onClick={handleBack}>
            <IoMdArrowRoundBack />{" "}
          </div>
          <div>
            <h1 className="text-center font-semibold text-2xl mt-3 underline underline-offset-2 ">Purchase History</h1>
          </div>
          <div>{""}</div>
        </div>

        <div className="  space-y-4 mt-4 px-8  ">
          <div
            className={`bg-blue-100 rounded-2xl font-semibold px-6 py-4 grid grid-cols-4 gap-4  items-center shadow-lg hover:shadow-xl  transition-transform ease-in-out duration-500 `}>
            <div>Purchase Date</div>
            <div className="flex items-center gap-3">Purchase Plan</div>
            <div className="">Amount</div>

            <div className="flex justify-center">View Details</div>
          </div>
        </div>
      </header>
      <main>
        {loading ? (
          <RowsSkelton lengthNo={5} />
        ) : purchaseHistory.length === 0 ? (
          // Show "no history" message
          <div>
            <div className="flex items-center gap-2 justify-center  text-center mt-10 text-gray-500 font-medium text-xl ">
              You have no purchase history. <FaHistory />
            </div>
            <div
              className="text-center text-blue-500 text-sm underline cursor-pointer hover:font-semibold"
              onClick={handleBack}>
              click here to purchase
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-8 px-8  ">
            {purchaseHistory.map((payment, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl font-semibold px-6 py-4 md:py-6 grid grid-cols-4 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 `}>
                <div>{payment.purchaseDate}</div>
                <div className="flex items-center gap-3 text-blue-600">{payment.plan}</div>
                <div className=""> ₹ {payment.amount}</div>

                {/* ticket view and manage */}
                <div className="flex justify-center">
                  <button onClick={() => gotoPaymentDeailsPage(payment.stripeSessionId)}>
                    <FaEye className="hover:text-blue-500 text-xl" />{" "}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default PurchaseHistory;
