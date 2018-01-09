function changePicture(picthis) {
	if(picthis.value){
		picthis.parentNode.firstChild.value = picthis.value;
	}
}





//リセット
function sakuzyo() {
	var kakunin = confirm("ページに入力したものすべてリセットされますがよろしかったですか？");
	
	if(kakunin == true){
		window.location.reload();
	}else{
		alert("キャンセルしました");
	}
}

//テーブル追加

function AddTable() {
	var table = document.getElementById("keihin");
	
	//var count = table.rows.length;
	
	var row1 = table.insertRow(-1);
	
	var cell1 = row1.insertCell(0);
	var cell2 = row1.insertCell(1);
	var cell3 = row1.insertCell(2);
	var cell4 = row1.insertCell(3);
	var cell5 = row1.insertCell(4);
	var cell6 = row1.insertCell(5);
	
	var HTML1 = '<input type="text" name="name" value="" size="10" maxlength="20" />';
	var HTML2 = '<input type="number" name="kazu" min="1" max="500" value="1" step="1" required />';
	var HTML3 = '<input type="hidden", name="url"/><input type="file" name="pic" accept="image/*" onchange="changePicture(this)"/>';
	var HTML4 = '<input type="text" name="biko" value="" size="10" maxlength="255" />';
	var HTML5 = '<input type="number" name="pri" min="0" max="20" value="0" step="1" required />';
	var HTML6 = '<input type="button" name="dl" value="削除" onclick="deleteRow(this)">';
	
	cell1.innerHTML = HTML1;
	cell2.innerHTML = HTML2;
	cell3.innerHTML = HTML3;
	cell4.innerHTML = HTML4;
	cell5.innerHTML = HTML5;
	cell6.innerHTML = HTML6;
	
}
	
//行削除
function deleteRow(dlthis) {
	var tbody = document.getElementById("tb");
	
	var tr = dlthis.parentNode.parentNode;
	
	tbody.removeChild(tr);
}
