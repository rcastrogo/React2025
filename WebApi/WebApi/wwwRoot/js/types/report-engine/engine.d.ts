import type { Mediator, ReportDefinition } from "./types";
export default class ReportEngine<T> {
    generateReport(rd: ReportDefinition<T>, data: T[], mediator: Mediator): void;
    loadFromText(code: string): any;
    loadExternalReport(path: string): Promise<any>;
    loadRegisteredReport(name: string): Promise<ReportDefinition<T>>;
}
//# sourceMappingURL=engine.d.ts.map