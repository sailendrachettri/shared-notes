import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axios";
import { TENDERS_FULL_DETAILS_URL } from "../../api/api_routes";
import {
  MdOutlineBusiness,
  MdOutlineAttachMoney,
  MdOutlineDateRange,
  MdOutlineDescription,
} from "react-icons/md";
import LoadingPageSoft from "../../utils/info-screen/LoadingPageSoft";

const ViewFullTenderDetails = ({ tenderUniqueId, onClose }) => {
  const [fullDetails, setFullDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const handleGetFullTenderDetails = async () => {
    try {
      const res = await axiosInstance.get(
        `${TENDERS_FULL_DETAILS_URL}/${tenderUniqueId}`,
      );
      if (res?.status === 200) {
        setFullDetails(res?.data || {});
      }
    } catch (error) {
      console.log("not able to get the full tender data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenderUniqueId) handleGetFullTenderDetails();
  }, [tenderUniqueId]);

  const f = fullDetails?.fields || {};

  const Row = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200">
      <span className="text-gray-500">{label}</span>
      <span className="col-span-2 text-gray-800 font-medium break-words">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <>
      <section className="w-full h-full flex flex-col">
        {loading ? (
          <LoadingPageSoft />
        ) : (
          <section>
            {/* HEADER */}
            <div className="flex justify-between items-start border-b">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  {f?.Title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tender ID: {f?.["Tender ID"]}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* 🏢 Organisation */}
              <Section title="Organisation" icon={<MdOutlineBusiness />}>
                <Row
                  label="Organisation Chain"
                  value={f?.["Organisation Chain"]}
                />
                <Row label="Department" value={f?.Name} />
                <Row label="Address" value={f?.Address} />
              </Section>

              {/* 💰 Financial */}
              <Section
                title="Financial Details"
                icon={<MdOutlineAttachMoney />}
              >
                <Row label="Tender Fee" value={`₹ ${f?.["Tender Fee in ₹"]}`} />
                <Row label="EMD Amount" value={`₹ ${f?.["EMD Amount in ₹"]}`} />
                <Row label="Payment Mode" value={f?.["Payment Mode"]} />
                <Row label="Fee Payable To" value={f?.["Fee Payable To"]} />
              </Section>

              {/* 📅 Dates */}
              <Section title="Important Dates" icon={<MdOutlineDateRange />}>
                <Row label="Published Date" value={f?.["Published Date"]} />
                <Row label="Bid Opening" value={f?.["Bid Opening Date"]} />
                <Row
                  label="Submission Start"
                  value={f?.["Bid Submission Start Date"]}
                />
                <Row
                  label="Submission End"
                  value={f?.["Bid Submission End Date"]}
                />
                <Row
                  label="Pre-Bid Meeting"
                  value={f?.["Pre Bid Meeting Date"]}
                />
              </Section>

              {/* 📄 Work Details */}
              <Section title="Work Details" icon={<MdOutlineDescription />}>
                <Row label="Category" value={f?.["Product Category"]} />
                <Row label="Tender Type" value={f?.["Tender Type"]} />
                <Row label="Contract Type" value={f?.["Form Of Contract"]} />
                <Row
                  label="Work Period"
                  value={`${f?.["Period Of Work(Days)"]} Days`}
                />
                <Row label="Location" value={f?.Location} />
                <Row label="Description" value={f?.["Work Description"]} />
              </Section>
            </div>
          </section>
        )}
      </section>
    </>
  );
};

const Section = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-primary text-lg">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>

    <div className="bg-gray-50 rounded-xl p-4">{children}</div>
  </div>
);

export default ViewFullTenderDetails;
