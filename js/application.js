document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fundingForm");
  if (!form) return;

  let submitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitting) return;

    const message = document.getElementById("formMessage");
    const submitButton = document.getElementById("submitBtn");

    try {
      const client = window.supabaseClient;

      if (!client) {
        throw new Error(
          "Database connection unavailable. Check js/supabase.js."
        );
      }

      // Require a signed-in student.
      const { data: sessionData, error: sessionError } =
        await client.auth.getSession();

      if (sessionError) throw sessionError;

      const session = sessionData.session;

      if (!session) {
        message.textContent =
          "Please log in before submitting your funding application.";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
        return;
      }

      // Validate the consent checkbox.
      const consent = document.getElementById("consent");

      if (!consent || !consent.checked) {
        message.textContent =
          "Please confirm your consent before submitting.";
        return;
      }

      const getValue = (name) => {
        const field = form.elements.namedItem(name);
        return field ? field.value.trim() : "";
      };

      const amount = Number(getValue("requestedAmount"));

      if (!Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Enter a valid funding amount.";
        return;
      }

      const application = {
        user_id: session.user.id,
        full_name: getValue("fullName"),
        email: session.user.email,
        country: getValue("country"),
        education_level: getValue("educationLevel"),
        institution: getValue("institution"),
        program: getValue("program"),
        study_start: getValue("studyStart") || null,
        funding_type: getValue("fundingType"),
        requested_amount: amount,
        funding_purpose: getValue("fundingPurpose"),
        additional_info: getValue("additionalInfo") || null
      };

      submitting = true;
      if (submitButton) submitButton.disabled = true;

      message.textContent = "Submitting your application...";

      const { error } = await client
        .from("funding_applications")
        .insert(application);

      if (error) throw error;

      message.textContent =
        "Success! Your funding application has been submitted.";

      form.reset();

    } catch (error) {
      console.error("Application submission error:", error);

      message.textContent =
        "Submission failed. Check your database table, connection, and security policies, then try again.";

    } finally {
      submitting = false;
      if (submitButton) submitButton.disabled = false;
    }
  });
});
