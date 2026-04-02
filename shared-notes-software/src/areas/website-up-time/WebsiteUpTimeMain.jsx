import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiGlobe } from "react-icons/fi";
import { GET_ALL_WEBSITE_TIME_URL } from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";
import {
  formatDate,
  formatePrettyDateTime,
} from "../../utils/date-time/formatePrettyDateTime";
import Pagination from "../../reusable/paginations/Pagination";
import { IoMdTime } from "react-icons/io";
import SearchInput from "../../reusable/inputs/SearchInput";

const WebsiteUpTimeMain = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(8);

  const [pageNo, setPageNo] = useState(1);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const payload = {
        SearchText: searchText,
        PageNo: pageNo,
        PageSize: pageSize,
      };
      const res = await axiosInstance.post(GET_ALL_WEBSITE_TIME_URL, payload);
      console.log(res);
      setTotalCount(res?.data?.totalCount || 0);

      setSites(res?.data?.data);
    } catch (err) {
      console.error("Error fetching sites", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };
  useEffect(() => {
    fetchSites();

    const interval = setInterval(fetchSites, 10000);

    return () => clearInterval(interval);
  }, [pageNo, pageSize, searchText]);

  return (
    <>
      <section className="bg-white rounded-md overflow-hidden  pb-2 min-h-[90vh] xl:min-h-[93vh] max-h-[70vh] overflow-y-auto">
        <main className="flex-1 flex flex-col xl:min-h-[83vh]">
          <div className="p-3">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center flex-nowrap gap-x-2">
                <div className="bg-primary rounded-xl p-2 text-white">
                  <IoMdTime size={30} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Uptime Monitor</h1>
                  <div className="text-sm text-slate-600 ps-1">
                    By SharedNotes
                  </div>
                </div>
              </div>

              <div className="p-4">
                <SearchInput
                  value={searchText}
                  onChange={setSearchText}
                  onClear={() => setSearchText("")}
                  placeholder="Search websites..."
                  className="w-80"
                />
              </div>

              <div className="w-36">
                <button
                  onClick={fetchSites}
                  className="flex items-center justify-center gap-2 text-sm px-3 py-1.5 border border-slate-200 cursor-pointer rounded-md hover:bg-gray-100"
                >
                  <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
                  {loading ? "Checking.." : "Check"}
                </button>
              </div>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-12 text-sm text-gray-500 px-3 pb-2">
              <div className="col-span-1">Sl No.</div>
              <div className="col-span-3">Website</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">SSL Status</div>
              <div className="col-span-2">Response</div>
              <div className="col-span-3">Last Checked</div>
            </div>

            {/* ROWS */}
            <div className="flex flex-col">
              {sites?.map((site, index) => (
                <div
                  key={site?.up_Time_Id}
                  className="grid grid-cols-12 items-center px-3 py-3 border-t border-slate-200 hover:bg-gray-50 transition"
                >
                  {/* Sl No. */}
                  <div className="col-span-1">
                    <p className="text-slate-600">{index + 1}</p>
                  </div>

                  {/* WEBSITE */}
                  <div className="col-span-3 flex items-center gap-3">
                    <FiGlobe className="text-gray-400" />

                    <div>
                      <p className="font-medium">{site?.site_Name}</p>
                      <a
                        href={site?.url}
                        target="_blank"
                        className="text-xs text-gray-500 truncate hover:text-primary"
                      >
                        {site?.url}
                      </a>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="col-span-1">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        site?.last_Status
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {site?.last_Status ? "UP" : "DOWN"}
                    </span>
                  </div>

                  {/* SSL */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full ${
                        site?.ssl_Valid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {/* Dot */}
                      <span
                        className={`w-2 h-2 rounded-full ${
                          site?.ssl_Valid ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>

                      {/* Text */}
                      {site?.ssl_Valid
                        ? `Valid till ${
                            site?.ssl_Expires_At
                              ? formatDate(site.ssl_Expires_At)
                              : "N/A"
                          }`
                        : "Expired"}
                    </span>
                  </div>

                  {/* RESPONSE TIME */}
                  <div className="col-span-2 text-sm text-gray-600">
                    {site?.response_Time_Ms
                      ? `${site?.response_Time_Ms} ms`
                      : "--"}
                  </div>

                  {/* LAST CHECKED */}
                  <div className="col-span-3 text-sm text-gray-500">
                    {site?.last_Checked_At
                      ? formatePrettyDateTime(site?.last_Checked_At)
                      : "--"}
                  </div>
                </div>
              ))}

              {/* EMPTY STATE */}
              {sites.length === 0 && !loading && (
                <div className="text-center text-gray-400 py-10">
                  No websites added yet
                </div>
              )}
            </div>
          </div>
        </main>
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(page) => setPageNo(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageNo(1); // reset page
          }}
        />
      </section>
    </>
  );
};

export default WebsiteUpTimeMain;
