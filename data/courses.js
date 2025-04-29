// Simple mock course data for seeding
const courses = [
  // Foundational
  {
    id: "CS101",
    name: "Intro to Programming",
    prerequisites: [],
    tags: ["programming", "foundations"],
  },
  {
    id: "MA101",
    name: "Calculus I",
    prerequisites: [],
    tags: ["math", "calculus"],
  },
  {
    id: "EN101",
    name: "English Composition",
    prerequisites: [],
    tags: ["writing", "humanities"],
  },

  // Core CS
  {
    id: "CS201",
    name: "Data Structures",
    prerequisites: ["CS101"],
    tags: ["programming", "algorithms", "data structures"],
  },
  {
    id: "CS250",
    name: "Computer Organization",
    prerequisites: ["CS101"],
    tags: ["hardware", "systems"],
  },
  {
    id: "CS301",
    name: "Algorithms",
    prerequisites: ["CS201", "MA101"],
    tags: ["algorithms", "theory", "programming"],
  },
  {
    id: "CS350",
    name: "Operating Systems",
    prerequisites: ["CS201", "CS250"],
    tags: ["systems", "programming", "os"],
  },

  // Math/Stats
  {
    id: "MA201",
    name: "Calculus II",
    prerequisites: ["MA101"],
    tags: ["math", "calculus"],
  },
  {
    id: "ST210",
    name: "Intro to Statistics",
    prerequisites: ["MA101"],
    tags: ["math", "statistics", "data"],
  },

  // Electives
  {
    id: "CS410",
    name: "Web Development",
    prerequisites: ["CS201"],
    tags: ["web", "programming", "development", "frontend", "backend"],
  },
  {
    id: "CS420",
    name: "Database Systems",
    prerequisites: ["CS201"],
    tags: ["database", "data", "sql", "nosql", "systems"],
  },
  {
    id: "CS430",
    name: "Artificial Intelligence",
    prerequisites: ["CS301"],
    tags: ["ai", "algorithms", "programming", "intelligence"],
  },
  {
    id: "CS440",
    name: "Machine Learning",
    prerequisites: ["CS301", "ST210"],
    tags: ["ai", "machine learning", "data", "statistics", "algorithms"],
  },
  {
    id: "HU300",
    name: "Ethics in Technology",
    prerequisites: ["EN101"],
    tags: ["humanities", "ethics", "technology", "society"],
  },
];

module.exports = courses;
