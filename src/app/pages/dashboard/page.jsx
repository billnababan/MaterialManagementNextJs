"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search } from "lucide-react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchPendingRequests, approveRequest, rejectRequest } from "../../utils/Api";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  // console.log(requests);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "WAREHOUSE") {
      router.push("/pages/login");
      toast.error("Access Denied");
      return;
    }

    const loadRequests = async () => {
      const response = await fetchPendingRequests();
      setRequests(response.data);
      console.log(response.data.map((request) => request.id));
      setFilteredRequests(response.data);
    };

    loadRequests();
  }, [router]);

  const handleApprove = async (requestId) => {
    try {
      await approveRequest(requestId);
      console.log(requestId);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "Approved by Warehouse" } : r)));
      setFilteredRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "Approved by Warehouse" } : r)));
      Swal.fire("Success", "Request approved successfully.", "success");
    } catch (error) {
      console.error("Approve Request Error:", error);
      toast.error("Failed to approve request.");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      await rejectRequest(selectedRequest.id, rejectReason);
      setRequests((prev) => prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: "Not Approved by Warehouse", reason: rejectReason } : r)));
      setFilteredRequests((prev) => prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: "Not Approved by Warehouse", reason: rejectReason } : r)));
      Swal.fire("Success", "Request rejected successfully.", "success");

      setShowRejectModal(false);
    } catch (error) {
      console.error("Reject Request Error:", error);
      toast.error("Failed to reject request.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setFilteredRequests(requests.filter((req) => req.requesterUsername.toLowerCase().includes(e.target.value.toLowerCase())));
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const variants = {
      "Approved by Warehouse": "success",
      Pending: "warning",
      "Not Approved by Warehouse": "destructive",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleShowDetails = async (request) => {
    setSelectedRequest(request);

    await Swal.fire({
      title: `Request ID: REQ-${request.id}`,
      html: `
        <div class="text-sm">
          <h3 class="font-semibold">Materials:</h3>
          <ul class="ml-4 space-y-2">
            ${request.items
              .map(
                (item) => `
              <li>
                <strong>${item.materialName}</strong> - ${item.requestedQuantity} ${item.unit}
                <p class="text-gray-600">${item.usageDescription}</p>
              </li>`
              )
              .join("")}
          </ul>
        </div>
      `,

      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Close",
      confirmButtonColor: "#3085d6",
      customClass: {
        popup: "bg-white shadow-xl rounded-lg p-6", // Custom modal styling
        title: "text-xl font-bold text-gray-800", // Title styling
        content: "text-sm text-gray-700", // Content styling
        confirmButton: "bg-blue-500 text-white hover:bg-blue-600",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8">
          <div className="mt-24 flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome to the Warehouse Dashboard, <span className="text-primary">{user?.username || "Guest"}</span>
            </h2>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <input type="text" placeholder="Search by Request Name" className="border rounded px-2 py-1" value={searchQuery} onChange={handleSearch} />
            </div>
          </div>

          <div className="rounded-lg border bg-card overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.requestNumber}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.requesterUsername}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowDetails(request)} // Show request details
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        {request.status === "APPROVED" && <Badge variant="success">Has Been Approved</Badge>}

                        {request.status === "REJECTED" && <Badge variant="destructive">Not Approved</Badge>}

                        {request.status === "PENDING_APPROVAL" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleApprove(request.id)}>
                              <CheckCircle className="h-4 w-4" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectModal(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
              Next
            </Button>
          </div>

          {/* View Details Modal */}
          {showDetailsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded p-4 w-full max-w-md">
                <h2 className="text-lg font-bold mb-2 text-center">Request Details</h2>
                <div>
                  <h3 className="text- px-[25px] font-bold">Materials :</h3>
                  <ul>
                    {selectedRequest.items.map((item, index) => (
                      <li key={index}>
                        <strong>{item.materialName}</strong> - {item.requestedQuantity} {item.unit}
                        <p>{item.usageDescription}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}

          {/* Modals */}
          {showApproveModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded p-4 w-full max-w-md">
                <h2 className="text-lg font-bold mb-2">Confirm Approval</h2>
                <p>Are you sure you want to approve request #{selectedRequest.requestNumber}?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleApprove}>Yes</Button>
                  <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showRejectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded p-4 w-full max-w-md">
                <h2 className="text-lg font-bold mb-2">Reject Request</h2>
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter rejection reason" className="border rounded w-full p-2 mb-4" />
                <div className="flex justify-end gap-2">
                  <Button onClick={handleReject}>Submit</Button>

                  <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <ToastContainer />
        </main>
      </div>
    </div>
  );
}
