
const API_URL = '/users';

const DATA = {
    data: [],
    isEditing: null
};


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
    // console.log(`checking for render results._id`,result._id);
    return `
            <div class="result .col-3" > 
                <div class="name">
                    <div id="updateName" value="${result.FirstName} ${result.LastName}">${result.FirstName} ${result.LastName}</div>
                </div>
                <div class="accountInfo" id="${result._id}">
                    <div id="updateEmail" value="${result.EmailAddress}">${result.EmailAddress}</div>
                    <div id="updateBudget" value="${result.budget}">Budget: ${result.budget}</div>
                    <div id="updateRoomates" value="${result.numRoomates}">Roomates: ${result.numRoomates}</div>
                    <div id="updateCulture" value="${result.culture}">Culture: ${result.culture}</div>
                    <button class="js-update-bunky loginbtn">Update</button>
                    <button class="js-permanent-delete-bunky loginbtn" type="submit">Delete</button>
                    <div class="js-delfail"></div>

                </div
            </div>
            `
};

function renderEdit(result) {
    // console.log(`checking for results:`,result._id);
    // console.log('this is preval', preVal);
    // console.log('this is budget', preVal.budget['one']);
    console.log('this is result', result);
    return `
         <form id="${result._id}" class="editForm as-form result">
            <fieldset name="Update">
                <legend class="Sign-up updateAccount">Update Account</legend>
                <div class="signupType update">
                    <label for="FirstName" required>First Name</label>
                    <input class="update First" value="${result.FirstName}" type="name" name='firstName' id='updateFirstName'  />

                    <label for="LastName" required>Last Name</label>
                    <input class="update Last" value="${result.LastName}" type="name" name='email' id='updateLastName' />

                    <label for="email" required>Email</label>
                    <input class="update Email" value="${result.EmailAddress}" type="email" name='email' id='updateEmail' />
                </div>
                <div class="filters">
                    <label for="budget" class "budget"  required>Budget (required input):     </label>
                        <input id="budge1t" type="radio" name="budget" value="$100 - $500" ${checked('$1 - $500',result.budget)}> $1 - $500                     
                        <input id="budge1t" type="radio" name="budget" value="$500 - $1000"${checked('$500 - $1000',result.budget)} > $500 - $1000
                        <input id="budget2" type="radio" name="budget" value="$1000 - $1600" ${checked('$1000 - $1600',result.budget)}> $1100 - $1600
                        <input id="budget3" type="radio" name="budget" value="$1600+" ${checked('$1600+',result.budget)}> $1600+
      
                </div>

                <div class="filters">
                    <label for="roomates" required>Roomates (required input) :</label>
                    <input id="Roomate1" type="radio" name="Roomate" value="1" ${checked('1',result.numRoomates)}> 1
                    <input id="Roomate2" type="radio" name="Roomate" value="Less than 2" ${checked('Less than 2',result.numRoomates)}> Less than 2
                    <input id="Roomate3" type="radio" name="Roomate" value="Less than 3" ${checked('Less than 3',result.numRoomates)}> Less than 3
                    <input id="Roomate4" type="radio" name="Roomate" value="3+" ${checked('3+',result.numRoomates)}> 3+
                </div>     

                <div class="filters">
                    <label for="Culture" required>Culture (required input) :</label>
                    <input id="Culture1" type="radio" name="Culture" value="Communal" ${checked('Communal',result.culture)}> Communal
                    <input id="Culture2" type="radio" name="Culture" value="Private" ${checked('Private',result.culture)}> Private
                </div>

                <button id="update" type="submit">Update</button>
                <button id="cancel" type="submit">Cancel</button>
            </fieldset>
            <div class="js-upfail'"></div>
        </form>
            `
}

/* ---------------------------------------If value is true put a check on radio button-------------------------------------------- */
function checked(input, result) {
    if (input === result) {
        return ('checked')
    }
};



/* ---------------------------------------DISPLAY DATA-------------------------------------------- */

function displayData(data) {
    DATA.data = data.allusers;
    const showResults = DATA.data.map(item => {
        if (item._id === DATA.isEditing) {
            return renderEdit(item);
        }
        else {
            return renderResult(item);
        }
    });
    $('.js-results').html(showResults);
};


/* ---------------------------------------UPDATE------------------------------------------- */

$('.js-results').on("click", ".js-update-bunky", function (e) {
    e.preventDefault();

    // console.log('finding specific id', $(e.target).parent().attr("id"));
    DATA.isEditing = $(e.target).parent().attr("id");

    console.log(DATA.data);
    const showResults = DATA.data.map(item => {
        if (item._id === DATA.isEditing) {
            return renderEdit(item);
        }
        else {
            return renderResult(item);
        }
    });
    $('.js-results').html(showResults);;


});

$('.js-results').on("click", "#update", function (e) {
    e.preventDefault();

    DATA.isEditing = null;


    let update_firstName = $('input[id="updateFirstName"]').val();
    let update_lastName = $('input[id="updateLastName"]').val();
    let update_email = $('input[id="updateEmail"]').val();
    let update_budget = $("input[name=budget]:checked").val();
    let update_numRoomates = $("input[name=Roomate]:checked").val();
    let update_culture = $("input[name=Culture]:checked").val();

    const bunkyId = $(".editForm").attr("id");
    console.log('this is form', $("form").attr("id"));
    console.log('test');

    $.ajax({
        url: `/users/` + bunkyId,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            id: bunkyId,
            FirstName: update_firstName,
            LastName: update_lastName,
            EmailAddress: update_email,
            budget: update_budget,
            numRoomates: update_numRoomates,
            culture: update_culture
        }),
        success: function (data) {
            if (data) {
                console.log(data);
                // callback(data);
                return $(getUsers(displayData));
            }
        },
        error: (...rest) => {
            $('.js-upfail').prepend(
                `
                    <div class='upate-failure'>
                        <p>update failed.</p>
                        <p>please try again</p>
                    </div>
                `
            )
        }
    });

});

$('.js-results').on("click", "#cancel", function (e) {
    e.preventDefault();
    DATA.isEditing = null;
    const showResults = DATA.data.map(item => {
        if (item._id === DATA.isEditing) {
            return renderEdit(item);
        }
        else {
            return renderResult(item);
        }
    });
    $('.js-results').html(showResults);
});

/* ---------------------------------------DELETE------------------------------------------- */
//add are you sure feature before deleting?
$('.js-results').on("click", ".js-permanent-delete-bunky", function (e) {
    // console.log(bunkyId);
    //create function alert if they want to delete person
    //if yes use ajax delete call
    //if no go back to back to dashboard
    console.log('finding specific id', $(e.target).parent().attr("id"));
    const bunkyId = $(e.target).parent().attr("id");
    $.ajax({
        url: `/users/` + bunkyId,
        type: 'DELETE',
        dataType: 'json',
        success: function (result) {
            //then return to dashboard.html
            window.location.href = `/dashboard.html?delete=true`
            //doesn't display on dashboard.html
            $(".delete-alert-danger2").text(result.message)
            console.log(result);
        },
        error: (...rest) => {
            $('.js-delfail').prepend(
                `
                    <div class='upate-failure'>
                        <p>update failed.</p>
                        <p>please try again</p>
                    </div>
                `
            ) 
        }
    });
});


$(getUsers(displayData));