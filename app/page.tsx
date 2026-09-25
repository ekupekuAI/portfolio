import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SceneShift from "@/components/layout/SceneShift";
import Hero from "@/components/sections/Hero";
import Thinking from "@/components/sections/Thinking";
import Building from "@/components/sections/Building";
import Work from "@/components/sections/Work";
import Lab from "@/components/sections/Lab";
import Stack from "@/components/sections/Stack";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <SceneShift />
      <main>
        <Hero />
        <Thinking />
        <Building />
        <Work />
        <Lab />
        <Stack />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
