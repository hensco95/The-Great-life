const form = document.getElementById("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
let logged_in = document.querySelector(".logged_in");

function getCookieValue(cookieName) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isValid = validateInputs();
  if (isValid) {
    const email = emailInput.value;
    const password = passwordInput.value;
    logged_in.classList.add("show_user");

    try {
      const response = await axios.post(
        "/api/v1/user/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data) {
        // console.log(data.username);
        const userName = data.username;
        logged_in.textContent = "Log in Successful";

        emailInput.value = "";
        passwordInput.value = "";
        setTimeout(() => {
          logged_in.classList.remove("show_user");
        }, 1000);

        setTimeout(() => {
          window.location.href = `../pages/home_page.html?name=${userName}`;
        }, 500);
        window.history.replaceState(
          {},
          document.title,
          `../pages/home_page.html?name=${userName}`
        );
        window.history.replaceState(null, document.title, window.location.href);
      }
    } catch (err) {
      if (err.response) {
        // console.log(err.response.status);
        // console.log(err.message);
        // console.log(err.response.headers); // 👉️ {... response headers here}
        console.log(err.response.data);
        let errMsg = err.response.data.msg; // 👉️ {... response data here}
        logged_in.textContent = errMsg;
      }
    }

    // location.href = "home_page.html"
  }
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  let status = false;
  let emailStatus = false;
  let passStatus = false;

  if (emailValue === "") {
    setError(email, "Email or Username is required");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else {
    setSuccess(email);
    emailStatus = true;
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 character.");
  } else {
    setSuccess(password);
    passStatus = true;
  }

  if (emailStatus && passStatus) {
    status = true;
  }
  return status;
};

function togglePW() {
  let password = document.getElementById("password");

  if (password.getAttribute("type") === "password") {
    password.setAttribute("type", "text");
    document.getElementById("eye").style.color = "#fff";
  } else {
    password.setAttribute("type", "password");
    document.getElementById("eye").style.color = "#000";
  }
}
