import { ensureCollection } from "./collection";

let initialized = false;

export async function initializeQdrant() {
  if (initialized) {
    return;
  }

  await ensureCollection();

  initialized = true;
}