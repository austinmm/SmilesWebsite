
var Smile = (function() {

    // PRIVATE VARIABLES
        
    //var apiUrl = 'https://smile451.herokuapp.com';  //Ruby on Rails backend
    //var apiUrl = 'https://arslanay-warmup.herokuapp.com';    //Flask-Python backend
    var apiUrl = 'http://127.0.0.1:5000/api/'; //backend running on localhost

    // FINISH ME (Task 4): You can use the default smile space, but this means
    //            that your new smiles will be merged with everybody else's
    //            which can get confusing. Change this to a name that 
    //            is unlikely to be used by others. 
    var smileSpace = 'amarino'; // The smile space to use. 


    var smiles; // smiles container, value set in the "start" method below
    var smileTemplateHtml; // a template for creating smiles. Read from index.html
                           // in the "start" method
    var create; // create form, value set in the "start" method below
    var smileHappiness = '';


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
                alert("Invalid Happiness Level");
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
        var queryApi = 'smiles?space=' + smileSpace + '&count=' + count + '&order_by=' + order_by;
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
            // Prepare the AJAX handlers for success and failure
            var onSuccess = function(data) {
                likeInfo.find('.count').text(data.smile.like_count);
            };
            var onFailure = function() { 
                alert('Failed to update Smile Like Count'); 
            };
            var queryApi = 'smiles/' + e.id +'/like';
            makePostRequest(queryApi, '', onSuccess, onFailure);
        });
    };

    var attachHappinessHandler = function() {
        create.find('.happiness-input-container input').click(function(event){
            event.preventDefault(); // Tell the browser to skip its default click action
            $(this).parent().parent().children().css("border", "dotted 3px cornflowerblue");
            $(this).parent().css("border", "solid 4px mediumseagreen");
            smileHappiness = this.name;
        });
    };
    /**
     * Add event handlers for submitting the create form.
     * @return {None}
     */
    var attachCreateHandler = function(e) {
        createEventHandler();
        create.on('click', '.submit-input', function (event) {
            event.preventDefault(); // Tell the browser to skip its default click action
            var smile = {}; // Prepare the smile object to send to the server     
            if(createInputHandler(smile)){
                var onSuccess = function(data) {
                    location.reload();
                    create.hide();
                    smiles.show();
                    $(".create-btn").show();
                };
                var onFailure = function() { 
                    console.error('Error: Failed to send new smile to backend.'); 
                };
                makePostRequest('smiles', smile, onSuccess, onFailure);
            }
        });
    };

    var createEventHandler = function(){
        create.hide();
        smiles.show();
        $(".create-btn").show();
        create.find('.cancel').click(function(event){
            event.preventDefault(); // Tell the browser to skip its default click action
            create.hide();
            smiles.show();
            $(".create-btn").show();
        });
        $('.create-btn').click(function(event){
            event.preventDefault(); // Tell the browser to skip its default click action
            create.show();
            smiles.hide();
            //create.find('form input, form textarea').val('');
            $(".create-btn").hide();
        });
    }

    var createInputHandler = function(smile){
        var isValid = true;
        var errors = "";
        smile.title = create.find('.title-input').val();
        smile.story = create.find('.story-input').val();
        smile.happiness_level = smileHappiness;
        if(smile.title == ''){ 
            errors += "Warning: Please Enter a Title.\n"; 
        }
        if(smile.title.length > 64){ 
            errors += "Warning: Title can only consist of 64 or less characters.\n"; 
        }
        if(smile.story == ''){ 
            errors += "Warning: Please Enter a Story.\n"; 
        }
        if(smile.story.length > 2048){ 
            errors += "Warning: Story can only consist of 2048 or less characters.\n"; 
        }
        if(smile.happiness_level == ''){ 
            errors += "Warning: Please Select a Happiness Level.\n"; 
        }
        if(errors != ""){
            alert(errors);
            isValid = false;
        }
        return isValid;
    }

    var smileGenerator = function(){
        var titles = ["Rebel Without a Goal",
                    "Vulture of History",
                    "Armies of the Lost Ones",
                    "Giants of Insanity",
                    "Foes and Witches",
                    "Pilots and Enemies",
                    "Tree of Darkness",
                    "Battle the Ashes",
                    "Remember the Nation",
                    "Magnificent Bridges",
                    "The Hidden Snake",
                    "Destiny of Sons",
                    "The Emerald's Healing",
                    "The Wife of the Thoughts",
                    "Angel in the Stone",
                    "The Hard Star",
                    "Beginning of Future",
                    "The Night's Secret",
                    "The Sliver of the Person",
                    "Blade in the Twins"];
        var onSuccess = function(data) {
            console.log("Created smile");
        };
        var onFailure = function() { 
            console.log('Failed to Create Smile'); 
        };
        for(var i = 0; i < 20; i++){
            var data = {
                title: titles[i],
                story: "This is a Super Happy and Interesting Story...",
                happiness_level: (Math.floor((Math.random())*10)%3)+1,
                space: "auto-generated"
            };
            makePostRequest('smiles', data, onSuccess, onFailure);
        }
    };
    /**
     * Start the app by displaying the most recent smiles and attaching event handlers.
     * @return {None}
     */
    var start = function() {
        smiles = $(".smiles");
        create = $(".create");
        var submitBtn = $('.submit-input');
        // Grab the first smile, to use as a template
        smileTemplateHtml = $(".smiles .smile")[0].outerHTML;
        // Delete everything from .smiles
        smiles.html('');
        //smileGenerator();
        displaySmiles();
        attachHappinessHandler();
        attachCreateHandler(submitBtn);
    };
    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };
    
})();