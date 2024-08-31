"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import CaAppLogo from "~~/components/icons/CaAppLogo";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import supabaseClient from "~~/utils/supabase/supabase-client";

const ClaimPage = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync } = useScaffoldWriteContract("InsureClaim");
  const insureAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState<{
    policyholderName: string;
    policyNumber: string;
    incidentDate: string;
    incidentDescription: string;
    claimAmount: string;
    medicalReports: File[] | null;
    bankAccountDetails: string;
    declaration: boolean;
  }>({
    policyholderName: "",
    policyNumber: "",
    incidentDate: "",
    incidentDescription: "",
    claimAmount: "",
    medicalReports: null,
    bankAccountDetails: "",
    declaration: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: { target: { name: any; files: any } }) => {
    const { name, files } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: files,
    }));
  };

  const saveClaim = async (submitted: boolean) => {
    setloading(true);
    const { data, error } = await supabaseClient.from("claim").insert([
      {
        policy_name: formData.policyholderName,
        policy_id: formData.policyNumber,
        date: formData.incidentDate,
        description: formData.incidentDescription,
        claim_amount: formData.claimAmount,
        files: formData.medicalReports ? Array.from(formData.medicalReports).map(file => file.name) : [],
        account_number: formData.bankAccountDetails,
        submitted: submitted,
        address: connectedAddress,
        insurer_id: insureAddress,
      },
    ]);

    if (error) {
      console.error("Error saving claim:", error.message);
      toast.error(error.message);
      setloading(false);
      return false;
    } else {
      setloading(false);
      toast.success("Claim saved successfully");
      console.log("Claim saved successfully:", data);
      return true;
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setloading(true);
    try {
      await writeContractAsync({
        functionName: "submitClaim",
        args: [
          formData.policyholderName,
          formData.incidentDescription,
          BigInt(parseInt(formData.claimAmount)),
          insureAddress,
        ],
        value: undefined,
      });
      const claimSaved = await saveClaim(true);
      if (claimSaved) {
        window.history.back();
      }
    } catch (e: any) {
      toast.error(e.message);
      console.error("Error submitting claim:", e);
    } finally {
      setloading(false);
    }
  };

  return (
    <section className="w-full p-10 flex flex-col gap-6">
      <div className="flex justify-center">
        <CaAppLogo />
      </div>
      <h1 className="text-center text-2xl font-bold">Create a Health Claim</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Policyholder Information */}
        <input
          type="text"
          name="policyholderName"
          placeholder="Policyholder Name"
          value={formData.policyholderName}
          onChange={handleChange}
          className="py-3 px-5 w-full border rounded-full"
        />
        <input
          type="text"
          name="policyNumber"
          placeholder="Policy Number"
          value={formData.policyNumber}
          onChange={handleChange}
          className="py-3 px-5 w-full border rounded-full"
        />
        <input
          type="date"
          name="incidentDate"
          placeholder="Date of Incident"
          value={formData.incidentDate}
          onChange={handleChange}
          className="py-3 px-5 w-full border rounded-full"
        />

        {/* Claim Information */}
        <textarea
          name="incidentDescription"
          placeholder="Description of Incident"
          value={formData.incidentDescription}
          onChange={handleChange}
          className="py-3 px-5 w-full h-[200px] border rounded-lg"
        />
        <input
          type="number"
          name="claimAmount"
          placeholder="Claim Amount"
          value={formData.claimAmount}
          onChange={handleChange}
          className="py-3 px-5 w-full border rounded-full"
        />

        {/* Supporting Documentation */}
        <input
          type="file"
          name="medicalReports"
          className="py-3 px-5 w-full border rounded-full"
          onChange={handleFileChange}
          multiple
        />

        {/* Bank Account Details */}
        <input
          type="text"
          name="bankAccountDetails"
          placeholder="Bank Account Details"
          value={formData.bankAccountDetails}
          onChange={handleChange}
          className="py-3 px-5 w-full border rounded-full"
        />

        {/* Declaration and Authorization */}
        <div className="py-3 px-5 w-full border rounded-lg">
          <input
            type="checkbox"
            name="declaration"
            checked={formData.declaration}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="declaration">
            I declare that the information provided is accurate and complete to the best of my knowledge.
          </label>
        </div>
        <button type="submit" className="py-3 px-5 w-full border rounded-full bg-blue-500 text-white font-bold">
          {loading ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
    </section>
  );
};

export default ClaimPage;
