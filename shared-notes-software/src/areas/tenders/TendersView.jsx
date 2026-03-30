import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axios";
import {
  FETCH_LATEST_TENDERS_URL,
  VIEW_TENDER_IN_OFFICIAL_PORTAL_URL,
} from "../../api/api_routes";
import ViewFullTenderDetails from "./ViewFullTenderDetails";

import { MdOutlineDescription } from "react-icons/md";
import { FiCalendar, FiClock, FiExternalLink, FiSearch } from "react-icons/fi";
import { formatDate } from "../../utils/date-time/formatePrettyDateTime";
import { customToast } from "../../utils/toast/toastConfig";
import MainLayout from "../../reusable/layouts/MainLayout";

const isExpiringSoon = (dateStr) => {
  if (!dateStr) return false;
  const lastDate = new Date(dateStr);
  const today = new Date();
  const diffDays = (lastDate - today) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 5;
};

const isExpired = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

const StatusBadge = ({ lastDate }) => {
  if (isExpired(lastDate)) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
        Expired
      </span>
    );
  }
  if (isExpiringSoon(lastDate)) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
        Closing Soon
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
      Active
    </span>
  );
};

const TendersView = () => {
  const [latestTenders, setLatestTenders] = useState([]);
  const [showFullDetail, setShowFullDetails] = useState(false);
  const [selectedTenderUnqId, setSelectedTenderUnqId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [generatingLink, setGeneratingLink] = useState(false);

  const handleFetchLatestTenders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(FETCH_LATEST_TENDERS_URL);
      if (res?.status === 200) {
        setLatestTenders(res?.data || []);
      }
    } catch (error) {
      console.error("not able to fetch latest tenders details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOfficialLink = async (id) => {
    console.log(id);
    setGeneratingLink(true);
    try {
      const res = await axiosInstance.get(
        `${VIEW_TENDER_IN_OFFICIAL_PORTAL_URL}/${id}`,
      );
      console.log(res);
      if (res?.status == 200) {
        customToast.success("Redirectring you in to the official portal");
        console.log(res?.data?.sessionUrl);
        openTender(res?.data?.sessionUrl);
        return;
      } else {
        customToast.error("Can't generate link at the moment");
      }
    } catch (error) {
      customToast.error("Something went wrong");
    } finally {
      setGeneratingLink(false);
    }
  };

  const openTender = (url) => {
    const win = window.open("about:blank", "_blank");
    console.log(win);

    // Step 1: restart session
    win.location.href =
      "https://www.sikkimtender.gov.in/nicgep/app?service=restart";

    // Step 2: after delay, go to tender
    setTimeout(() => {
      win.location.href = url;
    }, 4000);

    return;
  };

  useEffect(() => {
    handleFetchLatestTenders();
  }, []);

  const filtered = latestTenders.filter(
    (t) =>
      !search ||
      t?.title?.toLowerCase().includes(search.toLowerCase()) ||
      t?.refNo?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <MainLayout
        sidebar={<section></section>}
        content={
          <section className="relative flex flex-col h-full min-h-0 select-none">
            {!showFullDetail && (
              <div className="p-3 overflow-y-auto">
                {/* Page Header */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                      Latest Tenders
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {filtered.length} tender{filtered.length !== 1 ? "s" : ""}{" "}
                      available
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search by title or ref…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-12 text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="col-span-6">Title</div>
                    {/* <div className="col-span-2">Reference</div> */}
                    <div className="col-span-2">Published</div>
                    <div className="col-span-2">Closing</div>
                    <div className="col-span-1">Status</div>
                    {/* <div className="col-span-1">Socurce</div> */}
                    <div className="col-span-1 text-right">Action</div>
                  </div>

                  {/* Rows */}
                  {loading ? (
                    <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Loading tenders…</span>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
                      <MdOutlineDescription className="text-3xl text-gray-300" />
                      <span className="text-sm">No tenders found</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {filtered.map((tender, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-blue-50/40 transition-colors group"
                        >
                          {/* Title */}
                          <div className="col-span-6 flex items-start gap-2.5 min-w-0 pr-4">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-600 leading-snug ">
                                {tender?.title}
                              </p>
                              {tender?.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {tender.tags.slice(0, 2).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {tender.tags.length > 2 && (
                                    <span className="text-[10px] text-gray-400">
                                      +{tender.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Ref */}
                          {/* <div className="col-span-2 font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
                      {tender?.refNo || "—"}
                    </div> */}

                          {/* Published */}
                          <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-500">
                            <FiCalendar className="text-gray-400 shrink-0" />
                            <span>
                              {formatDate(tender?.published_Date) || "—"}
                            </span>
                          </div>

                          {/* Last Date */}
                          <div
                            className={`col-span-2 flex items-center gap-1.5 text-xs ${isExpiringSoon(tender?.last_Date) ? "text-amber-600 font-medium" : isExpired(tender?.last_Date) ? "text-red-400" : "text-gray-500"}`}
                          >
                            <FiClock className="shrink-0" />
                            <span>{formatDate(tender?.last_Date) || "—"}</span>
                          </div>

                          {/* Status */}
                          <div className="col-span-1">
                            <StatusBadge lastDate={tender?.last_Date} />
                          </div>

                          {/* <div className="col-span-1">
                            <button
                              onClick={() => {
                                handleGenerateOfficialLink(
                                  tender?.tenderUniqueId,
                                );
                                setSelectedTenderUnqId(tender?.tenderUniqueId);
                              }}
                              className="text-xs bg-primary/5 text-primary font-medium px-2 py-1 rounded-md cursor-pointer"
                            >
                              {generatingLink &&
                              selectedTenderUnqId == tender?.tenderUniqueId
                                ? "Generating..."
                                : "Generate Link"}
                            </button>
                          </div> */}

                          {/* Action */}
                          <div className="col-span-1 text-right">
                            <button
                              onClick={() => {
                                setSelectedTenderUnqId(tender?.tenderUniqueId);
                                setShowFullDetails(true);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 cursor-pointer opacity-100 transition-opacity bg-primary/10 hover:bg-primary/15 px-2.5 py-1.5 rounded-md"
                            >
                              Read More
                              {/* <FiExternalLink className="text-[10px]" /> */}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {showFullDetail && (
              <ViewFullTenderDetails
                tenderUniqueId={selectedTenderUnqId}
                onClose={() => setShowFullDetails(false)}
              />
            )}
          </section>
        }
      />
    </>
  );
};

export default TendersView;
