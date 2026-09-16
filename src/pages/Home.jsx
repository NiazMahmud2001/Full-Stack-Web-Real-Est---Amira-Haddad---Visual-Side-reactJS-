import React from 'react'

import SmoothScroll from "../components/motion/SmoothScroll";
import ScrollProgress from "../components/motion/ScrollProgress";
import NavBar from "../components/layout/NavBar";
import CanvasScrollHero from "../components/home/CanvasScrollHero";
import StatementSection from "../components/home/StatementSection";
import FeaturedListings from "../components/home/FeaturedListings"; // Portfolio Currently on the market : on scroll rotation
import FeatureGrid from "../components/home/FeatureGrid"; // Why it works part
import HowItWorks from "../components/home/HowItWorks";   // The approach: part
import MarketStats from "../components/home/MarketStats"; // By the numbers : this kinda like black box ui
import AreaMarquee from "../components/home/AreaMarquee"; // Every community, one  -> to scrolling text animation
import AgentProfile from "../components/home/AgentProfile"; // Amira Haddad info
import Testimonials from "../components/home/Testimonials";
import InquiryForm from "../components/home/InquiryForm_2"; // saves enquiries to Supabase
import HomeCta from "../components/home/HomeCta";

import SiteFooter from "../components/layout/SiteFooter";

/***** do not remove this npm i section ***** */
// npm install clsx
// npm install tailwind-merge
// npm install canvas-confetti
// npm install @radix-ui/react-slider
// npm install class-variance-authority
// npm install @radix-ui/react-label
// npm install react-resizable-panels
// npm install maplibre-gl


export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-sand">
        <ScrollProgress />
        <NavBar variant="floating" />

        <main>  
          <CanvasScrollHero />{/* -- multi img mouse scrolling hero part */}
          <StatementSection />{/* -- The idea */}
          <FeaturedListings />{/* -- Portfolio -- and below mouse scrolling imgs */}
          <FeatureGrid />     {/* -- Why it works */}
          <HowItWorks />      {/* -- The approach */}
          <MarketStats />     {/* -- By the numbers  -- black part*/}
          <AreaMarquee />     {/* -- Coverage   --- the moving left/right sliding text*/}
          <AgentProfile />    {/* -- Coverage   --- the moving left/right sliding text*/}
          <Testimonials />    {/* -- the sliding text*/}
          <InquiryForm />     {/* -- Enquire -- the black box + submit form*/}
          <HomeCta />         {/* -- One conversation away --- above sliding part.*/}
        </main>

        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
