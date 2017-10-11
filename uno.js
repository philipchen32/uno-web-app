function getUsername(){
	var username = document.getElementById('username').value;
	sessionStorage.setItem("nameData", username);
}
