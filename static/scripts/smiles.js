
var Smile = (function() {

    // PRIVATE VARIABLES
        
    var apiUrl = 'https://smile451.herokuapp.com';  //Ruby on Rails backend
    //var apiUrl = 'https://arslanay-warmup.herokuapp.com';    //Flask-Python backend
    //var apiUrl = 'http://localhost:5000'; //backend running on localhost

    // FINISH ME (Task 4): You can use the default smile space, but this means
    //            that your new smiles will be merged with everybody else's
    //            which can get confusing. Change this to a name that 
    //            is unlikely to be used by others. 
    var smileSpace = 'initial'; // The smile space to use. 


    var smiles; // smiles container, value set in the "start" method below
    var smileTemplateHtml; // a template for creating smiles. Read from index.html
                           // in the "start" method
    var create; // create form, value set in the "start" method below


    // PRIVATE METHODS
      
   /**
    * HTTP GET request 
    * @param  {string}   url       URL path, e.g. "/api/smiles"
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
   var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/smiles"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
        
    /**
     * Insert smile into smiles container in UI
     * @param  {Object}  smile       smile JSON
     * @param  {boolean} beginning   if true, insert smile at the beginning of the list of smiles
     * @return {None}
     */
    var insertSmile = function(smile, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(smileTemplateHtml);
        // Set the "id" attribute 
        newElem.attr('id', smile.id); 
        // Now fill in the data that we retrieved from the server
        newElem.find('.title').text(smile.title);
        newElem.find('.story').text(smile.story);
        newElem.find('.count').text(smile.like_count);
        //Sets the smile created_at string to a Date object
        var date = new Date(smile.created_at);
        //Uses the date object method "toDateString" to reformat the date to a easier to read string
        newElem.find('.timestamp').text(date.toDateString());
        //Sets the happiness-level src-image to the correct path based on the smile.happiness_level
        var happiness = newElem.find('.happiness-level img');
        switch(smile.happiness_level){
            case 1: happiness.attr("src", "images/level1-smile.png");
                break;
            case 2: happiness.attr("src", "images/level2-smile.png");
                break;
            case 3: happiness.attr("src", "images/level3-smile.png");
                break;
            default:
                alert("Invalid Smile Happiness Level");
                break;
        }
        if (beginning) {
            //First Smile Post
            smiles.prepend(newElem);
        } else {
            //The rest of the Smile Posts
            smiles.append(newElem);
        }
    };


     /**
     * Get recent smiles from API and display 10 most recent smiles
     * @return {None}
     */
    var displaySmiles = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            for(var i = 0; i < data.smiles.length; i++){
                var isBeginning = i == 0? true : false;
                /*Call to "insertSmile" to populate the page with as many smile-post 
                that are contained in array data.smiles*/
                insertSmile(data.smiles[i], isBeginning);
                attachLikeHandler(data.smiles[i]);
            }
        };
        var onFailure = function() { 
            alert("Failed to Connect to Backend");
        };
        var space = 'initial'; 
        var count = '10';
        var order_by = 'created_at';
        var queryApi = '/api/smiles?space=' + space + '&count=' + count + '&order_by=' + order_by;
        makeGetRequest(queryApi, onSuccess, onFailure);
    };

    /**
     * Add event handlers for clicking like.
     * @return {None}
     */
    var attachLikeHandler = function(e) {
        // Attach this handler to the 'click' action for elements with class 'like'
        var likeInfo = $('#' + e.id + " .like-info");
        likeInfo.find('.like').click(function() {
            //likeInfo.find('.count').text(e.like_count + 1);
            // Prepare the AJAX handlers for success and failure
            var onSuccess = function(data) {
                likeInfo.find('.count').html(data.like_count);
                alert("Smile Like Count Updated Successfully");        
            };
            var onFailure = function() { 
                alert('Failed to update Smile Like Count'); 
            };
            var queryApi = '/api/smiles?id=' + e.id;
            e.like_count++;
            //var makePostRequest = function(url, data, onSuccess, onFailure) {
            makePostRequest(queryApi, e, onSuccess, onFailure);
        });
    };


    /**
     * Add event handlers for submitting the create form.
     * @return {None}
     */
    var attachCreateHandler = function(e) {
        // First, hide the form, initially 
        create.find('form').hide();

        // FINISH ME (Task 4): add a handler to the 'Share a smile...' button to
        //                     show the 'form' and hide to button

        // FINISH ME (Task 4): add a handler for the 'Cancel' button to hide the form
        // and show the 'Shared a smile...' button

        // The handler for the Post button in the form
        create.on('click', '.submit-input', function (e) {
            e.preventDefault (); // Tell the browser to skip its default click action

            var smile = {}; // Prepare the smile object to send to the server
            smile.title = create.find('.title-input').val();
            // FINISH ME (Task 4): collect the rest of the data for the smile
            var onSuccess = function(data) {
                // FINISH ME (Task 4): insert smile at the beginning of the smiles container
            };
            var onFailure = function() { 
                console.error('create smile failed'); 
            };
            
            // FINISH ME (Task 4): make a POST request to create the smile, then 
            //            hide the form and show the 'Shared a smile...' button
        });

    };

    
    /**
     * Start the app by displaying the most recent smiles and attaching event handlers.
     * @return {None}
     */
    var start = function() {
        smiles = $(".smiles");
        create = $(".create");
        // Grab the first smile, to use as a template
        smileTemplateHtml = $(".smiles .smile")[0].outerHTML;
        // Delete everything from .smiles
        smiles.html('');
        displaySmiles();
        attachCreateHandler();
    };
    

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };
    
})();
