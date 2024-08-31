"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAccount } from "wagmi";
import CaAppLogo from "~~/components/icons/CaAppLogo";
import FullscreenLayout from "~~/components/layout/FullscreenLayout";
import supabaseClient from "~~/utils/supabase/supabase-client";

const InsurerClaimsPage = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const { address: connectedAddress } = useAccount();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connectedAddress) {
      setLoading(true);
      supabaseClient
        .from("claim")
        .select("*")
        .eq("insurer_id", connectedAddress) // Assuming insurer_id matches the connectedAddress
        .then(({ data, error }) => {
          setLoading(false);
          if (error) {
            console.error(error);
          }
          if (data) {
            setClaims(data);
          }
        });
    }
  }, [connectedAddress]);

  return (
    <FullscreenLayout className="flex flex-col">
      <nav className="px-10 py-5 flex items-center justify-between border-b">
        <CaAppLogo />
      </nav>

      <div className="p-10">
        {loading ? (
          <p>Loading claims...</p>
        ) : claims.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    #
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Policy Name
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Date
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Description
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Claim Amount
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Submitted
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Paid
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Approved
                  </th>
                  <th className="py-3 px-6 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 border-b border-gray-200">{index + 1}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{claim.policy_name || "N/A"}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{dayjs(claim.date).format("DD/MM/YYYY")}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{claim.description || "N/A"}</td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {claim.claim_amount?.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                      }) || "N/A"}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          claim.submitted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {claim.submitted ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          claim.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {claim.is_paid ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          claim.is_approved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {claim.is_approved ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          window.location.href = `/dashboard/insurer/verify/${claim.id}`; // Adjust this URL as needed
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No claims found.</p>
        )}
      </div>
    </FullscreenLayout>
  );
};

export default InsurerClaimsPage;
