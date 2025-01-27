import axios from "axios"

const ngrok_url = "https://medwell2.vercel.app/api"
const api = axios.create({
  baseURL: `${ngrok_url}/`,
})

const Token = "1234"

const DaddyAPI = {
  // All Patient APIs
  // This api gets all the reports of the patients. :D
  getReports: () =>
    api.post("/patient/get_reports/", "", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),
  // This is to send the report to the backend.
  addReport: (formData: FormData) =>
    api.post("/patient/send_report/", formData, {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "multipart/form-data",
      },
    }),
  // This api gets the status of a report task every 5 seconds.
  getReportTaskStatus: (taskId: string) => api.get(`/patient/get_report_task_status/?task_id=${taskId}`),

  // save the patient info add fields in an object and pass it as a parameter
  //Input:-
  // Natural Language
    // {
    //     "query_type":"natural_language",
    //     "query":"Spent 150 on crocin and dolo650"
    // }

    // // Normal query
    // {
    //     "query_type":"normal",
    //     "expense_type":"reports",
    //     "amount":"700"
    // }
  savePatientInfo: (data:any) =>
    api.post("/patient/update_info/", data, {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

  // This api gets the health check of a particular user
  getHealthCheck: () =>
    api.post("/patient/health_check/", "", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

  // This api gets the info of the user
  getPatientInfo: () =>
    api.post("/patient/get_info/", "", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

  // This api gives dashboard data about expense
  getExpensesDashboard: () =>
    api.post("/patient/expenses_dashboard/", "", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

  // This api shows expense info of user
  showExpenses: () =>
    api.post("/patient/show_expenses/", "", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),
// Adding expenses you can add in natural language and normal query
    addExpenses: (data:any) =>
      api.post("/patient/add_expense/", data, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      }),

// Deleting expenses you can delete by id
//Input:-
// {
//     "expense_id": // the id of the expense to delete
// }

    deleteExpenses: (id:any) =>
        api.post("/patient/delete_expense/", id, {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }),

  // This api gives entire info about the patient in short
  getPatientDashboard: () =>
    api.post("/patient/dashboard/", "", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

//// Encrypted data from qr code of the doctor 
//Input:-
// {
//     "enc_data":"gAAAAABnKIU8OfSPvmnguIHAiZV1LgmAAjGSAgeMagAg4veyzuVm8iSkl6SBHNJzTk1ER6kHMdCdcZoSjRDVZMzJuv7KGM91lL5c0az6aMvSSLV0KWd3M2_bOMfHREsFLysARhTXKKam"
// }
  qrCodeEncData: (enc_data:any) =>
    api.post("/patient/dashboard/", enc_data, {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),
}

export default DaddyAPI

