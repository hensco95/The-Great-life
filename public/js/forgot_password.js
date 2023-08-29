let emailInput = document.getElementById("email");
const form = document.getElementById("form");
let error = document.querySelector(".error");
let check_email = document.querySelector(".check_email");

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isValid = validateInputs();
  if (isValid) {
    const email = emailInput.value;
    check_email.classList.add("show_user");

    try {
      const response = await axios.post(
        "/api/v1/user/forgotpassword",
        {
          email,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = response.data;
      console.log(data);
      if (data) {
        emailInput.value = "";
        check_email.textContent = "Please Check Email For A Token";

        setTimeout(() => {
          window.location.href = "../pages/reset_password.html";
        },3000)
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        let errMsg = err.response.data.msg;

        check_email.textContent = errMsg;
      }
    }
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

const validateInputs = () => {
  const emailValue = emailInput.value;
  let status = false;
  let emailStatus = false;

  if (emailValue === "") {
    setError(email, "Email is required");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else {
    setSuccess(email);
    emailStatus = true;
  }

  if (emailStatus) {
    status = true;
  }
  return status;
};
