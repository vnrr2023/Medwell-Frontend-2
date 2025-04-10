import axios from "axios"
export const ngrok_url_m = "http://localhost:3000/api"
export const ngrok_url_chatbot=process.env.NEXT_PUBLIC_CHATBOT_URL
export const ngrok_url_main=process.env.NEXT_PUBLIC_MAIN_URL
export const ngrok_url_analytics = process.env.NEXT_PUBLIC_ANALYTICS_URL
export const ngrok_url2 = "https://ac49-103-220-42-152.ngrok-free.app" 
export const ngrok_url_doctorsearch = "https://doctor-search-medwell.vercel.app"

// analytics

// ek kam kar analytics madhey jithe chart ahe na tithe dummy data tak

// https://ac49-103-220-42-152.ngrok-free.app
// java

//  https://a99d-103-220-42-152.ngrok-free.app
// main
//https://doctor-search-medwell.vercel.app/
const api = axios.create({
  baseURL: `${ngrok_url_main}/`,
})
const api2 = axios.create({
  baseURL: `${ngrok_url2}/`,
})
const api3 = axios.create({
  baseURL: `${ngrok_url_analytics}/`,
})
const api4 = axios.create({
  baseURL: `${ngrok_url_doctorsearch}/`,
})
const api5 = axios.create({
  baseURL: `${ngrok_url_chatbot}/`,
})

const apim = axios.create({
  baseURL: `${ngrok_url_m}/`,
})

export const Token = typeof window !== 'undefined' ? localStorage.getItem("Token") : null
export const mToken=Token
export const mockToken="1234"
console.log(Token)

const DaddyAPI = {
  // All Patient APIs
  // This api gets all the reports of the patients. :D
  //☑️
  getReports: () =>
    api.post("/patient/get_reports","", {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),
  // This is to send the report to the backend.
  //☑️
  addReport: (formData: FormData) =>
    api.post("/patient/send_report", formData, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "multipart/form-data",
      },
    }),
  // This api gets the status of a report task every 5 seconds.
  //☑️
  getReportTaskStatus: (taskId: string) => api.get(`/patient/get_task_status/${taskId}`,{headers:{"ngrok-skip-browser-warning": "69420"},}),

  // save the patient info add fields in an object and pass it as a parameter
  
    //☑️
  savePatientInfo: (data:any) =>
    api.post("/patient/update_info", data, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),

  // This api gets the health check of a particular user
  //☑️
  getHealthCheck: () =>
    apim.get("/patient/health-check", {
      headers: {
        Authorization: `Bearer ${mockToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api gets the info of the user
  //☑️
  getPatientInfo: () =>
    api.post("/patient/get_info","", {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api gives dashboard data about expense
  //☑️
  getExpensesDashboard: () =>
    apim.get("/patient/expenses-dashboard",  {
      headers: {
        Authorization: `Bearer ${mockToken}`,
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    }),

  // This api shows expense info of user
 //☑️
  showExpenses: () =>
    api3.get("/patient/expense", {
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
      api.post("/patient/add_expense", data, {
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
        api.post("/patient/delete_expense", id, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
          },
        }),

  // This api gives entire info about the patient in short
  //☑️
  getPatientDashboard: () =>
    apim.get("/patient/dashboard",{
      headers: {
        Authorization: `Bearer ${mockToken}`,
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
  api.post("/patient/provide_access", data, {
    headers: {
      Authorization: `Bearer ${mToken}`,
      "Content-Type": "application/json",
    },
  }),

      // Chat Report APIs
      //☑️
  createChatAgent: () =>
    api5.get("/create_agent/147", {
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${mToken}`,
      },
    }),
