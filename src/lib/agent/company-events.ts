import fs from "node:fs/promises";
import path from "node:path";

export interface CompanyEvent {
  title: string;
  description: string;
  date: string;
}

interface CompanyEventsData {
  events: CompanyEvent[];
}

export async function getCompanyEvents(): Promise<CompanyEvent[]> {
  try {
    const filePath = path.join(
      process.cwd(),
      "documents",
      "company-events.json"
    );

    const content =
      await fs.readFile(
        filePath,
        "utf8"
      );

    const data =
      JSON.parse(
        content
      ) as CompanyEventsData;

    if (!Array.isArray(data.events)) {
      return [];
    }

    return data.events;
  } catch (error) {
    console.error(
      "Failed to load company events:",
      error
    );

    return [];
  }
}