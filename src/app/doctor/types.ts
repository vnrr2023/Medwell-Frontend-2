export interface ReportElement {
    max: number
    min: number
    unit: string
    value: number
  }
  
  export interface Report {
    id: number
    title: string
    date: string
    collectionDate: string
    doctorName: string
    summary: string
    elements: {
      [key: string]: ReportElement
    }
    reportUrl: string
    body?: string
    type?: string
    url?: string
  }
  
  