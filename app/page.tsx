import React from "react";
import Header from "./components/header";
import Features from "./components/features";
import Pricing from "./components/pricing";
import Testimonials from "./components/testimonials";
import Footer from "./components/footer";
import { HeroSectionOne } from "./components/hero";
import Cta from "./components/cta";

const MainPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSectionOne />
      <Features />
      <Pricing />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
};

export default MainPage;
