'use strict';

const API_URL = 'http://localhost:8080/users';

// Create New Account
$('.js-submit-form').submit(event => {
    event.preventDefault();
    newUser();
})

function newUser() {
    let signup_firstName = $('input[id="js-signup-firstName"]').val();
    let signup_lastName = $('input[id="js-signup-lastName"]').val();
    let signup_username = $('input[id="js-signup-username"]').val();
    let signup_email = $('input[id="js-signup-email"]').val();
    let signup_password = $('input[id="js-signup-password"]').val();
    let signup_budget = $("input[name=budget]:checked").val();;
    let signup_numRoomates = $("input[name=Roomate]:checked").val();
    let signup_culture = $("input[name=Culture]:checked").val();
    postNewUser(signup_firstName, signup_lastName, signup_username, signup_email, signup_password, signup_budget,signup_numRoomates,signup_culture);
}


function postNewUser (firstName, lastName, username, email, password, budget, numRoomates,culture) {
    $('.sign-up-failure').remove();
    $.ajax({
        url: '/api/users',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data:   {
            FirstName: `${FirstName}`,
            LastName: `${EmailAddress}`,
            password: `${password}`,
            username: `${username}`,
            EmailAddress: `${withPlace}`,
            budget: `${budget}`,
            numRoomates: `${numRoomates}`,
            culture: `${culture}`
        },
        success: (data) => {
            if(data) {
                $('.js-submit-form').prepend(
                    `<div class='sign-up-success'><span style='vertical-align: middle;'>Hurray! You have successfully signed up! Now you can <a href='/'>login</a>!<span></div>`
                )
                $('input[id="js-signup-firstName"]').val('');
                $('input[id="js-signup-lastName"]').val('');
                $('input[id="js-signup-username"]').val('');
                $('input[id="js-signup-email"]').val('');
                $('input[id="js-signup-password"]').val('');
                $('input[id="js-signup-password"]').val('');
                $('input[id="js-signup-password"]').val('');
                $('input[id="js-signup-password"]').val('');
            }
        },
        error: (...rest) => {
            $('.js-submit-form').prepend(
                `
                    <div class='sign-up-failure'>
                        <p>Ohh noo! This email has already been used for signup.</p>
                        <p>Login or try a different email</p>
                    </div>
                `
            )
        }
    })
}