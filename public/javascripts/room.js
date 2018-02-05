const room = io('/room');


function show(rname) {
	let popup = document.getElementById("popup");
	popup.innerHTML = '<form method="POST" action="/login/user">' +
	'<input type="hidden" name="roomName" value="' + rname.innerHTML + '">' +
	'<p> ルームID ：<input type="text" name="roomid" placeholder="roomid" size="4" maxlength="4"></p>' +
	'<p>自分の名前：<input type="text" name="userName" placeholder="username" size="8" maxlength="8"></p>' +
	'<p><input type="button" id="close" value="閉じる" style="margin-right: 10%;"><input type="submit" value="ログイン"></p></form>';
	
	let layer = document.getElementById("layer");
	popup.style.display="block";
	layer.style.display="block";

	document.getElementById("close").onclick = () => {
		document.getElementById("popup").style.display="none";
		document.getElementById("layer").style.display="none";
	};
	layer.onclick = () => {
		document.getElementById("popup").style.display="none";
		document.getElementById("layer").style.display="none";
	};
}

//部屋を追加
room.on('addRoom', (name) => {
	let element = document.createElement("li");
	element.className = "roomtitle";
	element.innerHTML = '<p id=' + name + ' onClick="show(this)">' + name + '</p>';
	let parent_object = document.getElementById("rooms");
	parent_object.appendChild(element);
});

//部屋を削除
room.on('removeRoom', (name) => {
	document.getElementById(name).parentNode.remove();
	document.getElementById("popup").style.display="none";
	document.getElementById("layer").style.display="none";
});

//再ログイン
room.on('reloadRoom', () => {
    if(confirm("現在参加中のルームがあります。\n再ログインしますか？")){
        window.location.href = '/guest/';
    }
});
