"use client";
import { useState, useEffect, createElement as h } from "react";

export default function TraineesPage() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/trainees");
      const data = await response.json();
      if (data.success) {
        setTrainees(data.trainees);
      }
    } catch (error) {
      console.error("Error fetching trainees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrainee = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/admin/trainees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        alert("Trainee created successfully!");
        setShowCreateModal(false);
        resetForm();
        fetchTrainees();
      } else {
        alert(data.error || "Failed to create trainee");
      }
    } catch (error) {
      console.error("Error creating trainee:", error);
      alert("Failed to create trainee");
    }
  };

  const handleUpdateTrainee = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/admin/trainees/${selectedTrainee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        alert("Trainee updated successfully!");
        setShowCreateModal(false);
        setSelectedTrainee(null);
        resetForm();
        fetchTrainees();
      } else {
        alert(data.error || "Failed to update trainee");
      }
    } catch (error) {
      console.error("Error updating trainee:", error);
      alert("Failed to update trainee");
    }
  };

  const handleDeleteTrainee = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this trainee? All their data will also be deleted."
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/trainees/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        alert("Trainee deleted successfully!");
        fetchTrainees();
      } else {
        alert(data.error || "Failed to delete trainee");
      }
    } catch (error) {
      console.error("Error deleting trainee:", error);
      alert("Failed to delete trainee");
    }
  };

  const handleEditTrainee = (trainee) => {
    setFormData({
      username: trainee.username || "",
      email: trainee.email || "",
      password: "",
      firstName: trainee.firstName || "",
      lastName: trainee.lastName || "",
      location: trainee.location || "",
      phone: trainee.phone || "",
    });
    setSelectedTrainee(trainee);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      location: "",
      phone: "",
    });
  };

  const handleBackToDashboard = () => {
    window.location.href = "/admin/dashboard";
  };

  const filteredTrainees = trainees.filter((trainee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      trainee.firstName?.toLowerCase().includes(searchLower) ||
      trainee.lastName?.toLowerCase().includes(searchLower) ||
      trainee.email?.toLowerCase().includes(searchLower) ||
      trainee.username?.toLowerCase().includes(searchLower) ||
      trainee.location?.toLowerCase().includes(searchLower)
    );
  });

  return h(
    "div",
    { className: "bg-gray-50 min-h-screen w-full p-0 m-0" },
    h(
      "div",
      { className: "w-full h-full flex flex-col items-stretch justify-start" },
      h(
        "div",
        {
          className:
            "bg-white/10 backdrop-blur-md border border-white/20 min-h-screen w-full p-8 shadow flex flex-col rounded-none",
        },
        h(
          "button",
          {
            onClick: handleBackToDashboard,
            className:
              "mb-6 self-start bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-2 rounded shadow flex items-center gap-2",
          },
          h("span", null, "←"),
          " Back to Dashboard"
        ),

        h(
          "h1",
          {
            className:
              "text-4xl font-extrabold text-green-700 text-center w-full mb-8",
          },
          "TRAINEES"
        ),

        h(
          "div",
          { className: "flex justify-between mb-6 w-full" },
          h("input", {
            className:
              "w-full max-w-lg border-2 border-gray-700 rounded-lg px-4 py-2 text-black focus:outline-green-700",
            type: "text",
            placeholder: "Search trainees...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
          }),
          h(
            "button",
            {
              className:
                "bg-green-700 hover:bg-green-800 text-white text-lg font-semibold px-6 py-2 rounded shadow ml-4",
              onClick: () => {
                resetForm();
                setSelectedTrainee(null);
                setShowCreateModal(true);
              },
            },
            "+ Create Trainee"
          )
        ),

        loading
          ? h(
              "div",
              { className: "text-center py-12" },
              h("div", {
                className:
                  "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600",
              }),
              h(
                "p",
                { className: "mt-4 text-gray-600" },
                "Loading trainees..."
              )
            )
          : h(
              "div",
              { className: "overflow-auto w-full" },
              h(
                "table",
                { className: "w-full min-w-[800px]" },
                h(
                  "thead",
                  null,
                  h(
                    "tr",
                    null,
                    h(
                      "th",
                      {
                        className:
                          "px-4 py-4 bg-gray-100 text-green-700 text-lg font-bold text-left rounded-tl-lg",
                      },
                      "Name"
                    ),
                    h(
                      "th",
                      {
                        className:
                          "px-4 py-4 bg-gray-100 text-green-700 text-lg font-bold text-left",
                      },
                      "Email"
                    ),
                    h(
                      "th",
                      {
                        className:
                          "px-4 py-4 bg-gray-100 text-green-700 text-lg font-bold text-left",
                      },
                      "Username"
                    ),
                    h(
                      "th",
                      {
                        className:
                          "px-4 py-4 bg-gray-100 text-green-700 text-lg font-bold text-left",
                      },
                      "Location"
                    ),
                    h(
                      "th",
                      {
                        className:
                          "px-4 py-4 bg-gray-100 text-green-700 text-lg font-bold text-left",
                      },
                      "Phone"
                    ),
                    h(
                      "th",
                      {
                        className:
                          "px-4 py-4 bg-gray-100 text-green-700 text-lg font-bold text-center rounded-tr-lg",
                      },
                      "Actions"
                    )
                  )
                ),
                h(
                  "tbody",
                  null,
                  filteredTrainees.map((trainee) =>
                    h(
                      "tr",
                      {
                        key: trainee.id,
                        className:
                          "border-b last:border-0 hover:bg-gray-50 transition",
                      },
                      h(
                        "td",
                        { className: "px-4 py-3 text-gray-800 font-medium" },
                        `${trainee.firstName} ${trainee.lastName}`
                      ),
                      h(
                        "td",
                        { className: "px-4 py-3 text-gray-800" },
                        trainee.email
                      ),
                      h(
                        "td",
                        { className: "px-4 py-3 text-gray-800" },
                        trainee.username
                      ),
                      h(
                        "td",
                        { className: "px-4 py-3 text-gray-800" },
                        trainee.location || "-"
                      ),
                      h(
                        "td",
                        { className: "px-4 py-3 text-gray-800" },
                        trainee.phone || "-"
                      ),
                      h(
                        "td",
                        { className: "px-4 py-3 text-center" },
                        h(
                          "div",
                          { className: "flex justify-center gap-2" },
                          h(
                            "button",
                            {
                              onClick: () => handleEditTrainee(trainee),
                              className:
                                "text-blue-600 hover:text-blue-800 font-bold hover:underline px-2",
                              title: "Edit Trainee",
                            },
                            "✏️ Edit"
                          ),
                          h(
                            "button",
                            {
                              onClick: () => handleDeleteTrainee(trainee.id),
                              className:
                                "text-red-600 font-bold hover:underline px-2",
                              title: "Delete Trainee",
                            },
                            "Delete"
                          )
                        )
                      )
                    )
                  ),
                  !filteredTrainees.length &&
                    h(
                      "tr",
                      null,
                      h(
                        "td",
                        {
                          colSpan: 6,
                          className: "text-center py-8 text-gray-500",
                        },
                        "No trainees found."
                      )
                    )
                )
              )
            )
      )
    ),

    // Create/Edit Trainee Modal
    showCreateModal &&
      h(
        "div",
        {
          className:
            "fixed inset-0 bg-black/30 flex items-center justify-center z-30",
        },
        h(
          "div",
          {
            className:
              "bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-5",
          },
          h(
            "h2",
            { className: "text-green-700 text-2xl font-extrabold text-center" },
            selectedTrainee ? "Edit Trainee" : "Create New Trainee"
          ),

          ["firstName", "lastName", "username", "email", "password", "location", "phone"].map((field) =>
            h(
              "label",
              { key: field, className: "font-semibold block text-black" },
              field.charAt(0).toUpperCase() + field.slice(1),
              h("input", {
                type: field === "email" ? "email" : field === "password" ? "password" : "text",
                value: formData[field],
                onChange: (e) =>
                  setFormData({ ...formData, [field]: e.target.value }),
                className:
                  "block w-full mt-2 px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-800",
              })
            )
          ),

          h(
            "div",
            { className: "flex justify-end gap-4 mt-3" },
            h(
              "button",
              {
                onClick: () => {
                  setShowCreateModal(false);
                  setSelectedTrainee(null);
                },
                className:
                  "border border-green-700 text-green-700 px-6 py-2 rounded font-bold shadow",
              },
              "Cancel"
            ),
            h(
              "button",
              {
                onClick: selectedTrainee
                  ? handleUpdateTrainee
                  : handleCreateTrainee,
                className:
                  "bg-green-700 text-white font-bold px-6 py-2 rounded shadow",
              },
              selectedTrainee ? "Update Trainee" : "Create Trainee"
            )
          )
        )
      )
  );
}

