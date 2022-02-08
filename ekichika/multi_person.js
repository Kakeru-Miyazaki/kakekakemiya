function multi_person() {
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
    console.log("multi_person_mode");
    d3.selectAll("line")
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("opacity", 0);
    show_center_station();
  }
  clicked_stations.clear();
}

clicked_stations_names;

function show_center_station() {
  meet_up(clicked_stations, 180, stationQueue, goal_station_name_ID, goal_station_time).then(
    () => {
      while (stationQueue.length) {
        var rinsetsu_stations = stationQueue.shift();
        g.select(".s" + rinsetsu_stations[0] + "_" + rinsetsu_stations[1])
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("opacity", 1);
      }
      g.selectAll(".circle").attr("fill-opacity", 0.2).attr("fill", "white");
      g.selectAll(".wave_in").remove();
      for (var clicked_station_id of clicked_stations_names) {
        g.select("#" + clicked_station_id)
          .attr("fill-opacity", 1)
          .attr("fill", "red");
      }
      if (goal_station_name_ID.length == 1) {

        document.getElementById("goalOne").style.display = "block";
        document.getElementById("goalGreen").style.display = "none";
        document.getElementById("goalPurple").style.display = "none";
        // center_stationは駅名+グループID
        var center_station = goal_station_name_ID.shift();
        document.getElementById("goalOneName").innerHTML = center_station.replace(/[0-9]/gi, '');

        // 最短駅までの時間
        var center_station_time = goal_station_time.shift();
        console.log("center_station_time:" + center_station_time);
        document.getElementById("goalOneTime").innerHTML = getDisplayTime(center_station_time);//Math.ceil(center_station_time) + "min";

        g.select("#" + center_station)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("fill-opacity", 1)
          .attr("fill", "lime");
        Greens = [];
        Greens.push(center_station);
        show_waves(center_station);
      } else if (goal_station_name_ID.length == 2) {
        document.getElementById("goalGreen").style.display = "block";
        document.getElementById("goalPurple").style.display = "block";
        document.getElementById("goalOne").style.display = "none";

        var center_station = goal_station_name_ID.shift();
        var nearest_hub_station = goal_station_name_ID.shift();
        document.getElementById("goalGreenName").innerHTML = center_station.replace(/[0-9]/gi, '');
        document.getElementById("goalPurpleName").innerHTML = nearest_hub_station.replace(/[0-9]/gi, '');

        var center_station_time = goal_station_time.shift();
        var nearest_hub_station_time = goal_station_time.shift();
        console.log("center_station_time:" + center_station_time);
        console.log("nearest_hub_station_time:" + nearest_hub_station_time);
        document.getElementById("goalGreenTime").innerHTML = getDisplayTime(center_station_time);//Math.ceil(center_station_time) + "min";
        document.getElementById("goalPurpleTime").innerHTML = getDisplayTime(nearest_hub_station_time); //+ "min";

        g.select("#" + center_station)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("fill-opacity", 1)
          .attr("fill", "lime");
        Greens = [];
        Greens.push(center_station);
        g.select("#" + nearest_hub_station)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("fill-opacity", 1)
          .attr("fill", "darkviolet");
        Purples = [];
        Purples.push(nearest_hub_station);
        show_waves(center_station);
        show_waves(nearest_hub_station);
      }
    }
  );
}

function show_waves(ekiID) {
  var circle_cx = d3.select("#" + ekiID).attr("cx");
  var circle_cy = d3.select("#" + ekiID).attr("cy");
  var circle_transform = d3.select("#" + ekiID).attr("transform");
  g.selectAll(".wave_out_animation").attr("to", 8);

  var wave = g
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 0.2)
    .attr("class", "wave wave_in")
    .attr("opacity", 1)
    .attr("fill-opacity", 0)
    .attr("cx", circle_cx)
    .attr("cy", circle_cy)
    .attr("r", 0)
    .attr("transform", circle_transform);

  wave
    .append("animate")
    .attr("attributeName", "r")
    .attr("begin", "0s")
    .attr("dur", "1s")
    .attr("from", "25")
    .attr("to", "0")
    .attr("repeatCount", "indefinite");
}

function getDisplayTime(time) {
  time = Math.ceil(time);
  if (time < 60) {
    return time + "min";
  } else if (time % 60 == 0) {
    return Math.floor(time / 60) + "h";
  } else if (time % 60 > 0) {
    return Math.floor(time / 60) + "h " + (time % 60) + "min";
  }
  return -1;
}