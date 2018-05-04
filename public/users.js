'use strict';

const API_URL = 'http://localhost:8080/users';

// Create New Account
$('.js-submit-form').submit(event => {
    event.preventDefault();
    newUser();
})

function newUser() {
    let signup_firstName = $('input[id="firstName"]').val();
    let signup_lastName = $('input[id="lastName"]').val();
    let signup_email = $('input[id="email"]').val();
    let signup_username = $('input[id="userName"]').val();
    let signup_password = $('input[id="psw"]').val();
    let signup_budget = $("input[name=budget]:checked").val();
    let signup_numRoomates = $("input[name=Roomate]:checked").val();
    let signup_culture = $("input[name=Culture]:checked").val();
    postNewUser(signup_firstName, signup_lastName, signup_username, signup_password, signup_email, signup_budget,signup_numRoomates,signup_culture);
    console.log(signup_password);
    console.log($('input[id="psw"]'));
}


function postNewUser (FirstName, LastName, username, password, EmailAddress, budget, numRoomates,culture) {
    console.log(FirstName, LastName, username, password, EmailAddress, budget, numRoomates,culture);
    $('.sign-up-failure').remove();
    $.ajax({
        url: API_URL,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify   ({
            FirstName: `${FirstName}`,
            LastName: `${LastName}`,
            username: `${username}`,
            password: `${password}`,
            EmailAddress: `${EmailAddress}`,
            budget: `${budget}`,
            numRoomates: `${numRoomates}`,
            culture: `${culture}`
        }),
        success: (data) => {
            console.log(data);
            if(data) {
                $('.js-submit-form').prepend(
                    `<div class='sign-up-success'><span style='vertical-align: middle;'>Hurray! You have successfully signed up! Now you can <a href='/'>login</a>!<span></div>`
                )
                $('input[id="firstName"]').val('');
                $('input[id="lastName"]').val('');
                $('input[id="userName"]').val('');
                $('input[id="email"]').val('');
                $('input[id="psw"]').val('');
                $('input[id="budget"]').val('');
                $('input[id="numRoomates"]').val('');
                $('input[id="culture"]').val('');
            }
        },
        error: (...rest) => {
            $('.js-submit-form').prepend(
                `
                    <div class='sign-up-failure'>
                        <p>Create a user failed.</p>
                        <p>Login or try a different email</p>
                    </div>
                `
            )
        }
    })
}


//------------------------LOGIN --------------------------------//
$(function(){
	function createURLObject(){
		let string = window.location.search.substring(1);
		let arr = string.split('&');
		let returnObj = {};
		for(let i = 0; i < arr.length; i++){
		  let miniArr = arr[i].split("=")
		  returnObj[miniArr[0]] = miniArr[1]
		}
		return returnObj;
	}
		$('.js-login-form').submit(function(e){
			e.preventDefault();
			let username = $('.js-login-username').val();
			let password = $('js-login-password').val();
			$.ajax({
            	url: API_URL, 
	            type: 'POST', 
                data: JSON.stringify   ({
                    username: `${username}`,
                    password: `${password}`
                }),
	            success: function(result)
	            { 
	            	window.location.href = `/dashboard.html?token=${result.authToken}&username=${obj.username}`
	            }, 
	            error: function() 
	            { 
	            	$(".js-login-form").css("display", "block").text(`Something went wrong -- please try again`) 
	            }  
        	});
		})
})