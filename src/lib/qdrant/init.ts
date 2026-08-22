import { ensureCollection } from "./collection";

let initialized = false;

export async function initializeQdrant() {
  if (initialized) {
    return;
  }

  try {
    await ensureCollection();
    initialized = true;
  } catch (error) {
    console.error(
      "Failed to initialize Qdrant:",
      error
    );
  }
}