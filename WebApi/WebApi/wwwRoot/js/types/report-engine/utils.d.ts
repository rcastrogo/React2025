import type { SortDirection } from "../types";
import type { SummaryDefinition } from "./types";
export declare function computeSummary<T>(rows: T[], definition?: SummaryDefinition<T>): Record<string, Record<string, number | number[]>>;
export declare function sortBy<T>(array: T[], properties: string | string[], overrideDirection?: SortDirection): T[];
//# sourceMappingURL=utils.d.ts.map