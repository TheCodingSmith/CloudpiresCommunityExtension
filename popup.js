chrome.storage.sync.get(['snowInstance', 'snowUser', 'snowPass'], function(items) {
  'use strict';
  var instance = items.snowInstance.toString(),
    user = items.snowUser.toString(),
    password = items.snowPass.toString();

  var timeSelection = DateSelector();
  console.log('time = ' + timeSelection);
  restCall(instance, user, password, timeSelection);

  var selectNewMonth = document.getElementById("changeButton");
  selectNewMonth.addEventListener("click", function() {
    var myNode = document.getElementById("leaderBoard");
    myNode.innerHTML = '';
    var newdate = '';

    var newDate = document.getElementById('selectMonth').value;

    console.log('DateSelector(newDate) = ' + DateSelector(newDate));

    restCall(instance, user, password, DateSelector(newDate));
  });
  //--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__

  var postSubmit = document.getElementById("postSubmit");
  postSubmit.addEventListener("click", function() {
    _postClickHandler();
  });

  function _postClickHandler() {
    var questionTitle = document.getElementById('questionTitle').value;

    var communityLink = document.getElementById('communityLink').value;
    var dateAccepted = document.getElementById('dateAccepted').value + ' 16:00:00';
    var acceptedAnswer = document.getElementById('acceptedAnswer').checked;

    var requestBody = "{\"u_question_title\":\"" + questionTitle + "\",\"u_user\":\"" + user + "\",\"u_link_to_answer\":\"" + communityLink + "\",\"u_date_accepted\":\"" + dateAccepted + "\",\"u_accepted_solution\":\"" + acceptedAnswer + "\"}";

    var client = new XMLHttpRequest();
    client.open("post", "https://" + instance + ".com/api/now/table/u_community_posts?sysparm_display_value=true");

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');

    client.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + password));

    client.onreadystatechange = function() {
      if (this.readyState == this.DONE) {
        // console.log(this.status + this.response);
      }
    };
    if (communityLink != '') {
      if (dateAccepted != '') {
        client.send(requestBody);
        alert('Good job ' + user);
      }
    } else {
      alert('Please add a Community Link');
    }


  };

  //--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__

  function restCall(instance, user, pass, timeSelection) {
    var requestBody = "";

    var client = new XMLHttpRequest();
    client.open("get", 'https://' + instance + ".com/api/now/table/u_community_posts?sysparm_query=" + timeSelection + "&sysparm_display_value=true&sysparm_fields=u_user%2Cu_accepted_solution");

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('Access-Control-Allow-Origin', '<all_urls>');
    client.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    client.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

    client.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + pass));

    client.onreadystatechange = function() {
      document.getElementById("loading").classList.remove('hidden');
      if (this.readyState == this.DONE) {
        document.getElementById("loading").classList.add('hidden');
        document.getElementById("loaded").classList.remove('hidden');

        // We do this instead of toggling because re-running the API will toggle the error.
        if (this.status != 200) {
          document.getElementById("leaderBoardContainer").classList.add('hidden');
          document.getElementById("pleaseLogin").classList.remove('hidden');
        } else {
          document.getElementById("leaderBoardContainer").classList.remove('hidden');
          document.getElementById("pleaseLogin").classList.add('hidden');
        }
        var responseObj = JSON.parse(this.response);

        // document.getElementById("users").innerHTML= this.response;
        var allTheUsers = [];
        for (var i = 0; i < responseObj.result.length; i++) {
          // Not a boolean response for some reason ¯\_(ツ)_/¯
          if (responseObj.result[i].u_accepted_solution === "true") {
            allTheUsers.push(responseObj.result[i].u_user.display_value);
          }
        }
        var countedNames = allTheUsers.reduce(function(allNames, name) {
          if (name in allNames) {
            allNames[name]++;
          } else {
            allNames[name] = 1;
          }
          return allNames;
        }, {});

        var ordered = [];
        for (var numbers in countedNames) {
          ordered.push([numbers, countedNames[numbers]]);
        }

        ordered.sort(function(a, b) {
          return b[1] - a[1];
        });
        var place = 0;
        for (var key in ordered) {
          place++;
          var node = document.createElement("LI");
          var textnode = document.createTextNode(place + ' - ' + ordered[key][0] + '  - Points: ' + ordered[key][1]);
          node.appendChild(textnode);
          document.getElementById("leaderBoard").appendChild(node);
        }
      }
    };
    client.send(requestBody);
  }
});

function DateSelector(newDate) {

  var dateObj = new Date();
  var day = dateObj.getUTCDate();

  if (newDate != null) {
    var md = newDate.split('-');
    var year = md[0];
    var month = md[1];

    var timeSelection = "u_date_acceptedBETWEENjavascript:gs.dateGenerate('" + year + '-' + month + "-01', '00:00:00'" + ")@javascript:gs.dateGenerate('" + year + '-' + month + '-31' + "', '23:59:59')"

    return timeSelection;
  } else {
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var selectMonth = document.getElementById("selectMonth");
    selectMonth.setAttribute('value', year + '-' + month);

    var timeSelection = "u_date_acceptedBETWEENjavascript:gs.dateGenerate('" + year + '-' + month + "-01', '00:00:00'" + ")@javascript:gs.dateGenerate('" + year + '-' + month + '-' + day + "', '23:59:59')"

    return timeSelection;
  }

}
