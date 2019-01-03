chrome.storage.sync.get(['snowInstance', 'snowUser', 'snowPass'], function(items) {
  'use strict';
  var instance = items.snowInstance.toString(),
    user = items.snowUser.toString(),
    password = items.snowPass.toString();

  var submitted = document.getElementById('submitted');

  var user_sys_id = getSysID(instance, user, password);
  console.log('user_sys_id = ' + user_sys_id);


  function getSysID(instance, user, pass) {
    var requestBody = "";

    var client = new XMLHttpRequest();
    client.open("get", "https://" + instance + ".com/api/now/table/sys_user?sysparm_query=user_name%3D" + user + "&sysparm_display_value=true&sysparm_fields=sys_id&sysparm_limit=10");

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');

    //Eg. UserName="admin", Password="admin" for this code sample.
    client.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + pass));

    client.onreadystatechange = function() {
      if (this.readyState === this.DONE) {
        var responseObj = JSON.parse(this.response);

        // document.getElementById("response").innerHTML = this.response;
        var userSys_id = responseObj.result[0].sys_id;
        getUserRecords(instance, user, password, user_sys_id);

        // return userSys_id;
      }
    }
    client.send(requestBody);
  }

  // setTimeout(function () {
  //   getUserRecords(instance, user, password, user_sys_id);
  // }, 1000);


  // Get all of the records by the users sorted by date
  function getUserRecords(instance, user, pass, user_sys_id) {
    var requestBody = "";

    var client = new XMLHttpRequest();

    client.open("get", 'https://' + instance + ".com/api/now/table/u_community_posts?sysparm_query=u_user%" + user_sys_id + "&sysparm_display_value=true");


    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');

    client.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + pass));

    client.onreadystatechange = function() {
      document.getElementById("loading").classList.remove('hidden');
      if (this.readyState == this.DONE) {
        document.getElementById("loading").classList.add('hidden');
        document.getElementById("loaded").classList.remove('hidden');

        var responseObj = JSON.parse(this.response);
        console.log(responseObj);
        for (var i = 0; i < responseObj.result.length; i++) {

          var node = document.createElement("LI");
          node.setAttribute('ID', 'submitted' + i);

          if (responseObj.result[i].u_question_title != '') {
            var linkAnswer = document.createTextNode(responseObj.result[i].u_question_title);
          } else {
            var linkAnswer = document.createTextNode(responseObj.result[i].u_link_to_answer);
          }
          var link = document.createElement("a");
          link.setAttribute('href', responseObj.result[i].u_link_to_answer);
          link.setAttribute('target', '_blank');
          link.appendChild(linkAnswer);
          node.appendChild(link);

          var dateTitle = document.createTextNode('Answered on: ');
          node.appendChild(dateTitle)
          var dateTime = document.createTextNode(responseObj.result[i].u_date_accepted.substring(0,11));
          node.appendChild(dateTime);

          var accSol = document.createTextNode(responseObj.result[i].u_accepted_solution);
          var accepted = document.createElement('input');
          accepted.setAttribute('type', 'checkbox');
          accepted.setAttribute('ID', 'checkbox' + i);
          if (responseObj.result[i].u_accepted_solution === 'true') {
            accepted.setAttribute('checked', true);
          }
          accepted.appendChild(accSol);
          node.appendChild(accepted);

          // var checkbox = document.getElementById(idName);
          // console.log('checkbox = ' + checkbox);
          node.addEventListener('change', function() {
            // _updateRecord(instance, user, pass, responseObj.result[i].sys_id, true);
          });

          document.getElementById("submitted").appendChild(node);

          responseObj.result[i]
        }

        // document.getElementById("response").innerHTML = this.status + this.response;
      }
    };
    client.send(requestBody);
  }
  // Allow user to update all fields
  // {"u_link_to_answer":"","u_date_accepted":"","u_accepted_solution":""}


  // Rest Call to update a record
  function _updateRecord(instance, user, pass, postSysID, state) {
    // var requestBody = "{\"u_link_to_answer\":\"\",\"u_date_accepted\":\"\",\"u_accepted_solution\":\"\"}";

    var requestBody = "{\"u_accepted_solution\":\" " + state + "\"}";

    var client = new XMLHttpRequest();
    client.open("put", 'https://' + instance + ".com/api/now/table/u_community_posts/" + postSysID);

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');

    client.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + pass));

    client.onreadystatechange = function() {
      if (this.readyState == this.DONE) {
        document.getElementById("response").innerHTML = this.status + this.response;
      }
    };
    client.send(requestBody);
  }
});
