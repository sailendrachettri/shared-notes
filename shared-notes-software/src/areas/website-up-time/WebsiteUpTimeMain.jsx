import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiGlobe } from "react-icons/fi";
import { GET_ALL_WEBSITE_TIME_URL } from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";
import { formatePrettyDateTime } from "../../utils/date-time/formatePrettyDateTime";
import Pagination from "../../reusable/paginations/Pagination";

const WebsiteUpTimeMain = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const [pageNo, setPageNo] = useState(1);
  console.log(totalCount);

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
      }, 500);
    }
  };
  useEffect(() => {
    fetchSites();

    const interval = setInterval(fetchSites, 10000);

    return () => clearInterval(interval);
  }, [pageNo, pageSize]);

  return (
    <>
      <section className="bg-white rounded-md overflow-hidden  pb-2 min-h-[90vh] xl:min-h-[93vh] max-h-[70vh] overflow-y-auto">
        <main className="flex-1 flex flex-col xl:min-h-[83vh]">
          <div className="p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">Uptime Monitor</h1>

              <button
                onClick={fetchSites}
                className="flex items-center gap-2 text-sm px-3 py-1.5 border border-slate-200 cursor-pointer rounded-md hover:bg-gray-100"
              >
                <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
                {loading ? "Checking.." : "Check"}
              </button>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-12 text-sm text-gray-500 px-3 pb-2">
              <div className="col-span-4">Website</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Response</div>
              <div className="col-span-4">Last Checked</div>
            </div>

            {/* ROWS */}
            <div className="flex flex-col">
              {sites?.map((site) => (
                <div
                  key={site?.up_Time_Id}
                  className="grid grid-cols-12 items-center px-3 py-3 border-t border-slate-200 hover:bg-gray-50 transition"
                >
                  {/* WEBSITE */}
                  <div className="col-span-4 flex items-center gap-3">
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
                  <div className="col-span-2">
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

                  {/* RESPONSE TIME */}
                  <div className="col-span-2 text-sm text-gray-600">
                    {site?.response_Time_Ms
                      ? `${site?.response_Time_Ms} ms`
                      : "--"}
                  </div>

                  {/* LAST CHECKED */}
                  <div className="col-span-4 text-sm text-gray-500">
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
