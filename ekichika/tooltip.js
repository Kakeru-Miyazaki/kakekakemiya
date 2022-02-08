var stationTooltip;

var stationTooltipScale = 1;  //for tooltip
var stationTooltipPreviousScale = 1;
var stationTooltipFontSize = 10;
var stationTooltipLowerScaleThreshold = 1.8;
var stationTooltipHigherScaleThreshold = 10.5;

//var stationTooltipBgWidth = 60;
//var stationTooltipBgHeight = 20;

//var stationTooltipDataN = 2;

var stationFoldedTooltipFlag = {};  //key：クラス, true for show, false for remove
var stationTooltipFlag = {};

var stationTooltips = svg.append("g")
  .attr("class", "stationTooltips")
  .attr("transform", "translate(0, 0) scale(1)");

function tooltipHandlerOnCircle(event){
  var selected_circle = d3.select(this);
  var cx = selected_circle.attr("cx");
  var cy = selected_circle.attr("cy");
  var data = [selected_circle.datum().name];
  var ID = data[0] + data[1];
  var transform = selected_circle.attr("transform");
  var stationTooltipClass = "stationTooltip" + ID;

  if(event.type == "mouseover"){
    stationTooltipFlag[stationTooltipClass] = true;
    setTimeout(() => {
      if(stationTooltipFlag[stationTooltipClass] && stationTooltipScale > stationTooltipLowerScaleThreshold && stationTooltipScale < stationTooltipHigherScaleThreshold){
        if(stationTooltips.select("." + stationTooltipClass).empty()){
          showStationTooltip(event, data, stationTooltipClass ,cx, cy, transform);
        }
      }
    }, 180);
  }
  else if(event.type == "mouseout"){
    stationTooltipFlag[stationTooltipClass] = false;
    setTimeout(() => {
      if(stationTooltipFlag[stationTooltipClass] == false){
        hideStationTooltip(event, stationTooltipClass);
        delete stationTooltipFlag[stationTooltipClass];
      }
    }, 0);
  }
}

function showStationTooltip(event, data, stationTooltipClass, x, y, transform, y_offset=-10, x_offset=0){
  var y_col = parseFloat(y) + y_offset / Math.cbrt(stationTooltipScale);
  var x_col = parseFloat(x) + x_offset / Math.cbrt(stationTooltipScale);
  var scaled_fontsize = stationTooltipFontSize / Math.cbrt(stationTooltipScale);
  var dataN = data.length;
  var textMaxLength = 0;
  var stationTooltipBgWidth;
  for(var i = 0; i < dataN; i++){
    if (textMaxLength < data[i].length){
      textMaxLength = data[i].length;
    }
  }
  stationTooltipBgWidth = scaled_fontsize * textMaxLength * 1.2;

  stationTooltip = stationTooltips
      .append("g")
      .attr("class", stationTooltipClass)
      .on("mouseover", tooltipHandlerOnTooltip)
      .on("mouseout", tooltipHandlerOnTooltip);
  //console.log(stationTooltipZoom);
  stationTooltip.selectAll(".stationTooltipText")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "stationTooltipText")
      .attr("fill", "white")
      .attr("stroke", "none")
      .attr("text-anchor", "middle")
      .attr("x", x_col)
      .attr("y", y_col)
      .attr("dy", function(d, i){return - scaled_fontsize * (dataN - i - 1); })
      .attr("font-size", scaled_fontsize)
      .text(function(d){return d; });
      //console.log(stationTooltip);
  
  stationTooltip
      .append("rect")
      .attr("class", "stationTooltipBg")
      .attr("width", stationTooltipBgWidth)
      .attr("height", scaled_fontsize * dataN * 1.2)
      .attr("x", x_col - stationTooltipBgWidth / 2.0)
      .attr("y", y_col - scaled_fontsize * dataN)
      .attr("rx", 1)
      .attr("rx", 1)
      .attr("fill", "black")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "white")
      .attr("stroke-width", 0.1);
}
function hideStationTooltip(event, stationTooltipClass){
  svg.selectAll("." + stationTooltipClass).remove();
}
function resizeStationTooltip(event){
  stationTooltipScale = event.transform.k;
  var y_offset = -10;
  var x_offset = 0;

  var scaled_fontsize = stationTooltipFontSize / Math.cbrt(stationTooltipScale);
  var scaled_previous_fontsize = stationTooltipFontSize / Math.cbrt(stationTooltipPreviousScale);

  var scaled_y_offset = y_offset / Math.cbrt(stationTooltipScale);
  var scaled_previous_y_offset = y_offset / Math.cbrt(stationTooltipPreviousScale);

  var scaled_x_offset = x_offset / Math.cbrt(stationTooltipScale);
  var scaled_previous_x_offset = x_offset / Math.cbrt(stationTooltipPreviousScale);

  if (stationTooltips != undefined){
    stationTooltips.attr("transform", event.transform);
  }
  if(stationTooltips != undefined && stationTooltips.selectAll(".stationTooltipText").empty() != true){
    var dataN = 1.0;
    stationTooltips.selectAll(".stationTooltipText")
              .attr("font-size", scaled_fontsize)
              .attr("x", function(d, i){
                var current_x = parseFloat(d3.select(this).attr("x"));
                return current_x + scaled_x_offset - scaled_previous_x_offset;
              })
              .attr("y", function(d, i){
                var current_y = parseFloat(d3.select(this).attr("y"));
                return current_y + scaled_y_offset - scaled_previous_y_offset;
              })
              .attr("dy", function(d, i){return - scaled_fontsize * (dataN - i - 1); });
    stationTooltips.selectAll(".stationTooltipBg")
              .attr("width", function(){
                var current_width = parseFloat(d3.select(this).attr("width"));
                return current_width * scaled_fontsize / scaled_previous_fontsize; 
              })
              .attr("height", scaled_fontsize * dataN * 1.2)
              .attr("x", function(){
                var current_x = parseFloat(d3.select(this).attr("x"));
                var current_width = parseFloat(d3.select(this).attr("width"));
                return current_x + scaled_x_offset - scaled_previous_x_offset - current_width * scaled_fontsize / scaled_previous_fontsize / 2.0 + current_width / 2.0;
              })
              .attr("y", function(){
                var current_y = parseFloat(d3.select(this).attr("y"));
                return current_y + scaled_y_offset - scaled_previous_y_offset - scaled_fontsize * dataN + scaled_previous_fontsize * dataN;
              })
  }
  stationTooltipPreviousScale = stationTooltipScale;
}
function hideStationTooltipOnZoom(event){
  if (event.transform.k < stationTooltipLowerScaleThreshold || event.transform.k > stationTooltipHigherScaleThreshold){
    stationTooltips.selectAll("g").remove();
  }
}

