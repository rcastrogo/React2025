import type { ReportModuleLoader } from './report-engine/types';
export declare function setupReports(reports: Record<string, ReportModuleLoader>): void;
export declare function getReport(name: string): ReportModuleLoader | undefined;
//# sourceMappingURL=report-registry.d.ts.map