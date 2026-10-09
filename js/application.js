document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fundingForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("formMessage");

    if (!form.reportValidity()) return;

    if (!window.supabaseClient) {
      message.textContent =
        "The database is not connected yet. Please try again later.";
      return;
    }

    const data = new FormData(form);

    const application = {
      full_name: data.get("fullName"),
      email: data.get("email"),
      country: data.get("country"),
      education_level: data.get("educationLevel"),
      institution: data.get("institution"),
      program: data.get("program"),
      study_start: data.get("studyStart") || null,
      funding_type: data.get("fundingType"),
      requested_amount: Number(data.get("requestedAmount")),
      funding_purpose: data.get("fundingPurpose"),
      additional_info: data.get("additionalInfo") || null
    };

    message.textContent = "Submitting your application...";

    try {
      const { error } = await window.supabaseClient
        .from("funding_applications")
        .insert(application);

      if (error) throw error;

      message.textContent =
        "Your application was submitted successfully!";
      form.reset();
    } catch (error) {
      console.error("Application submission failed:", error);
      message.textContent =
        "Submission failed. Please check your account, database permissions, and connection.";
    }
  });
});
