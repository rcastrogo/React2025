
import React, { useState, useEffect, type ReactNode } from 'react';
import ReportEngine, { type ReportDefinition, type Mediator, type MediatorSendValue } from './ReportEngine';


export interface ReportViewerProps<T> {
    reportDefinition: ReportDefinition<T>;
    data: T[];
    renderAsTable?: boolean;
    tableHeader?: ReactNode;
    tableFooter?: ReactNode;
}

const ReportViewer = <T,>({ reportDefinition, data, renderAsTable = true, tableHeader, tableFooter }: ReportViewerProps<T>) => {
    const report = new ReportEngine<T>();
    const [reportContent, setReportContent] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const generatedContent: React.JSX.Element[] = [];

        const mediator: Mediator = {
            send: function (content: MediatorSendValue) {
                if (Array.isArray(content)) {
                    generatedContent.push(...content);
                } else if (typeof content === 'string') {
                    generatedContent.push(<span>{content}</span>);
                } else {
                    generatedContent.push(content);
                }
            },
            flush: function () {
                setReportContent([...generatedContent]);
            },
            clear: function () {
                generatedContent.length = 0;
            }
        };

        report.generateReport(reportDefinition, data, mediator);
        mediator.flush?.();

    }, [reportDefinition, data]);

    return (
        <div className="pol-report-viewer-container w3-padding">
            {renderAsTable ? (
                <table className="pol-report-viewer-table">
                    {tableHeader && <thead>{tableHeader}</thead>}
                    <tbody>
                        {reportContent.map((item, index) => (
                            <React.Fragment key={index}> {item} </React.Fragment>
                        ))}
                    </tbody>
                    {tableFooter && <tfoot>{tableFooter}</tfoot>}
                </table>
            ) : (
                <>
                    {reportContent.map((item, index) => (
                        <React.Fragment key={index}> {item} </React.Fragment>
                    ))}
                </>
            )}
        </div>
    );
};

export default ReportViewer;