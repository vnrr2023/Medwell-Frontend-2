import axios from "axios"
// export const ngrok_url = "http://localhost:3000/api"
export const ngrok_url = "https://084f-2402-3a80-166a-df3a-65ad-a0fe-41d4-96ff.ngrok-free.app" //main server
export const ngrok_url2 = "https://033b-2402-3a80-166a-df3a-65ad-a0fe-41d4-96ff.ngrok-free.app"//chatbot server
export const ngrok_url3 = "https://b1ec-2402-3a80-166a-df3a-65ad-a0fe-41d4-96ff.ngrok-free.app"//marketing appointment server
const api = axios.create({
  baseURL: `${ngrok_url}/`,
})
const api2 = axios.create({
  baseURL: `${ngrok_url2}/`,
})
const api3 = axios.create({
  baseURL: `${ngrok_url3}/`,
})


const Token = typeof window !== 'undefined' ? localStorage.getItem("Token") : null

// export const Token="1234"
console.log(Token)
// const Token = LocalStorageAccess()

const DaddyAPI = {
  // All Patient APIs
  // This api gets all the reports of the patients. :D
  //☑️
  getReports: () =>
    api.get("/patient/get_reports/",  {
      headers: {
        Authorization: `Bearer ${Token}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),
  // This is to send the report to the backend.
  //☑️
  addReport: (formData: FormData) =>
    api.post("/patient/send_report/", formData, {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "multipart/form-data",
      },
    }),
  // This api gets the status of a report task every 5 seconds.
  //☑️
  getReportTaskStatus: (taskId: string) => api.get(`/patient/get_report_task_status/?task_id=${taskId}`,{headers:{"ngrok-skip-browser-warning": "69420"},}),

  // save the patient info add fields in an object and pass it as a parameter
  
    //☑️
  savePatientInfo: (data:any) =>
    api.post("/patient/update_info/", data, {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

  // This api gets the health check of a particular user
  //☑️
  getHealthCheck: () =>
    api.get("/patient/health_check/", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api gets the info of the user
  //☑️
  getPatientInfo: () =>
    api.get("/patient/get_info/", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api gives dashboard data about expense
  //☑️
  getExpensesDashboard: () =>
    api.get("/patient/expenses_dashboard/",  {
      headers: {
        Authorization: `Bearer ${Token}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api shows expense info of user
 //☑️
  showExpenses: () =>
    api.get("/patient/show_expenses/",  {
      headers: {
        Authorization: `Bearer ${Token}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),
// Adding expenses you can add in natural language and normal query
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
//☑️
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
//☑️
    deleteExpenses: (id:any) =>
        api.post("/patient/delete_expense/", id, {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }),

  // This api gives entire info about the patient in short
  //☑️
  getPatientDashboard: () =>
    api.get("/patient/dashboard/",{
      headers: {
        Authorization: `Bearer ${Token}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

//// Encrypted data from qr code of the doctor 
//Input:-
// {
//     "enc_data":"gAAAAABnKIU8OfSPvmnguIHAiZV1LgmAAjGSAgeMagAg4veyzuVm8iSkl6SBHNJzTk1ER6kHMdCdcZoSjRDVZMzJuv7KGM91lL5c0az6aMvSSLV0KWd3M2_bOMfHREsFLysARhTXKKam"
// }
//☑️
provideAccess: (data:any) =>
  api.post("/patient/provide_access/", data, {
    headers: {
      Authorization: `Bearer ${Token}`,
      "Content-Type": "application/json",
    },
  }),

      // Chat Report APIs
      //☑️
  createChatAgent: () =>
    api2.post("/patient/create_agent/", "", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),
//☑️
  sendChatMessage: (messageData:any) =>
    api2.post("/patient/chat/", messageData, {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

//DOCTOR SEARCH APIs
//Get Nearby Doctors and Hospitals by location or/and speciality
doctorSearchSpecialty: (data:any) =>
  api.post("/get_nearby_doctor/", data, {
    headers: {
      Authorization: `Bearer ${Token}`,
      "Content-Type": "application/json",
    },
  }),
//QUERY
doctorSearchQuery: (data:any) =>
  api.post("/search_doctors_and_hospitals/", data, {
    headers: {
      Authorization: `Bearer ${Token}`,
      "Content-Type": "application/json",
    },
  }),
  
  //doctor apis
  refreshPatients: () =>
    api.get("/doctor/refresh_patients/", {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),
  patientsReport: (id:any) =>
    api.post("/doctor/get_patient_reports/",id,{
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }),

    //marketing apis
    sendMarketingEmail: (data:any) =>
      api3.post("/marketting/market_services",data,{
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      }),
    genEmailBody: (data:any) =>
      api3.post("/marketting/generate_mail_body",data,{
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      }),

}

export default DaddyAPI

