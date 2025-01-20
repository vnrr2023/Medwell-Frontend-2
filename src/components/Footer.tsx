import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1E88E5] text-white py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold font-poppins">Medwell</h3>
          <p className="mt-2">Revolutionizing healthcare, one click at a time.</p>
        </div>
        <div className="flex items-center">
          <p>Made with</p>
          <Heart className="h-5 w-5 mx-1 text-[#FFC107]" />
          <p>by the Medwell team</p>
        </div>
      </div>
    </footer>
  )
}

