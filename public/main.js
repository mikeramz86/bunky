
const API_URL = 'http://localhost:8080/users';

/* ---------------------------------------get Data from API-------------------------------------------- */
function getUsers(callback) {
    const settings = {
        url: API_URL,
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
}

/* ---------------------------------------CREATE ACCOUnt-------------------------------------------- */



/* ---------------------------------------DELETE------------------------------------------- */

$('#permanent-delete-account').click(function(){
    $.ajax({
        url: API_URL,
        data: {EmailAddress},
        headers: { 'authorization': `Bearer ${token}`},
        dataType: 'json',
        success: function(result) 
        { 
            //then return to index.html
            window.location.href = `/index.html?delete=true`
            //doesn't display on index.html
            $(".delete-alert-danger2").text(result.message) 	
        },
        error: function(){
            $(".problem").css('display', 'block')
            console.log('error')
        }
    });		
})

/* ---------------------------------------UPDATE-------------------------------------------- */
$('.update-account').click(function(e){
    e.preventDefault();
    let obj = {
        EmailAddress:$('#inputEmail3').val().trim(),
        FirstName:$('#inputFirstName3').val().trim(),
        LastName:$('#inputLastName3').val().trim(),
        RentPayment:$('#inputRentPayment3').val().trim()
    };
    $.ajax({
        url: API_URL,
        type: 'PUT', 
        data: obj,
        headers: { 'authorization': `Bearer ${token}`},
        dataType: 'json',
        success: function(result) 
        { 
            console.log('success = ', result);
            $('#inputFirstName3').val(result.FirstName);
               $('#inputLastName3').val(result.LastName);
            $('#inputbudget3').val(result.budget);
            $('#inputnumRoommates3').val(result.numRoomates);
            $('#inputculturet3').val(result.cultre);
            $('.update-alert-success').css('display','block').text("Your account has been updated!");
        },
        error: function(error){
            $(".problem").css('display', 'block')
            console.log('error', error)
        }
    })
});


/* ---------------------------------------RENDER RESULTS-------------------------------------------- */
function renderResult(result) {
    return `
            <div class="result .col-3"> 
                <div class="name">
                    <div>${result.FirstName} ${result.LastName}</div>
                </div>
                <div class="accountInfo">
                    <div>${result.EmailAddress}</div>
                    <div>Budget: ${result.budget}</div>
                    <div>Roomates: ${result.numRoomates}</div>
                    <div>Culture: ${result.culture}</div>
                </div>
            </div>
            `
};





/* ---------------------------------------DISPLAY DATA-------------------------------------------- */

function displayData(data) {
    console.log(data);
    const showResults = data.allusers.map((item, index) => renderResult(item));
    $('.js-results').html(showResults);
};








/* ---------------------------------------WATCH SUBMIT------------------------------------------- */

// function watchSubmit() {
//     $('.js-search-form').submit(event => {
//         event.preventDefault();
//         const queryTarget = $(event.currentTarget).find('.js-query');
//         const query = queryTarget.val();
//         // clear out the input
//         queryTarget.val("");
//         getDataFromApi(query, displayData);
//     });
// }



// $(watchSubmit);

$(getUsers(displayData));
