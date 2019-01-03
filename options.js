'use strict';
function loadOptions() {
	var savedSnowInstance = localStorage["snowInstance"];
  var savedSnowUser = localStorage["snowUser"];
  var savedSnowPass = localStorage["snowPass"];

  document.getElementById("instance").value = savedSnowInstance;
  document.getElementById('username').value = savedSnowUser;
  document.getElementById('password').value = savedSnowPass;
}
function _saveOptions() {
	var snow = document.getElementById("instance").value;
  var user = document.getElementById('username').value;
  var pass = document.getElementById('password').value;
	localStorage["snowInstance"] = snow;
  localStorage["snowUser"] = user;
  localStorage["snowPass"] = pass;

  chrome.storage.sync.set({'snowInstance': snow, 'snowUser': user, 'snowPass' : pass}, function() {
    console.log('Settings saved');
  });

}
function _eraseOptions(){
  localStorage.removeItem("snowInstance");
  localStorage.removeItem("snowUser");
  localStorage.removeItem("snowPass");

	location.reload();
}
document.addEventListener("DOMContentLoaded", function () {
    loadOptions();
    document.getElementById("eraseOptions").onclick = _eraseOptions;
    document.getElementById("saveOptions").onclick = _saveOptions;
});
