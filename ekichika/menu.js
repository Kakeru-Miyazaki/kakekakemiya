// onMenuChange();


function onMenuChange() {
  // var mode;
  reset_selections();
  let elems = document.getElementsByName("radio");
  // let val = "";

  for (let i = 0; i < elems.length; i++) {
    if (elems[i].checked) {
      mode = elems[i].value;
    }
  } // end for i

  console.log(mode);

  if (mode == "one") {
    document.getElementById("clockAndTime").style.display = "block";
    document.getElementById("goalStations").style.display = "none";
  } else if (mode == "meet") {
    document.getElementById("clockAndTime").style.display = "none";
    document.getElementById("goalStations").style.display = "block";
    document.getElementById("goalGreen").style.display = "none";
    document.getElementById("goalPurple").style.display = "none";
    document.getElementById("goalOne").style.display = "none";
  } else if (mode == "meetWithTime") {
    document.getElementById("clockAndTime").style.display = "block";
    document.getElementById("goalStations").style.display = "none";
  }
}