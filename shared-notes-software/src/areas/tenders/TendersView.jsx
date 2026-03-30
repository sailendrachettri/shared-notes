import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axios";
import {
  FETCH_LATEST_TENDERS_URL,
  SYNC_TENDERS_URL,
  VIEW_TENDER_IN_OFFICIAL_PORTAL_URL,
} from "../../api/api_routes";
import ViewFullTenderDetails from "./ViewFullTenderDetails";

import { MdOutlineDescription } from "react-icons/md";
import { FiCalendar, FiClock, FiSearch } from "react-icons/fi";
import { formatDate } from "../../utils/date-time/formatePrettyDateTime";
import { customToast } from "../../utils/toast/toastConfig";
import LoadingPageSoft from "../../utils/info-screen/LoadingPageSoft";
import { IoSync } from "react-icons/io5";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";

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
  const [syncing, setSyncing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSyncTenders = async () => {
    setSyncing(true);
    try {
      const res = await axiosInstance.post(SYNC_TENDERS_URL);

      if (res?.data?.count > 0) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("not able to fetch tenders", error);
      customToast.error("Can't sync tenders at the moment");
    } finally {
      setSyncing(false);
      setTimeout(() => {
        setSuccess(false);
        handleFetchLatestTenders();
      }, 5000);
    }
  };

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
    setGeneratingLink(true);
    try {
      const res = await axiosInstance.get(
        `${VIEW_TENDER_IN_OFFICIAL_PORTAL_URL}/${id}`,
      );

      if (res?.status == 200) {
        customToast.success("Redirectring you in to the official portal");

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
      <section className="h-full flex gap-3 bg-slate-100 font-sans text-slate-800">
        {/* Main */}
        <main className="flex-1 flex flex-col bg-white rounded-md overflow-hidden mb-10 pb-2">
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

                <div>
                  {success ? (
                    <div className="flex items-center text-xs gap-2 text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-md">
                      <FiCheckCircle size={16} />
                      <span className="font-medium">Synced successfully</span>
                    </div>
                  ) : (
                    <button
                      className={`${syncing ? "text-slate-600 bg-slate-200 cursor-default" : "bg-primary/5 text-primary cursor-pointer"} text-xs rounded-md px-3 py-1`}
                      onClick={() => {
                        handleSyncTenders();
                      }}
                    >
                      {syncing ? (
                        <span className="flex flex-nowrap gap-x-1 items-center">
                          {/* <IoSync className="animate-spin" size={20} />  */}
                          Syncing{" "}
                          <span className="sync-loader pt-2">
                            <span></span>
                            <span></span>
                            <span></span>
                          </span>
                        </span>
                      ) : (
                        "Sync Tenders"
                      )}
                    </button>
                  )}
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
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="col-span-6">Title</div>
                  {/* <div className="col-span-2">Reference</div> */}
                  <div className="col-span-2">Published</div>
                  <div className="col-span-2">Closing</div>
                  <div className="col-span-1">Status</div>
                  {/* <div className="col-span-1">Source</div> */}
                  <div className="col-span-1 text-right">Action</div>
                </div>

                {/* Rows */}
                {loading ? (
                  <div className="h-full">
                    <LoadingPageSoft />
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
                            className="inline-flex items-center gap-1 text-xs text-nowrap font-medium text-primary hover:text-primary/80 cursor-pointer opacity-100 transition-opacity bg-primary/10 hover:bg-primary/15 px-2.5 py-1.5 rounded-md"
                          >
                            Read more
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
        </main>
      </section>
    </>
  );
};

export default TendersView;
