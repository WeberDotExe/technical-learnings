
const scenarios = [
  {
    id: "scenario-1",
    title: "Job Interview",
    category: "career",
    difficulty: "medium",
  },
  {
    id: "scenario-2",
    title: "Salary Negotiation",
    category: "career",
    difficulty: "hard",
  },
  {
    id: "scenario-3",
    title: "Handling an Angry Customer",
    category: "customer-service",
    difficulty: "medium",
  },
];

export async function getAllScenarios() {
  // Simulate fetching data from a database.
  console.log("Fetching scenarios from simulated database...");

  return scenarios;
}

export async function getScenarioById(id) {
  console.log(`Fetching scenario ${id} from simulated database...`);

  return scenarios.find((scenario) => scenario.id === id) ?? null;
}
