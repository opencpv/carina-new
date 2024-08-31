"use client";

import { useState } from "react";
import cn from "classnames";
import Lottie from "lottie-react";
import toast from "react-hot-toast";
import MetamaskConnection from "~~/components/MetamaskConnection";
import FullscreenLayout from "~~/components/layout/FullscreenLayout";
import useAssets from "~~/hooks/useAssets";
import supabaseClient from "~~/utils/supabase/supabase-client";

const InsurerRegistration = () => {
  const [step, setStep] = useState(1);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  //   const networkColor = useNetworkColor();
  const [newtworkaddress, setnewtworKaddress] = useState<string>();
  const [loading, setloading] = useState(false);
  const { lottie } = useAssets();
  const UserDetails = () => {
    return (
      <div className="w-full flex flex-col gap-3">
        <input
          type="text"
          placeholder="Institution name"
          className="py-3  px-5 w-full border rounded-full"
          name="name"
          //   onChange={e => setname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Institution address"
          className="py-3  px-5 w-full border rounded-full"
          //   onChange={e => setaddress(e.target.value)}
          name="address"
        />
        <input
          type="text"
          placeholder="Institution phone"
          className="py-3  px-5 w-full border rounded-full"
          //   onChange={e => setphone(e.target.value)}
          name="phone"
        />
        <button
          className="py-3  bg-primary hover:bg-black text-white rounded-full"
          onClick={() => {
            const nameValue = (document.getElementsByName("name")[0] as HTMLInputElement)?.value;
            const phoneValue = (document.getElementsByName("phone")[0] as HTMLInputElement)?.value;
            const addressValue = (document.getElementsByName("address")[0] as HTMLInputElement)?.value;
            setloading(true);
            supabaseClient
              .from("insurers")
              .insert({
                name: nameValue,
                address: addressValue,
                phone: phoneValue,
                network_type: "",
                network_address: newtworkaddress,
              })
              .select()
              .then(({ error }) => {
                if (!error) {
                  setloading(false);
                  setStep(3);
                } else {
                  console.log(error);
                  setloading(false);
                  toast.error(error.message);
                }
              });
          }}
        >
          {loading ? "..." : "Submit"}
        </button>
      </div>
    );
  };

  const Success = () => {
    return (
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="my-0 py-0 text-left w-full">You have successfully registered</p>
        <Lottie animationData={lottie.congratsAnimation} style={{ width: 200, height: 200 }} />
        <button className="w-full py-3 bg-primary text-white  text-sm font-semibold rounded-full">
          Go To Dashboard
        </button>
      </div>
    );
  };
  return (
    <FullscreenLayout className="flex p-10 items-center justify-center flex-col bg-carina">
      <div className="w-[500px] flex flex-col gap-5   rounded-xl p-10 shadow-lg bg-white">
        <div className="flex gap-2">
          <div
            className={cn(
              "h-[30px] w-fit px-5 flex items-center justify-center rounded-full text-xs font-medium",
              metamaskConnected
                ? "bg-secondary text-white"
                : step === 1
                ? "bg-yellow-400 text-black"
                : "bg-black text-white",
            )}
          >
            <p>Step 1</p>
          </div>
          <div
            className={cn(
              "h-[30px] w-fit px-5 flex items-center justify-center rounded-full text-xs font-medium",
              metamaskConnected && step > 2
                ? "bg-secondary text-white"
                : step === 2
                ? "bg-yellow-400 text-black"
                : "bg-black text-white",
            )}
          >
            <p>Step 2</p>
          </div>
          <div
            className={cn(
              "h-[30px] w-fit px-5 flex items-center justify-center rounded-full text-xs font-medium",
              metamaskConnected && step > 3
                ? "bg-secondary text-white"
                : step === 3
                ? "bg-yellow-400 text-black"
                : "bg-black text-white",
            )}
          >
            <p>Step 3</p>
          </div>
        </div>
        {step === 1 && (
          <MetamaskConnection
            setnewtworKaddress={setnewtworKaddress}
            setMetamaskConnected={setMetamaskConnected}
            setStep={setStep}
            metamaskConnected={metamaskConnected}
          />
        )}
        {step === 2 && <UserDetails />}
        {step === 3 && <Success />}
      </div>
    </FullscreenLayout>
  );
};

export default InsurerRegistration;
