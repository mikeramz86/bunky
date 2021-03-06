// 'use strict';

const API_URL = "/users";

// ---------------------------------Create New Bunky (POST ENDPOINT)---------------------------------
$(".js-submit-form").submit(event => {
  event.preventDefault();
  newUser();
});

function newUser() {
  let signup_firstName = $('input[id="firstName"]').val();
  let signup_lastName = $('input[id="lastName"]').val();
  let signup_email = $('input[id="email"]').val();
  let signup_username = $('input[id="userName"]').val();
  let signup_password = $('input[id="psw"]').val();
  let signup_budget = $("input[name=budget]:checked").val();
  let signup_numRoomates = $("input[name=Roomate]:checked").val();
  let signup_culture = $("input[name=Culture]:checked").val();

  if (signup_password.length < 10) {
    alert("make sure password is more than 10 characters!");
  } else if (signup_budget === undefined) {
    alert("make sure to choose budget preference");
  } else if (signup_numRoomates === undefined) {
    alert("make sure to choose number of roomates preference");
  } else if (signup_culture === undefined) {
    alert("make sure to choose culture preference");
  } else
    postNewUser(
      signup_firstName,
      signup_lastName,
      signup_username,
      signup_password,
      signup_email,
      signup_budget,
      signup_numRoomates,
      signup_culture
    );
}

function postNewUser(
  FirstName,
  LastName,
  username,
  password,
  EmailAddress,
  budget,
  numRoomates,
  culture
) {
  console.log(
    FirstName,
    LastName,
    username,
    password,
    EmailAddress,
    budget,
    numRoomates,
    culture
  );
  $.ajax({
    url: API_URL,
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      FirstName: `${FirstName}`,
      LastName: `${LastName}`,
      username: `${username}`,
      password: `${password}`,
      EmailAddress: `${EmailAddress}`,
      budget: `${budget}`,
      numRoomates: `${numRoomates}`,
      culture: `${culture}`
    }),
    success: data => {
      if (data) {
        $(".js-success").prepend(
          `<div class='sign-up-success'><span style='vertical-align: middle;'>Hurray! You have successfully added a bunky! Now head to <a href='/dashboard.html'>Dashboard</a>!<span></div>`
        );
        $('input[id="firstName"]').val("");
        $('input[id="lastName"]').val("");
        $('input[id="userName"]').val("");
        $('input[id="email"]').val("");
        $('input[id="psw"]').val("");
        $('input[id="budget"]').val("");
        $('input[id="numRoomates"]').val("");
        $('input[id="culture"]').val("");
      }
      window.location.href = "dashboard.html";
    },

    error: (...rest) => {
      alert("Add bunky failed. Please contact bunky support");
    }
  });
}
