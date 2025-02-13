document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const errorMessage = document.getElementById("errorMessage");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const signupForm = document.getElementById("signupForm");
    const signupSection = document.getElementById("signupSection");
    const passwordError = document.getElementById("passwordError");

    const API_URL = "https://your-backend-app-url.azurewebsites.net"; // Change this after backend deployment
    const tokenKey = "authToken";

    function showError(message) {
        errorMessage.style.display = "block";
        errorMessage.textContent = message;
    }

    function showDashboard() {
        document.getElementById("authContainer").style.display = "none";
        document.getElementById("dashboardSection").style.display = "block";
    }

    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem(tokenKey, data.token);
                showDashboard();
            } else {
                showError(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            showError("Server error. Please try again later.");
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(tokenKey);
        location.reload();
    });

    signupBtn.addEventListener("click", () => {
        document.getElementById("authContainer").style.display = "none";
        signupSection.style.display = "block";
    });

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const signupEmail = document.getElementById("signupEmail").value;
        const signupPassword = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (signupPassword !== confirmPassword) {
            passwordError.style.display = "block";
            return;
        } else {
            passwordError.style.display = "none";
        }

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: signupEmail, password: signupPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful! Please log in.");
                signupSection.style.display = "none";
                document.getElementById("authContainer").style.display = "block";
            } else {
                alert(data.message || "Signup failed.");
            }
        } catch (error) {
            alert("Server error. Please try again later.");
        }
    });

    if (localStorage.getItem(tokenKey)) {
        showDashboard();
    }
});
