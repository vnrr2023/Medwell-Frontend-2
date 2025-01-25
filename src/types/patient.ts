export interface UserInfo {
    email: string
  }
  
  export interface PatientInfo {
    name: string
    age: number
    user_info: UserInfo
    phone_number: string
    blood_group: string
    height: string
    weight: string
    allergies: string[]
    aadhar_card: string
    chronic_conditions: string[]
    family_history: string[]
    city: string
    state: string
    country: string
    pin: string
    profile_pic?: string
    profile_qr?: string
    health_summary?: string
    diet_plan?: string
  }
  
  