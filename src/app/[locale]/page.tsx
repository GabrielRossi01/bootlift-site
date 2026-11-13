import { Hero } from "@/components/sections/hero/Hero";
import { WhyNow } from "@/components/sections/WhyNow";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Demo } from "@/components/sections/Demo";
import { Playground } from "@/components/sections/Playground";
import { Rules } from "@/components/sections/Rules";
import { Quickstart } from "@/components/sections/Quickstart";
import { Score } from "@/components/sections/Score";
import { Contribute } from "@/components/sections/Contribute";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyNow />
      <HowItWorks />
      <Demo />
      <Playground />
      <Rules />
      <Quickstart />
      <Score />
      <Contribute />
      <Faq />
      <FinalCta />
    </>
  );
}
