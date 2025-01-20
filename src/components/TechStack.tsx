import { SiReact, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si"

const techStack = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
]

export default function TechStack() {
  return (
    <section className="py-20 px-4 md:px-6 bg-[#FAFAFA]">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-[#1E88E5]">Our Tech Stack</h2>
      <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
        {techStack.map(({ name, Icon, color }) => (
          <div key={name} className="flex flex-col items-center">
            <Icon className="w-16 h-16 mb-2" style={{ color }} />
            <span className="text-lg font-semibold">{name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

