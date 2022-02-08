function multi_person_within_time() {
  for (var single_station of clicked_stations_names) {
    single_station = single_station.replace(/[0-9]/gi, '');
    clicked_stations.add(ekiNameToEkiData[single_station].GroupID);
  }
  if (clicked_stations.size < 2) {
    document.getElementById("keiziban").innerHTML = "駅を2つ以上選んでください";
    document.getElementById("ledText").style.display = "block";
    console.log("num of stations selected is not enough!");
    return;
  } else {
    console.log("multi_person_within_tiime_mode");
    d3.selectAll("line")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("opacity", 0);
    show_multi_station();
  }
  clicked_stations.clear();
}

function show_multi_station() {
  meet_up_within_T_min(
    clicked_stations,
    userSetHour * 60 + userSetTime,
    stationQueue,
    goal_station_name_ID
  ).then(() => {
    g.selectAll(".circle")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("fill-opacity", 0.2)
      .attr("fill", "white");
    if (stationQueue.length == 0) {
      document.getElementById("keiziban").innerHTML = "該当駅がありません...";
      document.getElementById("ledText").style.display = "block";
    }
    while (stationQueue.length) {
      var rinsetsu_stations = stationQueue.shift();
      g.select(".s" + rinsetsu_stations[0] + "_" + rinsetsu_stations[1])
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("opacity", 1);
    }
    while (goal_station_name_ID.length) {
      var station = goal_station_name_ID.shift();
      g.select("#" + station)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("fill-opacity", 0.5)
        .attr("fill", "royalblue");
    }
    for (var clicked_station_id of clicked_stations_names) {
      g.selectAll("#" + clicked_station_id)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("fill-opacity", 1)
        .attr("fill", "red");
    }
  });
}
