


const API_URL = 'http://localhost:8080/users';

/* ---------------------------------------get Data from API-------------------------------------------- */
function getDataFromApi(searchTerm, callback) {
    const settings = {
        url: NEWS_SEARCH_URL,
        data: {
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };

    $.ajax(settings);
}

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
