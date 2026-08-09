import { useState, useEffect, useRef } from "react";
import {
  FiTerminal,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { axiosInstance } from "../../api/axios";
import {
  ALL_WHITELIST_IP_URL,
  SINGLE_WHITELIST_IP_BY_ID_URL,
} from "../../api/api_routes";

// Cosmetic steps streamed while the real request is in flight, so the
// wait reads like a script running rather than a bare spinner. The
// actual success/failure always comes from the API response below.
const STEPS = [
  "Fetching the current public IP address via ipify...",
  "Opening ssh connection...",
  "Authenticating with private key...",
  "Updating UFW rules...",
];

const STEP_DELAY_MS = 1380;
const RESULT_DELAY_MS = 1050; // Delay between each project result

function timestamp() {
  return new Date().toTimeString().slice(0, 8);
}

function LogLine({ line }) {
  // Using theme colours
  const toneClass =
    line.tone === "success"
      ? "text-green-600 drop-shadow-[0_0_4px_rgba(210,85,100,0.3)]"
      : line.tone === "error"
      ? "text-[#ff6b8a]"
      : line.tone === "cmd"
      ? "text-green-600 font-medium"
      : "text-[#8a9ba8]";

  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="text-[#3a4a55] select-none shrink-0">{line.time}</span>
      <span className={`${toneClass} whitespace-pre-wrap break-all`}>
        {line.tone === "cmd" ? "❯ " : "  "}
        {line.text}
      </span>
    </div>
  );
}

/**
 * mode: "single" | "all"
 * project: { ipWhitelistId, projectName } - required when mode is "single"
 * onClose: () => void
 * onComplete: (success: boolean, summaryMessage: string) => void
 */
export default function IpWhitelistTerminal({ mode, project, onClose, onComplete }) {
  const [log, setLog] = useState([]);
  const [status, setStatus] = useState("running");
  const logEndRef = useRef(null);
  const isMountedRef = useRef(true);
  const hasRunRef = useRef(false);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const pushLine = (text, tone = "info") => {
    if (!isMountedRef.current) return;
    setLog((prev) => [
      ...prev,
      { text, tone, time: timestamp(), key: `${Date.now()}-${Math.random()}` },
    ]);
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    if (mode === "single") runSingle();
    else if (mode === "all") runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSingle = async () => {
    const label = project?.projectName ?? "unknown project";
    pushLine(`./whitelist-ip.sh --project="${label}"`, "cmd");

    const stepPromise = (async () => {
      for (const step of STEPS) {
        await sleep(STEP_DELAY_MS);
        pushLine(step);
      }
    })();

    let data = null;
    let requestError = null;

    try {
      const res = await axiosInstance.post(
        `${SINGLE_WHITELIST_IP_BY_ID_URL}/${project.ipWhitelistId}`
      );
      data = res?.data;
    } catch (err) {
      requestError =
        err?.response?.data?.message || err?.message || "Request failed.";
    }

    await stepPromise;

    if (requestError) {
      pushLine(requestError, "error");
      finish(false, requestError);
      return;
    }

    if (data?.success) {
      const line = data.message + (data.newIp ? `  (ip: ${data.newIp})` : "");
      pushLine(line, "success");
      finish(true, data.message);
    } else {
      pushLine(data?.message || "Whitelist failed.", "error");
      finish(false, data?.message || "Whitelist failed.");
    }
  };

  const runAll = async () => {
    pushLine("./whitelist-ip.sh --all", "cmd");

    const stepPromise = (async () => {
      for (const step of STEPS) {
        await sleep(STEP_DELAY_MS);
        pushLine(step);
      }
    })();

    let data = null;
    let requestError = null;

    try {
      const res = await axiosInstance.post(ALL_WHITELIST_IP_URL);
      data = res?.data;
    } catch (err) {
      requestError =
        err?.response?.data?.message || err?.message || "Request failed.";
    }

    await stepPromise;

    if (requestError) {
      pushLine(requestError, "error");
      finish(false, requestError);
      return;
    }

    const results = data?.results || [];

    // Show each project result with a delay, line by line
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      
      // Add a small delay between each result (except the first one)
      if (i > 0) {
        await sleep(RESULT_DELAY_MS);
      }
      
      if (r.success) {
        pushLine(
          `${r.project}: ${r.message}` + (r.newIp ? `  (ip: ${r.newIp})` : ""),
          "success"
        );
      } else {
        pushLine(`${r.project}: ${r.message}`, "error");
      }
    }

    // Add a small delay before showing the summary
    if (results.length > 0) {
      await sleep(RESULT_DELAY_MS);
    }

    const successCount = results.filter((r) => r.success).length;
    const allSucceeded = results.length > 0 && successCount === results.length;
    const summary = `${successCount}/${results.length} Projects whitelisted successfully.`;

    pushLine(summary, allSucceeded ? "success" : "error");
    finish(allSucceeded, summary);
  };

  const finish = (success, summaryMessage) => {
    if (!isMountedRef.current) return;
    setStatus("done");
    onComplete?.(success, summaryMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }}
      >
        {/* header – using secondary for background */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#2f2f4a] border-b border-green-text-green-600/20">
          <div className="flex items-center gap-3">
            <FiTerminal size={16} className="text-green-600" />
            <span className="text-[#d0d0e0] text-sm font-medium tracking-wide">
              {mode === "all"
                ? "WHITELIST · ALL PROJECTS"
                : `WHITELIST · ${project?.projectName?.toUpperCase() || "PROJECT"}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {status === "running" && (
              <FiLoader size={16} className="text-green-600 animate-spin" />
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center cursor-pointer gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-[#5a5a70] text-[#b0b0c0] hover:border-green-text-green-600 transition-all duration-200"
            >
              {status === "running" ? "Hide" : "Close"}
              <FiX size={14} />
            </button>
          </div>
        </div>

        {/* terminal output – with scanline texture */}
        <div
          className="bg-[#1a1a2a] p-5 h-[400px] overflow-y-auto text-[13px] custom-scrollbar relative"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px)",
          }}
        >
          {log.map((line) => (
            <LogLine key={line.key} line={line} />
          ))}
          <div ref={logEndRef} />
        </div>

        {/* footer – secondary background */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#2f2f4a] border-t border-green-text-green-600/20">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                status === "running" ? "bg-green-600 animate-pulse" : "bg-[#5a5a70]"
              }`}
            />
            <span className="text-[#a0a0b8]">
              {status === "running" ? "Process active" : "Process finished"}
            </span>
          </div>
          <span className="text-[#5a5a70] text-[10px] tracking-widest">
            {mode === "all" ? "BATCH" : "SINGLE"} · {status === "running" ? "⏳" : "✓"}
          </span>
        </div>
      </div>

      {/* Custom scrollbar – green-text-green-600 colour */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a2a3e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d25564aa;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d25564;
        }
      `}</style>
    </div>
  );
}