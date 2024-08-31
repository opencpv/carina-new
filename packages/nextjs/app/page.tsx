"use client";

// import Link from "next/link";
import homePageData from "./data/static/home-page-data";
import type { NextPage } from "next";
import CaAppLogo from "~~/components/icons/CaAppLogo";
import PartnerIcons from "~~/components/shared/PartnerIcons";
import CTAButton from "~~/components/shared/buttons/CTAButton";
import Header from "~~/components/shared/text/Header";

// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const staticPageData = homePageData();
  return (
    <>
      <section
        className={`w-full h-[100vh] flex flex-col items-center justify-between p-20 bg-landing-bg bg-cover bg-center bg-carina`}
      >
        <CaAppLogo />
        <div className="flex flex-col items-center">
          <Header text={staticPageData.mainHeading} />
          <CTAButton
            text="Get Started"
            onClick={() => {
              window.open(staticPageData.ctaLink, "_self");
            }}
          />
        </div>
        <PartnerIcons />
      </section>
    </>
  );
};

export default Home;
