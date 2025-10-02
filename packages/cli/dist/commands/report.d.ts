interface ReportOptions {
    target?: string;
    format?: 'markdown' | 'sarif' | 'json';
    output?: string;
    include?: string;
    exclude?: string;
}
export declare function reportCommand(paths: string[], options: ReportOptions): Promise<void>;
export {};
//# sourceMappingURL=report.d.ts.map