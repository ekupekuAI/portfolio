import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";
import { content } from "@/lib/content";

const ACTION_WORDS = ["Build", "Ship", "Iterate", "Debug", "Deploy", "Learn"];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee words={content.techStack} />
        <About />
        <Marquee words={ACTION_WORDS} />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
