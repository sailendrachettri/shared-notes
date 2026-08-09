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
  "resolving public ip via ipify...",
  "opening ssh connection...",
  "authenticating with private key...",
  "updating ufw rules...",
];

const STEP_DELAY_MS = 380;

function timestamp() {
  return new Date().toTimeString().slice(0, 8);
}

function LogLine({ line }) {
  // Unique colour scheme – neon cyan for commands and highlights
  const toneClass =
    line.tone === "success"
      ? "text-primary drop-shadow-[0_0_3px_rgba(0,240,255,0.3)]"
      : line.tone === "error"
      ? "text-[#ff6b8a]"
      : line.tone === "cmd"
      ? "text-primary font-medium"
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

    for (const r of results) {
      await sleep(160);
      if (r.success) {
        pushLine(
          `${r.project}: ${r.message}` + (r.newIp ? `  (ip: ${r.newIp})` : ""),
          "success"
        );
      } else {
        pushLine(`${r.project}: ${r.message}`, "error");
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const allSucceeded = results.length > 0 && successCount === results.length;
    const summary = `${successCount}/${results.length} projects whitelisted successfully.`;

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
        className="w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden border"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }}
      >
        {/* header – unique, minimal, no traffic lights */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#0d1117] border-b border-primary/10">
          <div className="flex items-center gap-3">
            <FiTerminal size={16} className="text-primary" />
            <span className="text-[#b0c4d9] text-sm font-medium tracking-wide">
              {mode === "all"
                ? "WHITELIST · ALL PROJECTS"
                : `WHITELIST · ${project?.projectName?.toUpperCase() || "PROJECT"}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {status === "running" && (
              <FiLoader size={16} className="text-primary animate-spin" />
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-[#2a3a4a] text-[#8a9ba8] hover:border-primary/40 hover:text-primary transition-all duration-200"
            >
              {status === "running" ? "Hide" : "Close"}
              <FiX size={14} />
            </button>
          </div>
        </div>

        {/* terminal output – with scanline texture (optional) */}
        <div
          className="bg-[#0b0e12] p-5 h-[400px] overflow-y-auto text-[13px] custom-scrollbar relative"
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

        {/* footer – subtle status */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#0d1117] border-t border-primary/10">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                status === "running" ? "bg-primary animate-pulse" : "bg-[#3a4a55]"
              }`}
            />
            <span className="text-[#5a6f7e]">
              {status === "running" ? "process active" : "process finished"}
            </span>
          </div>
          <span className="text-[#2a3a4a] text-[10px] tracking-widest">
            {mode === "all" ? "BATCH" : "SINGLE"} · {status === "running" ? "⏳" : "✓"}
          </span>
        </div>
      </div>

      {/* Custom scrollbar – neon cyan */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0b0e12;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00f0ff66;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00f0ffaa;
        }
      `}</style>
    </div>
  );
}