const form = document.getElementById("form");
const fullnames = document.getElementById("fullnames");
const countryInput = document.getElementById("country");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const password2Input = document.getElementById("password2");
// const popup = document.getElementById("popup");
let registered = document.querySelector(".registered");

// form.addEventListener('submit', event => {
//   event.preventDefault();
//  if(validateInputs()){
//   location.href = "home_page.html"
//  }

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // if (validateInputs()) {
  //   popup.classList.add("open-popup");
  // }
  const isValid = validateInputs();
  if (isValid) {
    const name = fullnames.value;
    const country = countryInput.value;
    const number = phoneInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirm_password = password2Input.value;
    registered.classList.add("show_user");

    try {
      const response = await axios.post(
        "/api/v1/user/register",
        {
          name,
          country,
          number,
          email,
          password,
          confirm_password,
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
        fullnames.value = "";
        countryInput.value = "";
        phoneInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        password2Input.value = "";
        registered.textContent = "User registered";
        // remove pop up text in one second after user is registered 
        setTimeout(() => {
          registered.classList.remove("show_user");
        }, 1000);
        
        setTimeout(() => {
          window.location.href = "../pages/sign_in.html";
        },1800);
      }
      // setTimeout(() => {
      //   window.location.href = "../pages/sign_in.html";
      // }, 1000);
    } catch (err) {
      if (err.response) {
        // console.log(err.response.status);
        // console.log(err.message);
        // console.log(err.response.headers); // 👉️ {... response headers here}
        console.log(err.response.data);
        let errMsg = err.response.data.msg; // 👉️ {... response data here}
        registered.textContent = errMsg;
      }
    }
  }

  //   else{
  //     function closePopup() {
  //       popup.classList.remove("open-popup");
  //       location.href = "home_page.html"
  //     }
  //  }
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
  const usernameValue = fullnames.value;
  const countryValue = countryInput.value;
  const phoneValue = phoneInput.value.trim();
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value.trim();
  const password2Value = password2Input.value.trim();
  let status = false;
  let fullNameStatus = false;
  let countryStatus = false;
  let phoneStatus = false;
  let emailStatus = false;
  let passStatus = false;
  let pass2Status = false;

  if (usernameValue === "") {
    setError(fullnames, "Fullnames are required");
  } else {
    setSuccess(fullnames);
    fullNameStatus = true;
  }

  if (countryValue === "select country") {
    setError(country, "Please select country");
  } else {
    setSuccess(country);
    countryStatus = true;
  }

  if (phoneValue === "") {
    setError(phone, "Phone number is required");
  } else if (phoneValue.length < 10) {
    setError(phone, "Phone number must be at least 10 digits.");
  } else {
    setSuccess(phone);
    phoneStatus = true;
  }

  if (emailValue === "") {
    setError(email, "Email is required");
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

  if (password2Value === "") {
    setError(password2, "Please confirm your password");
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match");
  } else {
    setSuccess(password2);
    pass2Status = true;
  }

  if (
    fullNameStatus &&
    countryStatus &&
    phoneStatus &&
    emailStatus &&
    passStatus &&
    pass2Status
  ) {
    status = true;
  }
  return status;
};

// function country_code() {
//   let val = document.getElementById("country").value;

//   if (val === "select_country") {
//     document.getElementById("phone").value = "";
//   } else if (val === "ng") {
//     document.getElementById("phone").value = "+234";
//   } else if (val === "gh") {
//     document.getElementById("phone").value = "+233";
//   } else if (val === "us") {
//     document.getElementById("phone").value = "+1";
//   } else if (val === "sa") {
//     document.getElementById("phone").value = "+27";
//   } else if (val === "uk") {
//     document.getElementById("phone").value = "+380";
//   }
// }

function togglePW1() {
  let password = document.getElementById("password");

  if (password.getAttribute("type") === "password") {
    password.setAttribute("type", "text");
    document.getElementById("eye").style.color = "#fff";
  } else {
    password.setAttribute("type", "password");
    document.getElementById("eye").style.color = "#000";
  }
}

function togglePW2() {
  let password = document.getElementById("password2");

  if (password.getAttribute("type") === "password") {
    password.setAttribute("type", "text");
    document.getElementById("eye2").style.color = "#fff";
  } else {
    password.setAttribute("type", "password");
    document.getElementById("eye2").style.color = "#000";
  }
}
