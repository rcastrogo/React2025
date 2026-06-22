import ReportEngine from '../report-engine/engine';
import type { Mediator, ReportDefinition } from '../report-engine/types';
/**
 * Service responsible for creating and managing ReportEngine instances.
 *
 * This service abstracts the creation logic and provides
 * helper methods for loading and generating reports.
 */
export declare class ReportEngineService {
    /**
     * Creates a new ReportEngine instance.
     *
     * @returns A new ReportEngine instance.
     */
    createEngine<T>(): ReportEngine<T>;
    /**
     * Generates a report using the provided definition, dataset and mediator.
     *
     * @param rd - Report definition
     * @param data - Dataset to process
     * @param mediator - Mediator used for rendering communication
     */
    generateReport<T>(rd: ReportDefinition<T>, data: T[], mediator: Mediator): void;
    /**
     * Loads a report definition from external source (URL).
     *
     * @param path - URL to fetch report definition from
     * @returns Promise resolving to ReportDefinition
     */
    loadExternalReport<T>(path: string): Promise<ReportDefinition<T>>;
    /**
     * Loads a registered report definition.
     *
     * @param name - Registered report name
     * @returns Promise resolving to ReportDefinition
     */
    loadRegisteredReport<T>(name: string): Promise<ReportDefinition<T>>;
}
//# sourceMappingURL=report.service.d.ts.map