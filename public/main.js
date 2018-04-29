


const SEARCH_URL = '--';

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


/* ---------------------------------------RENDER RESULTS-------------------------------------------- */
function renderResult(result) {
    return `
            <div class="result"> 
                <div>${result.FirstName}</div>
                <div>${result.LastName}</div>
                <div>${result.EmailAddress}</div>
                <div>${result.budget}</div>
                <div>${result.numRoomates}</div>
            </div>
            `
};





/* ---------------------------------------DISPLAY DATA-------------------------------------------- */

function displayData(data) {
    const showResults = data.response.results.map((item, index) => renderResult(item));
    $('.js-results').html(showResults);
}




/* ---------------------------------------WATCH SUBMIT------------------------------------------- */

function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        // clear out the input
        queryTarget.val("");
        getDataFromApi(query, displayData);
    });
}

$(watchSubmit);
