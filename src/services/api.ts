import axios from "axios"
export const ngrok_url_m = "https://medwell2.vercel.app/api"
export const ngrok_url = "https://4443-103-220-42-152.ngrok-free.app" 
export const ngrok_url2 = "https://whatsapp-messaging-medwell-api.vercel.app" 

const api = axios.create({
  baseURL: `${ngrok_url}/`,
})
const api2 = axios.create({
  baseURL: `${ngrok_url2}/`,
})

const apim = axios.create({
  baseURL: `${ngrok_url_m}/`,
})

const Token = typeof window !== 'undefined' ? localStorage.getItem("Token") : null
export const mToken="1234"
// export const Token="1234"
console.log(Token)
// const Token = LocalStorageAccess()

const DaddyAPI = {
  // All Patient APIs
  // This api gets all the reports of the patients. :D
  //☑️
  getReports: () =>
    apim.post("/patient/get_reports", {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),
  // This is to send the report to the backend.
  //☑️
  addReport: (formData: FormData) =>
    apim.post("/patient/send_report", formData, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "multipart/form-data",
      },
    }),
  // This api gets the status of a report task every 5 seconds.
  //☑️
  getReportTaskStatus: (taskId: string) => apim.get(`/patient/get_task_status/${taskId}`,{headers:{"ngrok-skip-browser-warning": "69420"},}),

  // save the patient info add fields in an object and pass it as a parameter
  
    //☑️
  savePatientInfo: (data:any) =>
    apim.post("/patient/update_info/", data, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),

  // This api gets the health check of a particular user
  //☑️
  getHealthCheck: () =>
    apim.get("/patient/health_check/", {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api gets the info of the user
  //☑️
  getPatientInfo: () =>
    apim.get("/patient/get_info/", {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api gives dashboard data about expense
  //☑️
  getExpensesDashboard: () =>
    apim.get("/patient/expenses_dashboard/",  {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api shows expense info of user
 //☑️
  showExpenses: () =>
    apim.get("/patient/show_expenses/", {
      headers: {
        Authorization: `Bearer ${mToken}`,
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
      apim.post("/patient/add_expense/", data, {
        headers: {
          Authorization: `Bearer ${mToken}`,
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
        apim.post("/patient/delete_expense/", id, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
          },
        }),

  // This api gives entire info about the patient in short
  //☑️
  getPatientDashboard: () =>
    apim.get("/patient/dashboard/",{
      headers: {
        Authorization: `Bearer ${mToken}`,
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
  apim.post("/patient/provide_access/", data, {
    headers: {
      Authorization: `Bearer ${mToken}`,
      "Content-Type": "application/json",
    },
  }),

      // Chat Report APIs
      //☑️
  createChatAgent: () =>
    apim.get("/create_agent/147", {
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${mToken}`,
      },
    }),
//☑️
  sendChatMessage: (messageData:any) =>
    apim.post("/chat", messageData, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),
  sendChatMessage2: (messageData:any) =>
    apim.post("/query", messageData, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),

//DOCTOR SEARCH APIs
//Get Nearby Doctors and Hospitals by location or/and speciality
//☑️
doctorSearchSpecialty: (data:any) =>
  apim.post("/get_nearby_doctor/", data, {
    headers: {
      Authorization: `Bearer ${mToken}`,
      "Content-Type": "application/json",
    },
  }),
//QUERY
//☑️
doctorSearchQuery: (data:any) =>
  apim.post("/search_doctors_and_hospitals/", data, {
    headers: {
      Authorization: `Bearer ${mToken}`,
      "Content-Type": "application/json",
    },
  }),
  
  //doctor apis
  //☑️
  refreshPatients: () =>
    apim.get("/doctor/refresh_patients", {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),
    //☑️
  patientsReport: (id:any) =>
    apim.post("/doctor/get_patient_reports",id,{
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),

    //marketing apis
    //☑️
    sendMarketingEmail: (data:any) =>
      apim.post("/marketting/market_services",data,{
        headers: {
          Authorization: `Bearer ${mToken}`,
          "Content-Type": "application/json",
        },
      }),
      //☑️
    genEmailBody: (data:any) =>
      apim.post("/marketting/generate_mail_body",data,{
        headers: {
          Authorization: `Bearer ${mToken}`,
          "Content-Type": "application/json",
        },
      }),

      //APPOINTMENTS
      //☑️
      getSlots: (date:any,address_id:any) =>
        apim.get(`/slots/get-slots-for-date-and-address/${date}/${address_id}`, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        //☑️
      getaddressess: (id:any) =>
        apim.get(`/appointment/get-doctor-addresses/${id}`, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        //☑️
      getservices: (id:any) =>
        apim.get(`/appointment/get-doctor-services/${id}`, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        //☑️
      createAppointment: (data:any) =>
        apim.post("/appointment/create_appointment_from_patient", data, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
          },
        }),

        //Whatsapp marketing 
        
        //☑️
        sendWhatsappMsg: (data:any) =>
          api2.post("/whatsapp/marketing", data, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
        //☑️
        genWhatsappBody: (data:any) =>
          apim.post("/whatsapp/generate_whatsapp_body",data,{
            headers: {
              Authorization: `Bearer ${mToken}`,
              "Content-Type": "application/json",
            },
          }),

}

export default DaddyAPI