function tooltipHandlerOnTooltip(event){
  var selectedTooltip = d3.select(this);
  var stationTooltipClass = selectedTooltip.attr("class")
  if(event.type == "mouseover"){
    stationTooltipFlag[stationTooltipClass] = true;
  }
  else if(event.type == "mouseout"){
    stationTooltipFlag[stationTooltipClass] = false;
    setTimeout(() => {
      if(stationTooltipFlag[stationTooltipClass] == false){
        hideStationTooltip(event, stationTooltipClass);
        delete stationTooltipFlag[stationTooltipClass];
      }
    }, 10);
  }
}

//==================== Folded tooltip =============================//
function foldedTooltipHandlerOnCircle(event){
  var selected_circle = d3.select(this);
  var cx = selected_circle.attr("cx");
  var cy = selected_circle.attr("cy");
  var data = [selected_circle.datum().name];
  var ID = data[0] + data[1];
  var transform = selected_circle.attr("transform");
  var stationTooltipClass = "stationFoldedTooltip" + ID;

  if(event.type == "mouseover"){
    stationTooltipFlag[stationTooltipClass] = true;
    setTimeout(() => {
      if(stationTooltipFlag[stationTooltipClass] && stationTooltipScale > stationTooltipLowerScaleThreshold && stationTooltipScale < stationTooltipHigherScaleThreshold){
        if(stationTooltips.select("." + stationTooltipClass).empty()){
          showStationTooltip(event, data, stationTooltipClass ,cx, cy, transform);
        }
      }
    }, 180);
  }
  else if(event.type == "mouseout"){
    stationTooltipFlag[stationTooltipClass] = false;
    setTimeout(() => {
      if(stationTooltipFlag[stationTooltipClass] == false){
        hideStationTooltip(event, stationTooltipClass);
        delete stationTooltipFlag[stationTooltipClass];
      }
    }, 1);
  }
}

