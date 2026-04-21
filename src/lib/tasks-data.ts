export const TASKS = [
  { slug: "pesel",         title: "PESEL Application",         desc: "Legal ID number",                badge: "Day 1-3",  critical: true  },
  { slug: "bank",          title: "Open Bank Account",         desc: "PKO BP or Santander",            badge: "Day 3-7",  critical: true  },
  { slug: "zus",           title: "ZUS Registration",          desc: "Health insurance",               badge: "Day 1-7",  critical: true  },
  { slug: "ola",           title: "Online Learning Agreement", desc: "Submit OLA before deadline",     badge: "Week 1",   critical: true  },
  { slug: "sis-courses",   title: "SIS Course Selection",      desc: "Choose your courses",            badge: "Week 2",   critical: false },
  { slug: "student-id",    title: "Student ID Card",           desc: "Collect from dean's office",    badge: "Week 2",   critical: false },
  { slug: "email",         title: "Email Setup",               desc: "PG student email",              badge: "Week 1",   critical: false },
  { slug: "accommodation", title: "Accommodation Check-in",    desc: "Dorm registration",             badge: "Day 1",    critical: false },
  { slug: "sis-login",     title: "SIS First Login",           desc: "Activate your account",         badge: "Day 1",    critical: false },
];

export type Task = typeof TASKS[0];
