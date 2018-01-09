//htmlに直接書き込んだらエラーが出たのでここに書いてます
function deleteRoom(){
    if(confirm("ルームを破棄すると復元することはできませんがよろしいですか？")){
        window.location.href = "/delete";
    }
}
