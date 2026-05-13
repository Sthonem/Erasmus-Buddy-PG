export const TASKS = [
  { slug: "pesel",         badgeKey: "task.badge.day1-3",  critical: true  },
  { slug: "bank",          badgeKey: "task.badge.day3-7",  critical: true  },
  { slug: "zus",           badgeKey: "task.badge.day1-7",  critical: true  },
  { slug: "ola",           badgeKey: "task.badge.week1",   critical: true  },
  { slug: "sis-courses",   badgeKey: "task.badge.week2",   critical: false },
  { slug: "student-id",    badgeKey: "task.badge.week2",   critical: false },
  { slug: "email",         badgeKey: "task.badge.week1",   critical: false },
  { slug: "accommodation", badgeKey: "task.badge.day1",    critical: false },
  { slug: "sis-login",     badgeKey: "task.badge.day1",    critical: false },
] as const;

export type Task = typeof TASKS[number];
