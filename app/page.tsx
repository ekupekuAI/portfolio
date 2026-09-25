import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SceneShift from "@/components/layout/SceneShift";
import NetworkBackground from "@/components/layout/NetworkBackground";
import ConsoleGreeting from "@/components/layout/ConsoleGreeting";
import Hero from "@/components/sections/Hero";
import Pulse from "@/components/sections/Pulse";
import Thinking from "@/components/sections/Thinking";
import Building from "@/components/sections/Building";
import Work from "@/components/sections/Work";
import Lab from "@/components/sections/Lab";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";

// Journey is built and kept in components/sections/Journey.tsx; it is unmounted
// by request. Re-add it between Stack and Contact to bring it back.
export default function Home() {
  return (
    <>
      <NetworkBackground />
      <Nav />
      <SceneShift />
      <ConsoleGreeting />
      <main className="relative z-10">
        <Hero />
        <Pulse />
        <Thinking />
        <Building />
        <Work />
        <Lab />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
