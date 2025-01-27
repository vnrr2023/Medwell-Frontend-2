export interface ReportElement {
    max: number;
    min: number;
    unit: string;
    value: number;
  }
  
  export interface Report {
    id: number;
    title: string;
    date: string;
    collectionDate: string;
    doctorName: string;
    summary: string;
    elements: Record<string, ReportElement>;
    reportUrl: string;
  }
  