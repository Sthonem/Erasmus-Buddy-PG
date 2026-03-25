import BottomNav from "@/components/shared/BottomNav";

const tasks = [
  { id: 1, title: "PESEL Application", desc: "Legal ID number", badge: "Day 1-3", critical: true, done: false },
  { id: 2, title: "Open Bank Account", desc: "PKO BP or Santander", badge: "Day 3-7", critical: true, done: false },
  { id: 3, title: "ZUS Registration", desc: "Health insurance", badge: "Day 1-7", critical: true, done: false },
  { id: 4, title: "SIS Course Selection", desc: "Choose your courses", badge: "Week 2", critical: false, done: false },
  { id: 5, title: "Student ID Card", desc: "Collect from dean's office", badge: "Week 2", critical: false, done: false },
  { id: 6, title: "Email Setup", desc: "PG student email", badge: "Done", critical: false, done: true },
  { id: 7, title: "Accommodation Check-in", desc: "Dorm registration", badge: "Done", critical: false, done: true },
  { id: 8, title: "SIS First Login", desc: "Activate your account", badge: "Done", critical: false, done: true },
];

export default function Tasks() {
  const critical = tasks.filter(t => t.critical && !t.done);
  const upcoming = tasks.filter(t => !t.critical && !t.done);
  const completed = tasks.filter(t => t.done);
  const progress = Math.round((completed.length / tasks.length) * 100);

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--pg-light)" }}>

      {/* Top Bar */}
      <div className="px-5 pt-8 pb-5" style={{ background: "var(--pg-navy)" }}>
        <h1 className="text-white text-2xl font-bold">My Tasks</h1>
        <p className="text-blue-200 text-xs mt-1">First 2 weeks checklist</p>
        <div className="mt-4 bg-white/10 rounded-2xl p-3">
          <div className="flex justify-between mb-2">
            <span className="text-white text-xs">{completed.length} of {tasks.length} completed</span>
            <span className="text-white text-xs font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--pg-teal)" }}/>
          </div>
        </div>
      </div>

      {/* Critical */}
      <div className="px-5 mt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#C8102E" }}>
          Critical — Do immediately
        </h2>
        {critical.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Upcoming */}
      <div className="px-5 mt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#888" }}>
          Academic
        </h2>
        {upcoming.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Completed */}
      <div className="px-5 mt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#00A693" }}>
          Completed
        </h2>
        {completed.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <BottomNav />
    </main>
  );
}

function TaskCard({ task }: { task: typeof tasks[0] }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-white border"
      style={{ borderColor: "#e5e7eb", opacity: task.done ? 0.5 : 1 }}>

      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: task.done ? "var(--pg-teal)" : "transparent",
          border: task.done ? "none" : `1.5px solid ${task.critical ? "#C8102E" : "#ccc"}`
        }}>
        {task.done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{task.title}</p>
        <p className="text-xs" style={{ color: "#888" }}>{task.desc}</p>
      </div>

      <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
        style={{
          background: task.badge === "Done" ? "#E0F5F3" :
                      task.critical ? "#FBEAED" : "#F5F6F8",
          color: task.badge === "Done" ? "#00A693" :
                 task.critical ? "#C8102E" : "#888"
        }}>
        {task.badge}
      </span>
    </div>
  );
}