function showStationFoldedTooltip(event, data, stationFoldedTooltipClass, x, y, transform, y_offset=-10, x_offset=0){
  var y_col = parseFloat(y) + y_offset / Math.cbrt(stationTooltipScale);
  var x_col = parseFloat(x) + x_offset / Math.cbrt(stationTooltipScale);
  var scaled_fontsize = stationTooltipFontSize / Math.cbrt(stationTooltipScale);
  var dataN = data.length;
  var textMaxLength = 0;
  var stationTooltipBgWidth;
  for(var i = 0; i < dataN; i++){
    if (textMaxLength < data[i].length){
      textMaxLength = data[i].length;
    }
  }
  stationTooltipBgWidth = scaled_fontsize * textMaxLength * 1.2;

  stationTooltip = stationTooltips
      .append("g")
      .attr("class", stationFoldedTooltipClass)
      .on("mouseover", tooltipHandlerOnTooltip)
      .on("mouseout", tooltipHandlerOnTooltip);
  //console.log(stationTooltipZoom);
  stationTooltip.selectAll(".stationTooltipText")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "stationTooltipText")
      .attr("fill", "white")
      .attr("stroke", "none")
      .attr("text-anchor", "middle")
      .attr("x", x_col)
      .attr("y", y_col)
      .attr("dy", function(d, i){return - scaled_fontsize * (dataN - i - 1); })
      .attr("font-size", scaled_fontsize)
      .text(function(d){return d; });
      //console.log(stationTooltip);
  
  stationTooltip
      .append("rect")
      .attr("class", "stationTooltipBg")
      .attr("width", stationTooltipBgWidth)
      .attr("height", scaled_fontsize * dataN * 1.2)
      .attr("x", x_col - stationTooltipBgWidth / 2.0)
      .attr("y", y_col - scaled_fontsize * dataN)
      .attr("rx", 1)
      .attr("rx", 1)
      .attr("fill", "black")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "white")
      .attr("stroke-width", 0.1);
}
function hideStationFoldedTooltip(event, stationFoldedTooltipClass){
  svg.selectAll("." + stationFoldedTooltipClass).remove();
}
function resizeStationFoldedTooltip(event){
  stationTooltipScale = event.transform.k;
  var y_offset = -10;
  var x_offset = 0;

  var scaled_fontsize = stationTooltipFontSize / Math.cbrt(stationTooltipScale);
  var scaled_previous_fontsize = stationTooltipFontSize / Math.cbrt(stationTooltipPreviousScale);

  var scaled_y_offset = y_offset / Math.cbrt(stationTooltipScale);
  var scaled_previous_y_offset = y_offset / Math.cbrt(stationTooltipPreviousScale);

  var scaled_x_offset = x_offset / Math.cbrt(stationTooltipScale);
  var scaled_previous_x_offset = x_offset / Math.cbrt(stationTooltipPreviousScale);

  if (stationTooltips != undefined){
    stationTooltips.attr("transform", event.transform);
  }
  if(stationTooltips != undefined && stationTooltips.selectAll(".stationTooltipText").empty() != true){
    var dataN = 1.0;
    stationTooltips.selectAll(".stationTooltipText")
              .attr("font-size", scaled_fontsize)
              .attr("x", function(d, i){
                var current_x = parseFloat(d3.select(this).attr("x"));
                return current_x + scaled_x_offset - scaled_previous_x_offset;
              })
              .attr("y", function(d, i){
                var current_y = parseFloat(d3.select(this).attr("y"));
                return current_y + scaled_y_offset - scaled_previous_y_offset;
              })
              .attr("dy", function(d, i){return - scaled_fontsize * (dataN - i - 1); });
    stationTooltips.selectAll(".stationTooltipBg")
              .attr("width", function(){
                var current_width = parseFloat(d3.select(this).attr("width"));
                return current_width * scaled_fontsize / scaled_previous_fontsize; 
              })
              .attr("height", scaled_fontsize * dataN * 1.2)
              .attr("x", function(){
                var current_x = parseFloat(d3.select(this).attr("x"));
                var current_width = parseFloat(d3.select(this).attr("width"));
                return current_x + scaled_x_offset - scaled_previous_x_offset - current_width * scaled_fontsize / scaled_previous_fontsize / 2.0 + current_width / 2.0;
              })
              .attr("y", function(){
                var current_y = parseFloat(d3.select(this).attr("y"));
                return current_y + scaled_y_offset - scaled_previous_y_offset - scaled_fontsize * dataN + scaled_previous_fontsize * dataN;
              })
  }
  stationTooltipPreviousScale = stationTooltipScale;
}
function hideStationFoldedTooltipOnZoom(event){
  if (event.transform.k < stationTooltipLowerScaleThreshold || event.transform.k > stationTooltipHigherScaleThreshold){
    stationTooltips.selectAll("g").remove();
  }
}
function foldedTooltipHandlerOnFoldedTooltip(event){
  var selectedTooltip = d3.select(this);
  var stationTooltipClass = selectedTooltip.attr("class")
  if(event.type == "mouseover"){
    stationTooltipFlag[stationTooltipClass] = true;
  }
  else if(event.type == "mouseout"){
    stationTooltipFlag[stationTooltipClass] = false;
    setTimeout(() => {
      if(stationTooltipFlag[stationTooltipClass] == false){
        hideStationTooltip(event, stationTooltipClass);
        delete stationTooltipFlag[stationTooltipClass];
      }
    }, 10);
  }
}
function ChFoldedTooltipColor(event, stationFoldedTooltipClass){
  svg.selectAll("." + stationFoldedTooltipClass).attr()
}