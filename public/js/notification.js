// ========= Nav Links Responsive Toggle ==========
function userToggle() {
    let userProfile = document.getElementById("myTopnav");
    if (userProfile.className === "navLinks") {
      userProfile.className += " responsive";
    } else {
      userProfile.className = "navLinks";
    }
  }
  