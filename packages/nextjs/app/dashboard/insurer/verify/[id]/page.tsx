"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import CaAppLogo from "~~/components/icons/CaAppLogo";
import FullscreenLayout from "~~/components/layout/FullscreenLayout";
import supabaseClient from "~~/utils/supabase/supabase-client";

const InsurerClaimDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      supabaseClient
        .from("claim")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          setLoading(false);
          if (error) {
            console.error(error);
          }
          if (data) {
            setClaim(data);
          }
        });
    }
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;

    setApproving(true);
    const { error } = await supabaseClient.from("claim").update({ is_approved: true }).eq("id", id);

    setApproving(false);
    if (error) {
      console.error("Error approving claim:", error.message);
      toast.error(error.message);
    } else {
      toast.success("Claim approved successfully");
      router.push("/dashboard/insurer"); // Redirect to the claims list page
    }
  };

  const handleReject = async () => {
    if (!id) return;

    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    setApproving(true);
    const { error } = await supabaseClient
      .from("claim")
      .update({ is_approved: false, rejection_reason: rejectionReason })
      .eq("id", id);

    setApproving(false);
    if (error) {
      console.error("Error rejecting claim:", error.message);
      toast.error(error.message);
    } else {
      toast.success("Claim rejected successfully");
      router.push("/dashboard/insurer"); // Redirect to the claims list page
    }
  };

  if (loading) {
    return (
      <FullscreenLayout>
        <div className="p-10">
          <p>Loading claim details...</p>
        </div>
      </FullscreenLayout>
    );
  }

  return (
    <FullscreenLayout className="flex flex-col">
      <nav className="px-10 py-5 flex items-center justify-between border-b">
        <CaAppLogo />
      </nav>

      <div className="p-10">
        {claim ? (
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Claim Details</h1>
            <p>
              <strong>Policy Name:</strong> {claim.policy_name || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {dayjs(claim.date).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Description:</strong> {claim.description || "N/A"}
            </p>
            <p>
              <strong>Claim Amount:</strong>{" "}
              {claim.claim_amount?.toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              }) || "N/A"}
            </p>
            <p>
              <strong>Submitted:</strong> {claim.submitted ? "Yes" : "No"}
            </p>
            <p>
              <strong>Paid:</strong> {claim.is_paid ? "Yes" : "No"}
            </p>
            <p>
              <strong>Approved:</strong> {claim.is_approved ? "Yes" : "No"}
            </p>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleApprove}
                disabled={approving || claim.is_approved}
                className="py-3 px-5 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                {approving ? "Approving..." : "Approve Claim"}
              </button>
              <button
                onClick={() => setShowRejectionInput(true)}
                disabled={approving || !id}
                className="py-3 px-5 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                {approving ? "Rejecting..." : "Reject Claim"}
              </button>
            </div>

            {showRejectionInput && (
              <div className="mt-4">
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                />
                <button
                  onClick={handleReject}
                  disabled={approving}
                  className="mt-3 py-3 px-5 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  {approving ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>No claim details available.</p>
        )}
      </div>
    </FullscreenLayout>
  );
};

export default InsurerClaimDetailPage;
