function clearSelectedEkilist() {
  //親要素取得
  let selectedEkilist = document.getElementById('selectedEkilist');
  //子要素取得
  let children = document.getElementsByClassName('ekilist');
  //子要素数取得
  let len = children.length;

  for (let i = 0; i < len; i++) {
    selectedEkilist.removeChild(children[0]);
  }
}

function insertAllSelectedEkilist() {
  clearSelectedEkilist();
  clicked_stations_names.forEach(insertEkiname);
}

function insertEkiname(value) {
  // id属性で要素を取得
  var textbox_element = document.getElementById('selectedEkilist');

  // 新しいHTML要素を作成
  var new_element = document.createElement('span');
  value = value.replace(/[0-9]/gi, '');
  new_element.textContent = value;
  new_element.classList.add("ekilist");

  // 指定した要素の中の末尾に挿入
  textbox_element.appendChild(new_element);

}

