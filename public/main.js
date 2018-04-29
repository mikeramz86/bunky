


const NEWS_SEARCH_URL = '--';

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
                <a href="${result.webUrl}" target="_blank">${result.webTitle}</a>
            </div>
            `;

}



/* ---------------------------------------DISPLAY DATA-------------------------------------------- */

function displayNewsData(data) {
    const showResults = data.response.results.map((item, index) => renderResult(item));
    $('.js-news').html(showResults);
}




/* ---------------------------------------WATCH SUBMIT------------------------------------------- */

function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        // clear out the input
        queryTarget.val("");
        getDataFromApi(query, displayNewsData);
    });
    getSunDataFromAPI(displaySunData);
    getDesignDataFromAPI(displayQuoteData);

}

$(watchSubmit);
