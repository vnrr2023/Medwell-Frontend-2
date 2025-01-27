
export interface ReportElement {
  max: number
  min: number
  unit: string
  value: number
}

export interface ReportData {
  [key: string]: ReportElement
}

export interface ReportDetail {
  report_data: ReportData
}

export interface Report {
  id: string
  report_file: string
  report_type: string
  submitted_at: string
  date_of_collection: string
  doctor_name: string
  date_of_report: string
  summary: string
  reportdetail: ReportDetail
}

export enum ReportType {
  BLOOD_REPORT = 'blood_report',
  URINE_REPORT = 'urine_report',
}

export enum TestResultStatus {
  IN_RANGE = 'inRange',
  OUT_OF_RANGE = 'outOfRange',
  NOT_AVAILABLE = 'notAvailable',
  ALL = 'all'
}