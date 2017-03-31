
$('#home-link').on('click', function(event){
    event.preventDefault();
    loadIndex();
});
function loadTeam(teamIdurl){
    $.get(teamIdurl, function(team, status){
        if(status == "success"){
            var dataSection = $('#data-display');
            dataSection.empty();
            var teamImageDiv = $('<div class="team-logo">')
            var imageTag = $('<img class="logo-large">')
                .attr('src', team.image)
                .appendTo(teamImageDiv);
            teamImageDiv.appendTo(dataSection);

            var teamDataDiv = $('<div class="team-data">')
            var ul = $('<ul>');
            var teamNameLi = $('<li>')
                .text('Team Name: ' + team.name)
                .appendTo(ul);
            var teamCoachLi = $('<li>')
                .text('Coach: ' + team.coach)
                .appendTo(ul);
            var teamNameLi = $('<li>')
                .text('Record: ' + team.record)
                .appendTo(ul);
            var teamNameLi = $('<li>')
                .text('Description: ' + team.description)
                .appendTo(ul);   
            ul.appendTo(teamDataDiv);
            teamDataDiv.appendTo(dataSection);
        }
    });
}




function loadIndex(){
  $.get('/teams', function(teams, status){
    if(status == "success"){
      teams.forEach(function(team){
        var link = $('<a>')
            .attr('href', '/teams/' + team.id)
            .on('click', function(event){
                event.preventDefault();
                loadTeam('/teams/' + team.id);
            });
          var imageTag = $('<img class="clipboard-image">');
          imageTag.attr('src', team.image);
          imageTag.appendTo(link);
          link.appendTo('#data-display');
      });
      $('<br>').appendTo('#data-display');
      $('<br>').appendTo('#data-display');
      $('<button>').text('Add Team').on('click', function(){
          // adds form to page
          $('#data-display').empty();
          $('#data-display').load('/public/team-form.html', function(){
                $('form').on('submit',function(event){
                    event.preventDefault();
                    var formElement = document.getElementById('team-form');
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/', true);
                    xhr.send(new FormData(formElement));
                });
          });
      }).appendTo('#data-display');
    } else {

    }
  });
}

loadIndex();


