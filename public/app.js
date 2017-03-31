
function loadIndex(){
  $.get('/teams', function(teams, status){
    if(status == "success"){
      teams.forEach(function(team){
        var link = $('<a>')
        //   .text(team.image)
          .attr('href', '/teams/' + team.id)
          .on('click', function(){
            e.preventDefault();
            loadTeam('/teams/' + team.id);
          }).appendTo('#data-display');
          var imageTag = $('<img class="clipboard-image">');
          imageTag.attr('src', team.image);
          imageTag.appendTo(link);
      });
      $('<button>').text('Add Team').on('click', function(){
          // adds form to page
          $('#data-display').empty();
          $('#data-display').load('/public/team-form.html', function(){
                $('form').on('submit',function(event){
                        event.preventDefault();
                        $('#data-display').empty();
                        var data = new FormData($('#team-form')[0]);
                        console.log('Form Data:');
                        console.log('name:' + data.name);
                        console.log('name:' + data.coach);
                        console.log('name:' + data.record);
                        console.log('name:' + data.description);
                        console.log('name:' + data.imagePath);
                        console.log('name:' + data.image);

                        $.post({
                            url: '/teams',
                            data: data,
                            contentType: 'multipart/form-data',
                            processData: false
                        });
                });
          });
      }).appendTo('#data-display');
    } else {

    }
  });
}

function loadTeam(url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);

    xhr.onreadystatechange = function() {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (xhr.readyState === DONE) {
          if (xhr.status === OK) {
              console.log(xhr.responseText); // 'This is the returned text.'
              var bodyContent = document.body.getElementById('data-display');
              bodyContent.innerHTML = "";
              var team = JSON.parse(xhr.responseText);
              var wrapper = document.createElement('div')
              var name = document.createElement('h1');
              
              var image = document.createElement('img');
              var coach = document.createElement('h4');
              var record = document.createElement('h4');
              var description = document.createElement('h4');
              name.innerHTML = team.name;
              image.src = team.image;
              coach.innerHTML = team.name;
              record.innerHTML = team.name;
              description.innerHTML = team.name;
              wrapper.appendChild(name);
              wrapper.appendChild(image);
              wrapper.appendChild(record);
              wrapper.appendChild(coach);
              wrapper.appendChild(description);
              bodyContent.appendChild(wrapper);
          } else {
              console.log('Error: ' + xhr.status); // An error occurred during the request.
          }
        }
    }

}

function uploadTeam(){
    var xhr = new XMLHttpRequest();
    var formElement = document.getElementById('the-form');
    var formData = new FormData(formElement);
    formData.append('image', $('input[type=file]')[0].files[0])
    xhr.open('POST', '/teams');// what is second param
    xhr.send(formData);

    // https://robots.thoughtbot.com/ridiculously-simple-ajax-uploads-with-formdata
    // http://stackoverflow.com/questions/21044798/how-to-use-formdata-for-ajax-file-upload
    return false;
}





// function uploadData(req, res){
//   multipart(req, res, function(){
//     var jsonData ={
//       name:req.body.team,
//       coach:req.body.coach,
//       description:req.body.description,
//       location:req.body.location,
//       record:req.body.record,
//       imagePath: "/" + req.body.image.filename
//     }
//     var jsonFileName = req.body.image.filename.split('.')[0];
//     fs.writeFile("public/Data/" + jsonFileName + ".json", JSON.stringify(jsonData),function(err){
//       if(err)console.log(err);
//     });
//     jsonFiles[jsonFileName] = jsonData;
//     uploadImage(req, res);

//   });
// }

// /** @function uploadImage
//  * A function to process an http POST request
//  * containing an image to add to the gallery.
//  * @param {http.incomingRequest} req - the request object
//  * @param {http.serverResponse} res - the response object
//  */
// function uploadImage(req, res) { 
//   fs.writeFile('public/images/' + req.body.image.filename, req.body.image.data, function(err){
//     if(err) {
//       console.error(err);
//       res.statusCode = 500;
//       res.statusMessage = "Server Error";
//       res.end("Server Error");
//       return;
//     }
//     serveAllTeams(req, res);
//   });
// }












loadIndex();


