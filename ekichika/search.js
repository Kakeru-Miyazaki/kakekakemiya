//search.js
/*
引数: stationQueue 空の配列の参照　→　表示するルートが随時pushされる.
引数: goalStationNameID 空の配列の参照  → 集合地点の "名前+GROUPID" がプッシュされる.

=============使い方============

    within_T_min(startGroupID, 60, stationQueue)
        .then(() => {
            - 探索後に行いたい処理 - 
        });

また
    meet_up(startGroupID, 60, stationQueue, goalStationNameID)
        .then(() => {
            - 探索後に行いたい処理 - 
        });

とすれば、thenの中身が探索終了後に実行されるはず
*/
async function within_T_min(startGroupID, T, stationQueue) {
    var Adj_list = {};   //隣接リスト　keyはstation ID
    var groupInfo = {};  //グループIDでそのグループ内の駅情報を検索するための辞書 keyはgroupe ID
    var stationInfo = {};   //駅idで駅情報検索
    var time = {};       //その駅グループに到達するまでの所要時間    keyはgroupe ID
    var visited_station_flag = {};
    var previousStation = {};  //ひとつ前の[駅ID, routename]を格納　keyはgroupe ID

    var queue = new pairing_heap(); //最大ヒープ

    var ARAKAWASEN = 0.8;   //所要時間0分の駅間の所要時間
    var changeTrains_time = 5;  //乗り換え時間
    var stopTime = 0.75;         //停車時間

    await Make_Adj_List();
    await dijkstra();
    return true;
    //return //到達可能駅のリスト
    function Make_Adj_List() {
        return new Promise(resolve => {
            var groupInfo_flag = {}

            d3.csv("join.csv").then(function(data){
                data.forEach(function(d){
                    var time_tmp
                    //時間を設定
                    if (d.time == 0) {
                        time_tmp = parseFloat(ARAKAWASEN) + parseFloat(stopTime);  //d.time=0のときの例外処理
                    } else {
                        time_tmp = parseFloat(d.time) + parseFloat(stopTime);
                    }
                    //groupInfoを追加
                    if (groupInfo[d.fromGroupID] == undefined) {
                        groupInfo[d.fromGroupID] = [[d.fromID, d.fromName, d.routeID, d.routeName]];
                        groupInfo_flag[d.fromGroupID] = [d.fromID];
                    } else if (groupInfo_flag[d.fromGroupID].indexOf(d.fromID) == -1) {
                        groupInfo[d.fromGroupID].push([d.fromID, d.fromName, d.routeID, d.routeName]);
                        groupInfo_flag[d.fromGroupID].push(d.fromID);
                    }
                    if (groupInfo[d.toGroupID] == undefined) {
                        groupInfo[d.toGroupID] = [[d.toID, d.toName, d.routeID, d.routeName]];
                        groupInfo_flag[d.toGroupID] = [d.toID];
                    } else if (groupInfo_flag[d.toGroupID].indexOf(d.toID) == -1) {
                        groupInfo[d.toGroupID].push([d.toID, d.toName, d.routeID, d.routeName]);
                        groupInfo_flag[d.toGroupID].push(d.toID);
                    }
                    //隣接リストに追加
                    if (Adj_list[d.fromID] == undefined) {
                        Adj_list[d.fromID] = [[d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, time_tmp]];
                        stationInfo[d.fromID] = { GroupID: d.fromGroupID, stationName: d.fromName, routeID: d.routeID, routeName: d.routeName };
                        time[d.fromID] = T + 100;
                        //previousStation[d.fromID] = [];
                        visited_station_flag[d.fromID] = false;

                        for (var i = 0; i < groupInfo[d.fromGroupID].length; i++) {
                            if (groupInfo[d.fromGroupID][i][0] != d.fromID) {
                                var StID_tmp = groupInfo[d.fromGroupID][i][0];
                                var StName_tmp = groupInfo[d.fromGroupID][i][1];
                                var RouteID_tmp = groupInfo[d.fromGroupID][i][2];
                                var RouteName_tmp = groupInfo[d.fromGroupID][i][3];
                                Adj_list[d.fromID].push([d.fromGroupID, StID_tmp, StName_tmp, RouteID_tmp, RouteName_tmp, changeTrains_time]);
                                Adj_list[StID_tmp].push([d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, changeTrains_time]);
                            }
                        }
                    }
                    else {
                        Adj_list[d.fromID].push([d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, time_tmp]);
                    }
                    if (Adj_list[d.toID] == undefined) {
                        Adj_list[d.toID] = [[d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, time_tmp]];
                        stationInfo[d.toID] = { GroupID: d.toGroupID, stationName: d.toName, routeID: d.routeID, routeName: d.routeName };
                        time[d.toID] = T + 100;
                        //previousStation[d.toID] = [];
                        visited_station_flag[d.toID] = false;
                        //同一グループ内の駅とつなげる
                        for (var i = 0; i < groupInfo[d.toGroupID].length; i++) {
                            if (groupInfo[d.toGroupID][i][0] != d.toID) {
                                var StID_tmp = groupInfo[d.toGroupID][i][0];
                                var StName_tmp = groupInfo[d.toGroupID][i][1];
                                var RouteID_tmp = groupInfo[d.toGroupID][i][2];
                                var RouteName_tmp = groupInfo[d.toGroupID][i][3];
                                Adj_list[d.toID].push([d.toGroupID, StID_tmp, StName_tmp, RouteID_tmp, RouteName_tmp, changeTrains_time]);
                                Adj_list[StID_tmp].push([d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, changeTrains_time]);
                            }
                        }
                    }
                    else {
                        Adj_list[d.toID].push([d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, time_tmp]);
                    }


                });
            }).then(() => {resolve(true); });
        });
    }
    function dijkstra() {
        return new Promise(resolve => {
            for (var j = 0; j < groupInfo[startGroupID].length; j++) {
                var startStationID = groupInfo[startGroupID][j][0];
                time[startStationID] = 0; //スタート地点の時間は0
                previousStation[startStationID] = [startGroupID, -1, "start", "start"];
                queue.enqueue(-time[startStationID], startStationID);   //最大ヒープなのでtimeにマイナス付ける
            }

            while (queue.size() != 0) {
                var currentStationID = queue.dequeue();
                var currentStationName = stationInfo[currentStationID].stationName;
                var currentGroupID = stationInfo[currentStationID].GroupID;
                var currentStationRouteName = stationInfo[currentStationID].routeName;
                var currentStationRouteID = stationInfo[currentStationID].routeID;
                if (visited_station_flag[currentStationID] == false) {
                    visited_station_flag[currentStationID] = true;
                    if (previousStation[currentStationID][0] != currentGroupID) {
                        //Groupが違えば乗り換えでない
                        stationQueue.push([previousStation[currentStationID][1], currentStationID]);
                    }
                    //同一路線が繋がらないバグ修正
                    for (var j = 0; j < Adj_list[currentStationID].length; j++) {
                        Adj_stationID = Adj_list[currentStationID][j][1];
                        Adj_stationRouteID = Adj_list[currentStationID][j][3];
                        if (Adj_stationRouteID == currentStationRouteID && previousStation[currentStationID][1] != Adj_stationID && visited_station_flag[Adj_stationID] == true) {
                            stationQueue.push([currentStationID, Adj_stationID]);
                        }
                    }
                    for (var j = 0; j < Adj_list[currentStationID].length; j++) {
                        var nextStationID = Adj_list[currentStationID][j][1];
                        var dt = parseFloat(Adj_list[currentStationID][j][5]);  //次の駅までの所要時間
                        var current_node_time = parseFloat(time[currentStationID]);
                        var next_node_time = parseFloat(time[nextStationID]);
                        if ((next_node_time > current_node_time + dt && current_node_time + dt < T)) {
                            time[nextStationID] = current_node_time + dt;
                            previousStation[nextStationID] = [currentGroupID, currentStationID, currentStationName, currentStationRouteName];
                            queue.enqueue(-time[nextStationID], nextStationID);
                        }
                    }
                }

            }
            resolve(true);
        });
    }
}
async function meet_up(startGroupID_set, T, stationQueue, goalStationNameID, goalStationMaxTime){
    var N = startGroupID_set.size;
    var Adj_list = {};
    var groupInfo = {};
    var numOfVisitors = {};
    var stationInfo = {};
    var meetupFlag = {nearest: false, hub: false};

    //以下の変数は人数分準備
    var time = Array(N);
    var previousStation = Array(N);
    var visited_group_flag = Array(N);    //訪問済みならtrue 未訪問はfalse groupID
    var startGroupID = Array(N);

    for(var i = 0; i < N; i++){
        time[i] = {};
        previousStation[i] = {};
        visited_group_flag[i] = {};
    }
    var counter = 0
    for (var value of startGroupID_set) {
        startGroupID[counter] = value;
        counter++;
    }

    var queue = new pairing_heap();

    var ARAKAWASEN = 0.8;
    var changeTrains_time = 5;
    var stopTime = 0.75;
    var hubStationThreshold = 3;
    
    //実際の処理
   await Make_Adj_List_meetup();
   await dijkstra_meetup();
   return true

    function Make_Adj_List_meetup(){
        return new Promise(resolve =>{
            var groupInfo_flag = {};

            d3.csv("join.csv").then(function(data){
                data.forEach(function(d){
                    var time_tmp
                    //時間を設定
                    if (d.time == 0){
                        time_tmp = parseFloat(ARAKAWASEN) + parseFloat(stopTime);  //d.time=0のときの例外処理
                    }else{
                        time_tmp = parseFloat(d.time) + parseFloat(stopTime);
                    }
                    //groupInfoを追加
                    if (groupInfo[d.fromGroupID] == undefined){
                        groupInfo[d.fromGroupID] = [[d.fromID, d.fromName, d.routeID, d.routeName]];
                        groupInfo_flag[d.fromGroupID] = [d.fromID];
                        numOfVisitors[d.fromGroupID] = parseInt(0);
                        for(var i = 0; i < N; i++){
                            visited_group_flag[i][d.fromGroupID] = false;
                        }
                    }else if(groupInfo_flag[d.fromGroupID].indexOf(d.fromID) == -1){
                        groupInfo[d.fromGroupID].push([d.fromID, d.fromName, d.routeID, d.routeName]);
                        groupInfo_flag[d.fromGroupID].push(d.fromID);
                    }
                    if (groupInfo[d.toGroupID] == undefined){
                        groupInfo[d.toGroupID] = [[d.toID, d.toName, d.routeID, d.routeName]];
                        groupInfo_flag[d.toGroupID] = [d.toID];
                        numOfVisitors[d.toGroupID] = parseInt(0);
                        for(var i = 0; i < N; i++){
                            visited_group_flag[i][d.toGroupID] = false;
                        }
                    }else if(groupInfo_flag[d.toGroupID].indexOf(d.toID) == -1){
                        groupInfo[d.toGroupID].push([d.toID, d.toName, d.routeID, d.routeName]);
                        groupInfo_flag[d.toGroupID].push(d.toID);
                    }
                    //隣接リストに追加
                    if (Adj_list[d.fromID] == undefined){
                        Adj_list[d.fromID] = [[d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, time_tmp]];
                        stationInfo[d.fromID] = {GroupID: d.fromGroupID, stationName: d.fromName, routeID: d.routeID, routeName: d.routeName};
                        for (var i = 0; i < N; i++){
                            time[i][d.fromID] = T + 100;
                            //previousStation[i][d.fromID] = [];
                        }
                        for (var i = 0; i < groupInfo[d.fromGroupID].length; i++){
                            if(groupInfo[d.fromGroupID][i][0] != d.fromID){
                                var StID_tmp = groupInfo[d.fromGroupID][i][0];
                                var StName_tmp = groupInfo[d.fromGroupID][i][1];
                                var RouteID_tmp = groupInfo[d.fromGroupID][i][2];
                                var RouteName_tmp = groupInfo[d.fromGroupID][i][3];
                                Adj_list[d.fromID].push([d.fromGroupID, StID_tmp, StName_tmp, RouteID_tmp, RouteName_tmp, changeTrains_time]);
                                Adj_list[StID_tmp].push([d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, changeTrains_time]);
                            }
                        }
                    }
                    else{
                        Adj_list[d.fromID].push([d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, time_tmp]);

                    }
                    if (Adj_list[d.toID] == undefined){
                        Adj_list[d.toID] = [[d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, time_tmp]];
                        stationInfo[d.toID] = {GroupID: d.toGroupID, stationName: d.toName, routeID: d.routeID, routeName: d.routeName};
                        for (var i = 0; i < N; i++){
                            time[i][d.toID] = T + 100;
                            //previousStation[i][d.toID] = [];
                        }
                        //同一グループ内の駅とつなげる
                        for (var i = 0; i < groupInfo[d.toGroupID].length; i++){
                            if(groupInfo[d.toGroupID][i][0] != d.toID){
                                var StID_tmp = groupInfo[d.toGroupID][i][0];
                                var StName_tmp = groupInfo[d.toGroupID][i][1];
                                var RouteID_tmp = groupInfo[d.toGroupID][i][2];
                                var RouteName_tmp = groupInfo[d.toGroupID][i][3];
                                Adj_list[d.toID].push([d.toGroupID, StID_tmp, StName_tmp, RouteID_tmp, RouteName_tmp, changeTrains_time]);
                                Adj_list[StID_tmp].push([d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, changeTrains_time]);
                            }
                        }
                    }
                    else{
                        Adj_list[d.toID].push([d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, time_tmp]);
                    } 
                });
                return 1;
            }).then(() => {resolve(true); });
        });
    }
    function dijkstra_meetup(){
        return new Promise(resolve =>{
        //返り値は集合地点の　駅名+駅ID
            for(var i = 0; i < N; i++){
                for(var j = 0; j < groupInfo[startGroupID[i]].length; j++){
                    var startStationID = groupInfo[startGroupID[i]][j][0];
                    time[i][startStationID] = 0;
                    previousStation[i][startStationID] = [startGroupID, -1, "start:" + i, "start:" + i];
                    queue.enqueue(-time[i][startStationID], [i, startStationID]);
                }
                //console.log("スタート地点", groupInfo[startGroupID[i]]);
            }
            while(queue.size() != 0){
                var dequeued_item = queue.dequeue();
                var i = dequeued_item[0]; //i is personal_id
                var currentStationID = dequeued_item[1];
                var currentStationName = stationInfo[currentStationID].stationName;
                var currentGroupID = stationInfo[currentStationID].GroupID;
                var currentStationRouteName = stationInfo[currentStationID].routeName;

                if (visited_group_flag[i][currentGroupID] == false){
                    //iさんが未訪問なら訪問したことを記録し
                    //訪問人数を +1
                    visited_group_flag[i][currentGroupID] = true;
                    numOfVisitors[currentGroupID] += parseInt(1);
                    if (numOfVisitors[currentGroupID] == N){
                        //var noriire = Adj_list[currentStationID].length;
                        var noriire = groupInfo[currentGroupID].length
                        if(meetupFlag.nearest == false){
                            meetupFlag.nearest = true;
                            if(noriire >= hubStationThreshold){
                                meetupFlag.hub = true;
                            }
                            traceBack(currentGroupID);
                            goalStationMaxTime.push(time[i][currentStationID]);
                        }else if(meetupFlag.hub == false && noriire >= hubStationThreshold){
                            meetupFlag.hub = true;
                            traceBack(currentGroupID);
                            goalStationMaxTime.push(time[i][currentStationID]);
                        }
                        //console.log(meetupFlag);
                        if(meetupFlag.nearest && meetupFlag.hub){
                            break;
                        }
                    }
                }
                for(var j = 0; j < Adj_list[currentStationID].length; j++){
                    var nextStationID = Adj_list[currentStationID][j][1];
                    var dt = parseFloat(Adj_list[currentStationID][j][5]);
                    var current_node_time = parseFloat(time[i][currentStationID]);
                    var next_node_time = parseFloat(time[i][nextStationID]);

                    if( (next_node_time > current_node_time + dt) && (current_node_time + dt < T)){
                        time[i][nextStationID] = current_node_time + dt;
                        previousStation[i][nextStationID] = [currentGroupID, currentStationID, currentStationName, currentStationRouteName];
                        queue.enqueue(-time[i][nextStationID], [i, nextStationID]);
                    }
                }
            }
            resolve(true);
        });
    }
    function traceBack(goalGroupID){
        var queue4trace = new pairing_heap();
        for (var i = 0; i < N; i++){
            var goalStationID;
            var currentStationID;
            minTime = T + 100;
            for(var j = 0; j < groupInfo[goalGroupID].length; j++){
                var stationID_tmp = groupInfo[goalGroupID][j][0];
                if(minTime > time[i][stationID_tmp]){
                    minTime = time[i][stationID_tmp];
                    goalStationID = stationID_tmp;
                }
            }
            if(i == 0){
                goalStationName = stationInfo[goalStationID].stationName;
                //goalStationNameID.push(goalStationName + goalStationID);
                goalStationNameID.push(goalStationName + goalGroupID);
                //console.log(goalStationNameID)
            }
            currentStationID = goalStationID;

            //console.log(time[i][goalStationID]);
            while (1){
                //console.log(stationInfo[currentStationID]);
                if (previousStation[i][currentStationID][1] == -1){
                    break;
                }
                var previousStationID = previousStation[i][currentStationID][1];
                var currentStationTime = time[i][currentStationID];
                queue4trace.enqueue(-currentStationTime, [previousStationID, currentStationID]);
                currentStationID = previousStationID;
            }
        }
        while (queue4trace.size() > 0){
            //stationQueue4meetup.push(queue4trace.dequeue());
            stationQueue.push(queue4trace.dequeue());
            //console.log(stationQueue);
        }
    }
}
async function meet_up_within_T_min(startGroupID_set, T, stationQueue, goalStationNameID){
    var N = startGroupID_set.size;
    var Adj_list = {};
    var groupInfo = {};
    var numOfVisitors = {};
    var stationInfo = {};

    //以下の変数は人数分準備
    var time = Array(N);
    var previousStation = Array(N);
    var visited_group_flag = Array(N);    //訪問済みならtrue 未訪問はfalse groupID
    var startGroupID = Array(N);
    var tracedFlag = Array(N);

    for(var i = 0; i < N; i++){
        time[i] = {};
        previousStation[i] = {};
        visited_group_flag[i] = {};
        tracedFlag[i] = {};
    }
    var counter = 0
    for (var value of startGroupID_set) {
        startGroupID[counter] = value;
        counter++;
    }

    var queue = new pairing_heap();

    var ARAKAWASEN = 0.8;
    var changeTrains_time = 5;
    var stopTime = 0.75;
    var hubStationThreshold = 6;
    
    //実際の処理
   await Make_Adj_List_meetup();
   await dijkstra_meetup();
   return true

    function Make_Adj_List_meetup(){
        return new Promise(resolve =>{
            var groupInfo_flag = {};

            d3.csv("join.csv").then(function(data){
                data.forEach(function(d){
                    var time_tmp
                    //時間を設定
                    if (d.time == 0){
                        time_tmp = parseFloat(ARAKAWASEN) + parseFloat(stopTime);  //d.time=0のときの例外処理
                    }else{
                        time_tmp = parseFloat(d.time) + parseFloat(stopTime);
                    }
                    //groupInfoを追加
                    if (groupInfo[d.fromGroupID] == undefined){
                        groupInfo[d.fromGroupID] = [[d.fromID, d.fromName, d.routeID, d.routeName]];
                        groupInfo_flag[d.fromGroupID] = [d.fromID];
                        numOfVisitors[d.fromGroupID] = parseInt(0);
                        for(var i = 0; i < N; i++){
                            visited_group_flag[i][d.fromGroupID] = false;
                        }
                    }else if(groupInfo_flag[d.fromGroupID].indexOf(d.fromID) == -1){
                        groupInfo[d.fromGroupID].push([d.fromID, d.fromName, d.routeID, d.routeName]);
                        groupInfo_flag[d.fromGroupID].push(d.fromID);
                    }
                    if (groupInfo[d.toGroupID] == undefined){
                        groupInfo[d.toGroupID] = [[d.toID, d.toName, d.routeID, d.routeName]];
                        groupInfo_flag[d.toGroupID] = [d.toID];
                        numOfVisitors[d.toGroupID] = parseInt(0);
                        for(var i = 0; i < N; i++){
                            visited_group_flag[i][d.toGroupID] = false;
                        }
                    }else if(groupInfo_flag[d.toGroupID].indexOf(d.toID) == -1){
                        groupInfo[d.toGroupID].push([d.toID, d.toName, d.routeID, d.routeName]);
                        groupInfo_flag[d.toGroupID].push(d.toID);
                    }
                    //隣接リストに追加
                    if (Adj_list[d.fromID] == undefined){
                        Adj_list[d.fromID] = [[d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, time_tmp]];
                        stationInfo[d.fromID] = {GroupID: d.fromGroupID, stationName: d.fromName, routeID: d.routeID, routeName: d.routeName};
                        for (var i = 0; i < N; i++){
                            time[i][d.fromID] = T + 100;
                            //previousStation[i][d.fromID] = [];
                        }
                        for (var i = 0; i < groupInfo[d.fromGroupID].length; i++){
                            if(groupInfo[d.fromGroupID][i][0] != d.fromID){
                                var StID_tmp = groupInfo[d.fromGroupID][i][0];
                                var StName_tmp = groupInfo[d.fromGroupID][i][1];
                                var RouteID_tmp = groupInfo[d.fromGroupID][i][2];
                                var RouteName_tmp = groupInfo[d.fromGroupID][i][3];
                                Adj_list[d.fromID].push([d.fromGroupID, StID_tmp, StName_tmp, RouteID_tmp, RouteName_tmp, changeTrains_time]);
                                Adj_list[StID_tmp].push([d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, changeTrains_time]);
                            }
                        }
                    }
                    else{
                        Adj_list[d.fromID].push([d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, time_tmp]);

                    }
                    if (Adj_list[d.toID] == undefined){
                        Adj_list[d.toID] = [[d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, time_tmp]];
                        stationInfo[d.toID] = {GroupID: d.toGroupID, stationName: d.toName, routeID: d.routeID, routeName: d.routeName};
                        for (var i = 0; i < N; i++){
                            time[i][d.toID] = T + 100;
                            //previousStation[i][d.toID] = [];
                        }
                        //同一グループ内の駅とつなげる
                        for (var i = 0; i < groupInfo[d.toGroupID].length; i++){
                            if(groupInfo[d.toGroupID][i][0] != d.toID){
                                var StID_tmp = groupInfo[d.toGroupID][i][0];
                                var StName_tmp = groupInfo[d.toGroupID][i][1];
                                var RouteID_tmp = groupInfo[d.toGroupID][i][2];
                                var RouteName_tmp = groupInfo[d.toGroupID][i][3];
                                Adj_list[d.toID].push([d.toGroupID, StID_tmp, StName_tmp, RouteID_tmp, RouteName_tmp, changeTrains_time]);
                                Adj_list[StID_tmp].push([d.toGroupID, d.toID, d.toName, d.routeID, d.routeName, changeTrains_time]);
                            }
                        }
                    }
                    else{
                        Adj_list[d.toID].push([d.fromGroupID, d.fromID, d.fromName, d.routeID, d.routeName, time_tmp]);
                    } 
                });
                return 1;
            }).then(() => {resolve(true); });
        });
    }
    function dijkstra_meetup(){
        return new Promise(resolve =>{
        //返り値は集合地点の　駅名+駅ID
            for(var i = 0; i < N; i++){
                for(var j = 0; j < groupInfo[startGroupID[i]].length; j++){
                    var startStationID = groupInfo[startGroupID[i]][j][0];
                    time[i][startStationID] = 0;
                    previousStation[i][startStationID] = [startGroupID, -1, "start:" + i, "start:" + i];
                    queue.enqueue(-time[i][startStationID], [i, startStationID]);
                }
                //console.log("スタート地点", groupInfo[startGroupID[i]]);
            }
            while(queue.size() != 0){
                var dequeued_item = queue.dequeue();
                var i = dequeued_item[0]; //i is personal_id
                var currentStationID = dequeued_item[1];
                var currentStationName = stationInfo[currentStationID].stationName;
                var currentGroupID = stationInfo[currentStationID].GroupID;
                var currentStationRouteName = stationInfo[currentStationID].routeName;

                if (visited_group_flag[i][currentGroupID] == false){
                    //iさんが未訪問なら訪問したことを記録し
                    //訪問人数を +1
                    visited_group_flag[i][currentGroupID] = true;
                    numOfVisitors[currentGroupID] += parseInt(1);
                    if (numOfVisitors[currentGroupID] == N){
                        //全員集合してたら
                        //console.log("集合場所", groupInfo[currentGroupID]);
                        traceBack(currentGroupID);
                    }
                }
                for(var j = 0; j < Adj_list[currentStationID].length; j++){
                    var nextStationID = Adj_list[currentStationID][j][1];
                    var dt = parseFloat(Adj_list[currentStationID][j][5]);
                    var current_node_time = parseFloat(time[i][currentStationID]);
                    var next_node_time = parseFloat(time[i][nextStationID]);

                    if( (next_node_time > current_node_time + dt) && (current_node_time + dt < T)){
                        time[i][nextStationID] = current_node_time + dt;
                        previousStation[i][nextStationID] = [currentGroupID, currentStationID, currentStationName, currentStationRouteName];
                        queue.enqueue(-time[i][nextStationID], [i, nextStationID]);
                    }
                }
            }
            resolve(true);
        });
    }
    function traceBack(goalGroupID){
        var queue4trace = new pairing_heap();
        for (var i = 0; i < N; i++){
            var goalStationID;
            var currentStationID;
            minTime = T + 100;
            for(var j = 0; j < groupInfo[goalGroupID].length; j++){
                var stationID_tmp = groupInfo[goalGroupID][j][0];
                if(minTime > time[i][stationID_tmp]){
                    minTime = time[i][stationID_tmp];
                    goalStationID = stationID_tmp;
                }
            }
            if(i == 0){
                goalStationName = stationInfo[goalStationID].stationName;
                goalStationNameID.push(goalStationName + goalGroupID);
                //console.log(goalStationNameID)
            }
            currentStationID = goalStationID;

            //console.log(time[i][goalStationID]);
            while (1){
                //console.log(stationInfo[currentStationID]);
                if (previousStation[i][currentStationID][1] == -1 || tracedFlag[i][currentStationID] == true){
                    break;
                }
                tracedFlag[i][currentStationID] = true;
                var previousStationID = previousStation[i][currentStationID][1];
                var currentStationTime = time[i][currentStationID];
                queue4trace.enqueue(-currentStationTime, [previousStationID, currentStationID]);
                currentStationID = previousStationID;
            }
        }
        while (queue4trace.size() > 0){
            //stationQueue4meetup.push(queue4trace.dequeue());
            stationQueue.push(queue4trace.dequeue());
            //console.log(stationQueue);
        }
    }    
}
// https://qiita.com/330k/items/daa144d82b000c72f774
function pairing_heap(){
    "use strict";
    var _root = null;
    var _size = 0;
    var _merge = function (i, j){
        var ret = null;

        if(i === null) return j;
        if(j === null) return i;

        if(i.p < j.p){
            ret = i;
            i = j;
            j = ret;
        }
        j.next = i.head;
        i.head = j;

        return i;
    };
    var _mergeList = function (s){
        var n = null;
        var a = null;
        var b = null;
        var j = null;

        while(s !== null){
            a = s;
            b = null;
            s = s.next;
            a.next = null;
            if(s !== null){
                b = s;
                s = s.next;
                b.next = null;
            }
            a = _merge(a, b);
            a.next = n;
            n = a;
        }
        while(n !== null){
            j = n;
            n = n.next;
            s = _merge(j, s);
        }
        return s;
    };

    var enqueue = function(priority, value){
        _root = _merge(_root, {
            p: priority,
            v: value,
            next: null,
            head: null
        });
        _size = _size + 1;
    };
    var dequeue = function(){
        var result = null;

        if(_size){
            result = _root.v;
            _root = _mergeList(_root.head);
            _size = _size - 1;

            return result;
        }else{
            return (void 0);
        }
    };
    var top = function(){
        return _root.v;
    };
    var size = function(){
        return _size;
    };

    return {
        name: 'Pairing Heap',
        enqueue: enqueue,
        dequeue: dequeue,
        top: top,
        size: size
    };
}
