"use client"

import { ContainerScroll } from "@/components/ui/container-scroll-animation"

const testimonials = [
  { comment: "The health tips provided here have been life-changing!", author: "Vivek" },
  { comment: "The articles here are clear and incredibly informative. I trust the advice!", author: "Nishi" },
  { comment: "I've learned so much about preventive care from this site. It's my go-to source.", author: "Rehan" },
  { comment: "Great insights on mental health—easy to understand and implement.", author: "Rohit" },
  { comment: "This site explains complex medical issues in a simple way. Highly recommended!", author: "Azlaan" },
  { comment: "As a fitness enthusiast, the nutrition guides here have been a game-changer.", author: "Shah" },
  { comment: "The expert advice on this platform has improved my family's health choices.", author: "Lavanya" },
  { comment: "The in-depth analysis on medical trends is impressive and reliable.", author: "Bilal" },
  { comment: "I appreciate how the site covers all aspects of health and wellness.", author: "Affan" },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins">What Our Users Say</h2>
      <ContainerScroll
        users={testimonials.map((t) => ({
          name: t.author,
          designation: "User",
          image: "https://picsum.photos/id/10/200/200",
        }))}
        direction="left"
        speed="slow"
      >
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md min-w-[300px] mr-4">
            <p className="text-lg mb-4">"{testimonial.comment}"</p>
            <p className="font-bold">- {testimonial.author}</p>
          </div>
        ))}
      </ContainerScroll>
    </section>
  )
}

