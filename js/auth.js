document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  const showMessage = (message, isError = false) => {
    const box = document.getElementById("authMessage");
    if (!box) return;

    box.textContent = message;
    box.style.color = isError ? "#b91c1c" : "#166534";
  };

  const getClient = () => {
    if (!window.supabaseClient) {
      throw new Error(
        "Database connection unavailable. Check your Supabase URL and publishable key."
      );
    }
    return window.supabaseClient;
  };

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!signupForm.reportValidity()) return;

      const button = signupForm.querySelector('[type="submit"]');
      button.disabled = true;

      try {
        const client = getClient();
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin + "/login.html"
          }
        });

        if (error) throw error;

        if (data.session) {
          showMessage("Account created! You can now continue to the login page.");
        } else {
          showMessage(
            "Registration received. Check your email for a confirmation link before logging in."
          );
        }

        signupForm.reset();
      } catch (error) {
        showMessage(error.message || "Registration failed.", true);
      } finally {
        button.disabled = false;
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!loginForm.reportValidity()) return;

      const button = loginForm.querySelector('[type="submit"]');
      button.disabled = true;

      try {
        const client = getClient();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const { error } = await client.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        showMessage("Login successful! Opening your student application...");
        window.location.href = "application.html";
      } catch (error) {
        showMessage(
          error.message || "Login failed. Check your email and password.",
          true
        );
      } finally {
        button.disabled = false;
      }
    });
  }
});
