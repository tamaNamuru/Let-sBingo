function show(id) {
  if (document.all) {
    document.all.item(id).style.visibility = "visible";
  }
  else if (document.layers) {
    document.layers[id].visibility = "show";
  }
  else if (document.getElementById) {
    document.getElementById(id).style.visibility = "visible";
  }
}
function hide(id) {
  if (document.all) {
    document.all.item(id).style.visibility = "hidden";
  }
  else if (document.layers) {
    document.layers[id].visibility = "hide";
  }
  else if (document.getElementById) {
    document.getElementById(id).style.visibility = "hidden";
  }
}

function hyoji(pic) {
  document.LgIMG.src ="image/" +  pic + ".jpg";
}

function ChangeTab(tabname) {
  document.getElementById('card').style.display = 'none';
  document.getElementById('keihin').style.display = 'none';
  
  document.getElementById(tabname).style.display = 'block';
}