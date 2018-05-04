
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



/* ---------------------------------------RENDER RESULTS-------------------------------------------- */
function renderResult(result) {
console.log(result._id);
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
                    <button class="js-permanent-delete-bunky loginbtn" type="submit">Delete</button>
                    <button class="js-update-bunkyl oginbtn" type="submit">Update</button>
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



$(getUsers(displayData));

/* ---------------------------------------DELETE------------------------------------------- */
$('.js-permanent-delete-bunky').click(function () {
    const bunkyId = $(event.target).data('delete-id')
    console.log(bunkyId);
    $.ajax({
        url: `/users/` + bunkyId,
        type: 'DELETE',
        data: { EmailAddress },
        dataType: 'json',
        success: function (result) {
            //then return to dashboard.html
            window.location.href = `/dashboard.html?delete=true`
            //doesn't display on dashboard.html
            $(".delete-alert-danger2").text(result.message)
            console.log(result);
        },
        error: function () {
            $(".problem").css('display', 'block')
            console.log('error')
        }
    });
})
