"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send, Trash, Edit } from "lucide-react";
import Swal from "sweetalert2";
import { createRequest, updateRequest, deleteRequest, fetchPendingRequests } from "../../utils/Api";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function MaterialRequestForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([{ materialName: "", requestedQuantity: "", unit: "", usageDescription: "" }]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "PRODUCTION") {
      router.push("/pages/login");
      toast.error("Access Denied");
      return;
    }

    const fetchRequests = async () => {
      const response = await fetchPendingRequests();
      setPendingRequests(response.data);
    };
    fetchRequests();
  }, [router]);

  const handleAddItem = () => {
    setItems([...items, { materialName: "", requestedQuantity: "", unit: "", usageDescription: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await createRequest({ items });
      Swal.fire("Success", "Request created successfully!", "success");
      setItems([{ materialName: "", requestedQuantity: "", unit: "", usageDescription: "" }]); // Reset the form
    } catch (error) {
      Swal.fire("Error", "Failed to create request!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pl-64">
        <main className="container mx-auto max-w-2xl px-4 py-8">
          {/* Create Request Section */}
          <div className="mt-24">
            <div className="flex items-center justify-between flex-wrap">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Create Material Request</h2>
                <p className="text-muted-foreground mt-2">
                  Welcome back, <span className="text-primary">{user?.username || "Guest"}</span>! Create your material request below.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Request ID:</span>
                <span className="font-mono">REQ-{String(Date.now()).slice(-6)}</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {items.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`materialName-${index}`}>Material Name</Label>
                    <Input
                      id={`materialName-${index}`}
                      placeholder="Enter material name"
                      value={item.materialName}
                      onChange={(event) => {
                        const newItems = [...items];
                        newItems[index].materialName = event.target.value;
                        setItems(newItems);
                      }}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        placeholder="Enter quantity"
                        value={item.requestedQuantity}
                        onChange={(event) => {
                          const newItems = [...items];
                          newItems[index].requestedQuantity = event.target.value;
                          setItems(newItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`unit-${index}`}>Unit</Label>
                      <Input
                        id={`unit-${index}`}
                        placeholder="Enter unit"
                        value={item.unit}
                        onChange={(event) => {
                          const newItems = [...items];
                          newItems[index].unit = event.target.value;
                          setItems(newItems);
                        }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`description-${index}`}>Usage Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      placeholder="Enter usage description"
                      value={item.usageDescription}
                      onChange={(event) => {
                        const newItems = [...items];
                        newItems[index].usageDescription = event.target.value;
                        setItems(newItems);
                      }}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {index > 0 && (
                  <Button variant="ghost" size="sm" className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveItem(index)}>
                    Remove Item
                  </Button>
                )}
              </Card>
            ))}

            <div className="flex gap-4 flex-wrap">
              <Button variant="outline" onClick={handleAddItem} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Another Item
              </Button>
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
