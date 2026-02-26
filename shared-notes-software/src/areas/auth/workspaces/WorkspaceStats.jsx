import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const WorkspaceStats = ({ columns, tasks }) => {
  const [stats, setStats] = useState({
    todo: 0,
    inProgress: 0,
    done: 0,
  });

  useEffect(() => {
    if (!columns?.length) return;

    const totalTasks = tasks.length;
    if (!totalTasks) {
      setStats({});
      return;
    }

    const countMap = {};

    // Count tasks per column
    tasks.forEach((task) => {
      countMap[task.statusId] = (countMap[task.statusId] || 0) + 1;
    });

    const percentages = {};

    columns.forEach((col) => {
      const count = countMap[col.id] || 0;
      percentages[col.label] = Math.round((count / totalTasks) * 100);
    });

    setStats(percentages);
  }, [tasks, columns]);

  return (
    <>
      <section>
        {/* ─── Minimal Stats Strip ───────────────────────────── */}
        {Object.keys(stats)?.length > 0 && (
          <div className="grid grid-cols-1">
            <div className="text-xs flex flex-wrap items-center gap-2 text-slate-400 font-medium">
              {columns.map((col, index) => {
                const percentage = stats[col.label] ?? 0;

                return (
                  <React.Fragment key={col.id}>
                    <span className="flex items-center gap-1">
                      <span
                        className="font-semibold"
                        style={{ color: col.accent }}
                      >
                        {col.label}
                      </span>
                      <span>{percentage}%</span>
                    </span>

                    {index !== columns.length - 1 && (
                      <span className="opacity-40">•</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default WorkspaceStats;
