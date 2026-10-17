"use client"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import FadeRight from "@/components/animations/FadeRight"
import FadeLeft from "@/components/animations/FadeLeft"

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const texts = useMemo(() => ["Web Developer", "Frontend Enthusiast", "UI/UX Designer"], [])

  const handleScroll = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  useEffect(() => {
    const currentIndex = index % texts.length

    const timeout = setTimeout(
      () => {
        const currentText = texts[currentIndex]

        if (!deleting && subIndex < currentText.length) {
          setSubIndex(subIndex + 1)
        } else if (deleting && subIndex > 0) {
          setSubIndex(subIndex - 1)
        } else if (!deleting && subIndex === currentText.length) {
          setDeleting(true)
        } else if (deleting && subIndex === 0) {
          setDeleting(false)
          setIndex((currentIndex + 1) % texts.length)
        }
      },
      deleting ? 75 : 150,
    )

    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, texts])

  return (
    <>
      <section id="home" className="w-full max-w-7xl mx-auto cursor-default grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <FadeLeft>
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-text-primary text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
                Hi, I&apos;m
                <span className="text-transparent bg-clip-text bg-linear-to-r from-text-primary to-text-secondary"> Gilby</span>
              </h1>
            </div>

            <div className="relative">
              <span className={`text-text-primary text-xl md:text-2xl lg:text-3xl font-bold tracking-tight`}>{`${texts[index].substring(0, subIndex)}`}</span>
              <span className="animate-cursor text-text-secondary text-2xl lg:text-3xl font-light">|</span>
            </div>

            <div className="max-w-xl mt-4">
              <p className="text-text-secondary text-base md:text-lg leading-relaxed font-medium">Halo! Saya suka ngoding dan merancang antarmuka web yang modern, interaktif, dan mudah digunakan. Bagi saya, setiap baris kode adalah cara untuk menghadirkan sesuatu yang bermanfaat dan keren di dunia digital.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button onClick={() => handleScroll("projects")} className="cursor-pointer text-sm md:text-base font-bold bg-text-primary text-background px-8 py-4 rounded-xl flex flex-row items-center justify-center gap-3 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 ease-out">
                Explore Work
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                </svg>
              </button>
              <button onClick={() => handleScroll("about")} className="cursor-pointer text-sm md:text-base font-bold border-2 border-text-secondary/20 hover:border-text-primary text-text-primary px-8 py-4 rounded-xl flex flex-row items-center justify-center gap-3 hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-thirdary/40 transition-all duration-300 ease-out bg-background/50 backdrop-blur-sm shadow-[0_4px_10px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_10px_rgba(255,255,255,0.02)]">
                About Me
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-text-secondary/10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-4 block">Connect</span>
              <div className="flex flex-row gap-4">
                {socialMediaList.map((item, index) => (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="p-3 border border-text-secondary/20 rounded-xl hover:border-text-primary hover:bg-text-primary hover:text-background text-text-primary transition-all duration-300" key={index} title={item.label}>
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </FadeLeft>

        <FadeRight>
          <div className="flex flex-col items-center justify-center relative mt-12 md:mt-0">
            {/* Subtle aesthetic backdrop */}
            <div className="absolute inset-0 bg-linear-to-tr from-thirdary to-background rounded-full scale-110 opacity-50 blur-2xl"></div>

            <div className="relative z-10 p-2 bg-background border border-text-secondary/10 rounded-full shadow-2xl group">
              <Image src="/images/gilby-hero.png" alt="Gilby Maleeq Gibrany" width={400} height={400} className="rounded-full object-cover aspect-square floating grayscale hover:grayscale-0 group-hover:grayscale-0 transition-all duration-700 cursor-pointer" priority />
            </div>

            {/* Quick Stats redesigned as floating minimal badges */}
            <div className="absolute -bottom-10 md:-bottom-12 -left-4 md:-left-12 z-20 flex flex-col gap-3">
              {quickStatsList.map((stat, index) => (
                <div className={`floating flex items-center gap-3 bg-background/90 backdrop-blur-md border border-text-secondary/10 p-3 pr-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-5`} style={{ animationDelay: `${index * 150}ms` }} key={index}>
                  <div className="bg-text-primary text-background p-2 rounded-xl">{stat.icon}</div>
                  <span className="text-xs md:text-sm font-semibold text-text-primary whitespace-nowrap">{stat.message}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeRight>
      </section>
    </>
  )
}

const socialMediaList = [
  {
    label: "GitHub",
    href: "https://github.com/raihanmlg98-coder",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skibidi_zz_?vrfl=NjQ2b2RneXNtMWwy",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@clarkekentt0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.95-.59 3.86-1.66 5.43-1.4 2.05-3.66 3.39-6.16 3.65-2.52.27-5.11-.27-7.23-1.66-2.09-1.37-3.52-3.48-4.04-5.89-.52-2.4-.1-4.95 1.15-7.05 1.25-2.11 3.33-3.67 5.71-4.24 2.2-.54 4.54-.31 6.6.62v4.11c-1.37-.62-2.92-.81-4.38-.49-1.46.32-2.78 1.16-3.66 2.37-.87 1.21-1.22 2.76-1.01 4.24.2 1.49.99 2.82 2.15 3.75 1.16.94 2.7 1.34 4.18 1.09 1.49-.24 2.83-1.04 3.76-2.2 1.01-1.25 1.47-2.87 1.47-4.47V.02z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6282334641491",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:gilbymaleeqgibrany@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

const quickStatsList = [
  {
    message: "SMKN 4 Malang",
    icon: (
      <svg className="w-5 md:w-6 text-text-background" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  },
  {
    message: "Web Developer",
    icon: (
      <svg className="w-5 md:w-6 text-text-background" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14" />
      </svg>
    ),
  },
  {
    message: "UI/UX & Frontend Focus",
    icon: (
      <svg className="w-5 md:w-6 text-text-background" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M5 12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2M5 12h14m-7 4v3m-4 0h8" />
      </svg>
    ),
  },
]
