"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash, Edit } from "lucide-react";
import Swal from "sweetalert2";
import { fetchPendingRequests, deleteRequest, updateRequest } from "../../utils/Api";
import { toast } from "react-toastify";

const HistoryPage = () => {
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "PRODUCTION") {
      router.push("/pages/login");
      toast.error("Access Denied");
      return;
    }

    const fetchData = async () => {
      const response = await fetchPendingRequests();
      setPendingRequests(response.data);
      console.log(response.data);
    };
    fetchData();
  }, [router]);

  const filteredRequests = pendingRequests.filter((req) => {
    const requestDate = new Date(req.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || requestDate >= start) && (!end || requestDate <= end);
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (requestId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteRequest(requestId);
        Swal.fire("Deleted!", "The request has been deleted.", "success");
        setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the request.", "error");
      }
    }
  };

  const handleUpdate = async (requestId, existingItems) => {
    const { value: updatedItems } = await Swal.fire({
      title: "Update Material",
      html: existingItems
        .map(
          (item, index) =>
            `<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">
              <label style="margin-bottom: 5px; font-weight: bold;">Material Name:</label>
              <input id="materialName-${index}" class="swal2-input" style="width: 80%;" value="${item.materialName}" />
              <label style="margin-bottom: 5px; margin-top: 10px; font-weight: bold;">Quantity:</label>
              <input id="requestedQuantity-${index}" type="number" class="swal2-input" style="width: 80%;" value="${item.requestedQuantity}" />
              <label style="margin-bottom: 5px; margin-top: 10px; font-weight: bold;">Unit:</label>
              <input id="unit-${index}" class="swal2-input" style="width: 80%;" value="${item.unit}" />
              <label style="margin-bottom: 5px; margin-top: 10px; font-weight: bold;">Usage Description:</label>
              <input id="usageDescription-${index}" class="swal2-input" style="width: 80%;" value="${item.usageDescription || ""}" />
            </div>`
        )
        .join(""),
      focusConfirm: false,
      preConfirm: () => {
        return existingItems.map((_, index) => ({
          materialName: document.getElementById(`materialName-${index}`).value,
          requestedQuantity: parseInt(document.getElementById(`requestedQuantity-${index}`).value, 10),
          unit: document.getElementById(`unit-${index}`).value,
          usageDescription: document.getElementById(`usageDescription-${index}`).value || "",
        }));
      },
      showCancelButton: true,
    });

    if (updatedItems) {
      try {
        const payload = { items: updatedItems };
        await updateRequest(requestId, payload);
        Swal.fire("Updated!", "The material has been updated.", "success");
        setPendingRequests(pendingRequests.map((req) => (req.id === requestId ? { ...req, items: updatedItems } : req)));
      } catch (error) {
        Swal.fire("Error!", "Failed to update the material.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-24 px-4">
        <h2 className="text-2xl font-bold text-center">History Material Requests</h2>

        {/* Date Range Filter */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <Label htmlFor="start-date">Start Date</Label>
            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <Label htmlFor="end-date">End Date</Label>
            <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Request List */}
        <div className="mt-6 space-y-4">
          {currentRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="lg:w-3/4">
                  <h4 className="text-lg font-bold">{`Request Number: ${request.requestNumber}`}</h4>
                  <p>
                    Requester <span className="text-primary font-semibold">{request.requesterUsername}</span>
                  </p>
                  <div className="mt-2">
                    <h5 className="font-medium">Materials:</h5>
                    <ul className="list-disc pl-6">
                      {request.items.map((item, index) => (
                        <li key={index}>{`Material: ${item.materialName}, Quantity: ${item.requestedQuantity} ${item.unit}`}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 font-semibold">{`Requested On: ${new Date(request.createdAt).toLocaleDateString()}`}</p>
                </div>
                <div className="flex flex-col lg:w-1/4 items-end space-y-2">
                  {/* Status with color */}
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${request.status === "APPROVED" ? "bg-green-100 text-green-800" : request.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {request.status}
                  </span>

                  {/* Update and Delete buttons only for "PENDING_APPROVAL" status */}
                  {request.status === "PENDING_APPROVAL" && (
                    <div className="flex gap-2">
                      <Button variant="" onClick={() => handleUpdate(request.id, request.items)}>
                        <Edit className="h-4 w-4" />
                        Update
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(request.id)}>
                        <Trash className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <Button variant="outline" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>
            Previous
          </Button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button variant="outline" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
