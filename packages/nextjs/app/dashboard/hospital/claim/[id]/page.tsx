"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import CaAppLogo from "~~/components/icons/CaAppLogo";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import supabaseClient from "~~/utils/supabase/supabase-client";

const ClaimPage = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync } = useScaffoldWriteContract("InsureClaim");

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
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

  // Fetch existing claim data
  useEffect(() => {
    const fetchClaimData = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient.from("claim").select("*").eq("id", id).single();

      if (error) {
        toast.error("Error fetching claim data");
        console.error("Error fetching claim data:", error.message);
      } else if (data) {
        setFormData({
          policyholderName: data.policy_name || "",
          policyNumber: data.policy_id || "",
          incidentDate: data.date || "",
          incidentDescription: data.description || "",
          claimAmount: data.claim_amount || "",
          medicalReports: data.files || null,
          bankAccountDetails: data.account_number || "",
          declaration: data.declaration || false,
        });
      }
      setLoading(false);
    };

    if (id) {
      fetchClaimData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: { target: { name: string; files: FileList } }) => {
    const { name, files } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: files,
    }));
  };

  const saveClaim = async () => {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("claim")
      .update({
        policy_name: formData.policyholderName,
        policy_id: formData.policyNumber,
        date: formData.incidentDate,
        description: formData.incidentDescription,
        claim_amount: formData.claimAmount,
        // files: formData.medicalReports ? Array.from(formData.medicalReports).map(file => file.name) : [],
        account_number: formData.bankAccountDetails,
        submitted: false,
        address: connectedAddress,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating claim:", error.message);
      toast.error(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      toast.success("Claim updated successfully");
      window.history.back();
      console.log("Claim updated successfully:", data);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await saveClaim();
  };

  return (
    <section className="w-full p-10 flex flex-col gap-6">
      <div className="flex justify-center">
        <CaAppLogo />
      </div>
      <h1 className="text-center text-2xl font-bold">{id ? "Edit" : "Create"} a Health Claim</h1>

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
        <button
          type="button"
          onClick={saveClaim}
          className="py-3 px-5 w-full border rounded-full bg-yellow-500 text-white font-bold"
        >
          {loading ? "Updating..." : "Update Claim"}
        </button>
        <button
          type="submit"
          className="py-3 px-5 w-full border rounded-full bg-blue-500 text-white font-bold"
          onClick={async () => {
            setLoading(true);
            try {
              await writeContractAsync({
                functionName: "submitClaim",
                args: [formData.policyholderName, formData.incidentDescription, BigInt(parseInt(formData.claimAmount))],
                value: undefined,
              });
            } catch (e: any) {
              toast(e.message);
              console.error("Error setting greeting:", e);
            }
          }}
        >
          {"Submit Claim"}
        </button>
      </form>
    </section>
  );
};

export default ClaimPage;
