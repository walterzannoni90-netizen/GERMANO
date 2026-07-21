import { Hero } from "@/components/Hero";
import { FeaturedTrainings } from "@/components/FeaturedTrainings";
import { Stats } from "@/components/Stats";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      <Hero />
      <FeaturedTrainings />
      <Stats />
      <HowItWorks />
      <CTA />
    </div>
  );
}
