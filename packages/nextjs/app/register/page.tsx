"use client";

import { ReactNode, useState } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import routes from "../data/static/routes";
// import routes from "../data/static/routes";
import Lottie from "lottie-react";
import toast from "react-hot-toast";
import "react-icons/fa6";
// import { FaBusinessTime, FaHospital } from "react-icons/fa6";
import "reactjs-popup/dist/index.css";
import Input from "~~/components/Input";
import MetamaskConnection from "~~/components/MetamaskConnection";
import CaAppLogo from "~~/components/icons/CaAppLogo";
import CaMouseIcon from "~~/components/icons/CaMouseIcon";
import CaUserIcon from "~~/components/icons/CaUserIcon";
import CaWalletIcon from "~~/components/icons/CaWalletIcon";
import FullscreenLayout from "~~/components/layout/FullscreenLayout";
import useAssets from "~~/hooks/useAssets";
import supabaseClient from "~~/utils/supabase/supabase-client";

const inter = Inter({ subsets: ["latin"] });

const Register = () => {
  const [step, setStep] = useState(1);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("hospital");
  const [loading, setloading] = useState(false);
  const [networkAddress, setnewtworKaddress] = useState<string>();
  const { lottie, image } = useAssets();
  const steps = [
    {
      icon: <CaWalletIcon />,
      title: "Wallet",
      description: "Connect your wallet",
    },
    {
      icon: <CaUserIcon />,
      title: "Profile",
      description: "Complete your profile",
    },
    {
      icon: <CaMouseIcon />,
      title: "Dashboard",
      description: "Continue to dashboard",
    },
  ];

  const LoginStep = ({
    currentStep,
    icon,
    description,
    title,
  }: {
    currentStep: number;
    icon: ReactNode;
    title: string;
    description: string;
  }) => {
    return (
      <div className={`flex gap-5 w-full rounded-2xl p-2 ${currentStep === step ? "bg-[#B6F2EA] bg-opacity-35" : ""}`}>
        <div className="flex gap-2 items-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white">{icon}</div>
          <div>
            <p className="text-[24px] my-0 font-black text-white pl-5">{title}</p>
            <p className="text-base my-0 font-black pl-8 text-white">{description}</p>
          </div>
        </div>
      </div>
    );
  };
  const ProfileStep = () => {
    return (
      <div className="flex flex-col gap-3 w-[400px]">
        <Input name="name" placeholder="institutional name" />
        <Input name="address" placeholder="address" />
        <Input name="phone_number" placeholder="phone" />
        <Input name="id" placeholder="institution id" />
        <div className="flex gap-5">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="hospital"
              checked={selectedRole === "hospital"}
              onChange={() => setSelectedRole("hospital")}
              className="form-radio"
            />
            <span className="text-primary">Hospital</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="insurance"
              checked={selectedRole === "insurance"}
              onChange={() => setSelectedRole("insurance")}
              className=" text-primary"
            />
            <span className="text-primary">Insurance Company</span>
          </label>
        </div>
        <button
          className="h-[50px] rounded-lg bg-primary text-white px-4 py-2 "
          onClick={() => {
            setloading(true);
            const name = (document.getElementsByName("name")[0] as HTMLInputElement).value;
            const address = (document.getElementsByName("address")[0] as HTMLInputElement).value;
            const phoneNumber = (document.getElementsByName("phone_number")[0] as HTMLInputElement).value;
            const id = (document.getElementsByName("id")[0] as HTMLInputElement).value;
            supabaseClient
              .from("insurers")
              .insert({
                name,
                address,
                phone: phoneNumber,
                network_address: networkAddress,
                network_type: "",
                institution_type: selectedRole,
                official_id: id,
              })
              .then(({ error }) => {
                setloading(false);
                if (error) {
                  toast.error(error.message);
                } else {
                  setStep(3);
                }
              });
          }}
        >
          {loading ? "..." : " Submit"}
        </button>
      </div>
    );
  };

  const SuccessStep = () => {
    return (
      <div className="flex flex-col">
        <div className="w-[400px]">
          <Lottie animationData={lottie.successAnimation} autoplay loop={false} />
        </div>
        <button
          className="h-[50px] rounded-lg bg-primary font-semibold text-white px-4 py-2 "
          onClick={() => {
            if (selectedRole === "hospital") {
              window.open(routes.hospitalDashboard, "_self");
            } else {
              window.open(routes.insurerDashboard, "_self");
            }
          }}
        >
          Dashboard
        </button>
      </div>
    );
  };
  return (
    // <section className="grid grid-cols-2 w-full h-[100vh] overflow-y-hidden">
    //   <div className="h-full border-r-[1px]">
    //     <Lottie animationData={lottie.healthAnimation} />
    //   </div>
    //   <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-white">
    //     <CaAppLogo />
    //     {/* <p className="text-center text-slate-500 px-10">
    //       Join us in revolutionizing the way healthcare claims are processed! Our decentralized insurance platform
    //       offers a faster, more secure, and transparent way to manage your healthcare needs.
    //     </p> */}
    //     <div className="w-1/2 mx-auto flex flex-col gap-2">
    //       <button
    //         onClick={() => window.open(routes.insurerRegistration, "_self")}
    //         className="px-10 flex items-center justify-center gap-2 py-4 text-sm font-semibold s rounded-full bg-primary text-white hover:bg-black transition-all duration-300"
    //       >
    //         <FaBusinessTime size={24} />
    //         Sign up as Insurer
    //       </button>
    //       <button
    //         onClick={() => window.open(routes.hospitalRegistration, "_self")}
    //         className="px-10  gap-2  flex items-center justify-center  py-4 text-sm font-semibold  rounded-full bg-secondary text-white  hover:bg-black transition-all duration-300"
    //       >
    //         <FaHospital size={24} />
    //         Sign up as Hospital
    //       </button>
    //     </div>
    //     <div className="flex">
    //       <p className="text-xs ">
    //         Already have an account?{" "}
    //         <button className="hover:underline transition-all duration-300 text-sm">Login</button>
    //       </p>
    //     </div>
    //   </div>
    // </section>
    <FullscreenLayout className={`grid grid-cols-6 ${inter.className}`}>
      <div className="col-span-2 relative h-[100vh] p-10 flex flex-col justify-between bg-carina-light">
        <CaAppLogo />
        <Image src={image.svgCollection} alt="" className="absolute right-10 top-16 z-30 float" />
        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-black text-white">Complete these steps</p>
          {steps.map((step, index) => (
            <LoginStep
              key={index}
              currentStep={index + 1}
              icon={step.icon}
              description={step.description}
              title={step.title}
            />
          ))}
          <button className="w-full text-[20px] font-bold py-4 bg-carina-deep-light text-primary rounded-2xl p-2">
            Already have an account? Login
          </button>
        </div>
      </div>
      <div className="w-full h-[100vh] col-span-4 flex flex-col items-center justify-center">
        {step == 1 && (
          <>
            <div className="w-[400px]">
              <Lottie animationData={lottie.connectAnimation} />
            </div>
            <MetamaskConnection
              setnewtworKaddress={setnewtworKaddress}
              setMetamaskConnected={setMetamaskConnected}
              setStep={setStep}
              metamaskConnected={metamaskConnected}
            />
          </>
        )}
        {step == 2 && <ProfileStep />}
        {step == 3 && <SuccessStep />}
      </div>
    </FullscreenLayout>
  );
};

export default Register;
