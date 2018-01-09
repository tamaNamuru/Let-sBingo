function fieldChanged(){
	var room = getField("room");
	var password = getField("password");
	var disabled = true;
	
	if(room.value.length > 0 && password.value.length >= 8 && password.value.length <= 12){
		disabled = false;
	}

	var login = getField("login");
	if(disabled){
		login.setAttribute("disabled","disabled");
	}
	else{
		login.removeAttribute("disabled");
	}
}

function getField(fieldName){
	var field = document.getElementById(fieldName);
	if(field == undefined){
		throw new Error("要素が見つかりません"+fieldName);
	}
	return field;
}
