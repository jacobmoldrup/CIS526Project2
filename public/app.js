

//Load index with jquery

function loadIndex(){
  $.get('/teams', function(teams, status){
    if(status == "success"){
      teams.forEach(function(team){
        var link = $('<a>')
          .text(team.name)
          .attr('href', '/teams/' + team.id)
          .on('click', function(){
            e.preventDefault();
            loadTeam('/teams/' + team.id);
          }).appendTo('#data-display')
      });
      $('<button>').text('Add Team').on('click', function(){
          // adds form to page
          $('#data-display').empty();
          $('#data-display').load('/public/team-form.html', function(){
                $('form').on('submit',function(event){
                        event.preventDefault();
                        $('#data-display').empty();
                        var data = new FormData($('form')[0]);
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



// function loadIndex(){
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', '/teams/');
//     xhr.send(null);

//     xhr.onreadystatechange = function() {
//         var DONE = 4; // readyState 4 means the request is done.
//         var OK = 200; // status 200 is a successful return.
//         if (xhr.readyState === DONE) {
//             if (xhr.status === OK) {
//                 console.log(xhr.responseText); // 'This is the returned text.'
//                 var teams = JSON.parse(xhr.responseText);
//                 var bodyContent = document.body.getElementById('data-display');
//                 bodyContent.innerHTML = "";
//                 teams.forEach(function(team){
//                     var name = document.createElement('a');
//                     name.innerHTML = team.name;
//                     name.href = "/teams/" + team.id;
//                     bodyContent.appendChild(name);
//                     team.onClick = function(event) {
//                         event.preventDefault();
//                         loadTeam("/teams/" + team.id);
//                     }
//                 });
//                 var button = document.createElement('button');
//                 button.addEventListener('')
//                 document.body.appendChild(button);
//             } else {
//                 console.log('Error: ' + xhr.status); // An error occurred during the request.
//             }
//         }
//     }
// }

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

function formInvisible()
{
      var formElement = document.getElementById('the-form');
      formElement.style.display = 'none';
      loadIndex();
}

function formVisible()
{
      var bodyContent = document.body.getElementById('data-display');
      bodyContent.innerHTML = "";
      var formElement = document.getElementById('the-form');
      formElement.style.display = 'block';
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




loadIndex();