//☑️
  sendChatMessage: (messageData:any) =>
    api5.post("/chat", messageData, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),
  sendChatMessage2: (messageData:any) =>
    api5.post("/query", messageData, {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),

//DOCTOR SEARCH APIs
//Get Nearby Doctors and Hospitals by location or/and speciality
//☑️
doctorSearchSpecialty: (data:any) =>
  api4.post("/get-nearby-doctor", data, {
    headers: {
      Authorization: `Bearer ${mToken}`,
      "Content-Type": "application/json",
    },
  }),
//QUERY
//☑️
doctorSearchQuery: (data:any) =>
  api4.post("/search-doctors-and-hospitals", data, {
    headers: {
      Authorization: `Bearer ${mToken}`,
      "Content-Type": "application/json",
    },
  }),
  
  //doctor apis
  //☑️
  refreshPatients: () =>
    api.get("/doctor/refresh_patients", {
      headers: {
        Authorization: `Bearer ${mToken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    }),
    //☑️
  patientsReport: (id:any) =>
    api.post("/doctor/get_patient_reports",id,{
      headers: {
        Authorization: `Bearer ${mToken}`,
        "Content-Type": "application/json",
      },
    }),

    //marketing apis
    //☑️
    sendMarketingEmail: (data:any) =>
      api2.post("/marketting/market-services",data,{
        headers: {
          Authorization: `Bearer ${mToken}`,
          "Content-Type": "application/json",
        },
      }),
      //☑️
    genEmailBody: (data:any) =>
      apim.post("/marketting/generate_mail_body",data,{
        headers: {
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
        },
      }),

      //APPOINTMENTS
      //☑️
      getSlots: (date:any,address_id:any) =>
        api2.get(`slots/get-slots-for-date-and-address/${date}/${address_id}`, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        //☑️
      getaddressess: (id:any) =>
        api2.get(`doctor/data/addresses/${id}`, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        //☑️
      getservices: (id:any) =>
        api2.get(`doctor/data/services/${id}`, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        //☑️
      getDocInfo: (id:any) =>
        api2.get(`doctor/data/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        //☑️
      createAppointment: (data:any) =>
        api2.post("appointment/patient/create", data, {
          headers: {
            Authorization: `Bearer ${mToken}`,
            "Content-Type": "application/json",
          },
        }),

        //Whatsapp marketing 
        
        //☑️
        sendWhatsappMsg: (data:any) =>
          api2.post("marketting/whatsapp", data, {
            headers: {
              Authorization: `Bearer ${mToken}`,
              "Content-Type": "multipart/form-data",
            },
          }),
        //☑️
        genWhatsappBody: (data:any) =>
          apim.post("/whatsapp/generate_whatsapp_body",data,{
            headers: {
              Authorization: `Bearer ${mockToken}`,
              "Content-Type": "application/json",
            },
          }),
          //doctor appointments apis
          
          getDoctorPrevAppointments: (page = 0) =>
            api2.get(`appointment/doctor/previous-appointments`, {
              headers: {
                Authorization: `Bearer ${Token}`,
                "ngrok-skip-browser-warning": "69420",
              },
              params:{page}
            }),
            
          // Upcoming appointments with date filter
          getDoctorUpcomingAppointments: (date: string, time?: string) =>
            api2.get(`appointment/doctor/upcoming-appointments`, {
              headers: {
                Authorization: `Bearer ${Token}`,
                "ngrok-skip-browser-warning": "69420",
              },
              params:{date,time}
            }),
        
          // Calendar data with year and month
          getDocCalendar: (year: number, month: number) =>
            api2.get(`appointment/doctor/appointment-calendar`, {
              headers: {
                Authorization: `Bearer ${Token}`,
                "ngrok-skip-browser-warning": "69420",
              },
              params:{year, month}
            }),
          // getDoctorPrevAppointments: (page = 0) =>
          //   api2.get(`appointment/doctor/previous-appointments/${page}`, {
          //     headers: {
          //       Authorization: `Bearer ${mToken}`,
          //       "ngrok-skip-browser-warning": "69420",
          //     },
          //   }),
        
          // // Upcoming appointments with date filter
          // getDoctorUpcomingAppointments: (date: string, time?: string) =>
          //   api2.get(`appointment/doctor/upcoming-appointments/${date}/10:00`, {
          //     headers: {
          //       Authorization: `Bearer ${mToken}`,
          //       "ngrok-skip-browser-warning": "69420",
          //     },
          //   }),
        
          // // Calendar data with year and month
          // getDocCalendar: (year: number, month: number) =>
          //   api2.get(`appointment/doctor/appointment-calendar/${year}/${month}`, {
          //     headers: {
          //       Authorization: `Bearer ${mToken}`,
          //       "ngrok-skip-browser-warning": "69420",
          //     },
          //     params:{year, month}
          //   }),

          //   //patient appointments api

          //   getPatientPrevAppointments: (page = 0) =>
          //     api.get(`appointment/patient/previous-appointments/${page}`, {
          //       headers: {
          //         Authorization: `Bearer ${mToken}`,
          //         "ngrok-skip-browser-warning": "69420",
          //       },
          //       params:{page}
          //     }),
          
          //   // Upcoming appointments with date filter
          //   getPatientUpcomingAppointments: (date: string, time?: string) =>
          //     api.get(`appointment/patient/upcoming-appointments/${date}/10:00`, {
          //       headers: {
          //         Authorization: `Bearer ${mToken}`,
          //         "ngrok-skip-browser-warning": "69420",
          //       },
          //       params:{date,time}
          //     }),
          // getPatCalendar: (year: number, month: number) =>
          //   api.get(`appointment/patient/appointment-calendar/${year}/${month}`, {
          //     headers: {
          //       Authorization: `Bearer ${mToken}`,
          //       "ngrok-skip-browser-warning": "69420",
          //     },
          //     params:{year, month}
          //   }),

            getPatientPrevAppointments: (page = 0) =>
              api2.get(`appointment/patient/previous-appointments`, {
                headers: {
                  Authorization: `Bearer ${mToken}`,
                  "ngrok-skip-browser-warning": "69420",
                },
                params:{page}
              }),
          
            // Upcoming appointments with date filter
            getPatientUpcomingAppointments: (date: string, time?: string) =>
              api2.get(`appointment/patient/upcoming-appointments`, {
                headers: {
                  Authorization: `Bearer ${mToken}`,
                  "ngrok-skip-browser-warning": "69420",
                },
                params:{date,time}
              }),
          getPatCalendar: (year: number, month: number) =>
            api2.get(`appointment/patient/appointment-calendar`, {
              headers: {
                Authorization: `Bearer ${mToken}`,
                "ngrok-skip-browser-warning": "69420",
              },
              params:{year, month}
            }),

              //prescriptions with id
            getPrescriptions: (id:any) =>
              api.get(`prescription/${id}`, {
                headers: {
                  Authorization: `Bearer ${mToken}`,
                  "ngrok-skip-browser-warning": "69420",
                },
              }),
              
              addPrescription: (data:any) =>
                api.post("prescription/add",data,{
                  headers: {
                    Authorization: `Bearer ${mToken}`,
                    "Content-Type": "application/json",
                  },
                }),
              updatePrescription: (data:any) =>
                api.put("prescription/update",data,{
                  headers: {
                    Authorization: `Bearer ${mToken}`,
                    "Content-Type": "application/json",
                  },
                }),

                //analytics and dashboard for the doctor
                getAnalytics: () =>
                  apim.get(`doctor/analytics`, {
                    headers: {
                      Authorization: `Bearer ${mockToken}`,
                      "ngrok-skip-browser-warning": "69420",
                    },
                  }),
                  getDoctorDashboard: () =>
                    apim.get(`doctor/dashboard`, {
                      headers: {
                        Authorization: `Bearer ${mockToken}`,
                        "ngrok-skip-browser-warning": "69420",
                      },
                    }),
}

export default DaddyAPI

