export interface Reporter {
  generate(data: any): string;
}

export class MarkdownReporter implements Reporter {
  generate(data: any): string {
    return '# Baseline Surgeon Report\n\nReport generation not yet implemented.';
  }
}

export class JsonReporter implements Reporter {
  generate(data: any): string {
    return JSON.stringify(data, null, 2);
  }
} 