function single_person() {
  if (clicked_stations.size == 0) {
    document.getElementById("keiziban").innerHTML = "駅を選んでください";
    document.getElementById("ledText").style.display = "block";
    console.log("no stations selected !");
    return;
  } else if (clicked_stations.size == 1) {
    console.log("1 person mode");
    g.selectAll("line")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("opacity", 0);
    for (var value of clicked_stations) { //実際は一つ取り出しているだけ
      show_within_stations(value);
    }
  }
}

function show_within_stations(groupid) {
  within_T_min(groupid, userSetHour * 60 + userSetTime, stationQueue).then(
    () => {
      while (stationQueue.length) {
        var rinsetsu_stations = stationQueue.shift();
        g.select(".s" + rinsetsu_stations[0] + "_" + rinsetsu_stations[1])
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("opacity", 1);
      }
    }
  );
}