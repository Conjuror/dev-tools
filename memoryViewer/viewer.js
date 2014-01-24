// Let"s create a new socket and assign it to a local variable.
var socket = new io.Socket();
var socket = io.connect("http://localhost");
var peakSet = {};

$(function(){
  $("#clean_btn").click(function(){
    console.log("clean");
    $("#peakTable > tbody").html("");
    peakSet = {};
  });
});

socket.on("updateProcRank", function(data) {

  // clean table and redraw info
  $("#rtTable > tbody").html("");
  for (var h = 0 ; h < data.length ; h ++) {
    $("#rtTable > tbody:last").append("<tr><td>"+data[h].app+"</td><td>"+data[h].pid+"</td><td>"+data[h].vss+"</td><td>"+data[h].rss+"</td><td>"+data[h].pss+"</td><td>"+data[h].uss+"</td><td>"+data[h].cmdline+"</td><tr>");
  }
  
  // check peak value
  for (var i = 0 ; i < data.length ; i++) {
    if (peakSet.hasOwnProperty(data[i].app)) {
      if (data[i].vss > peakSet[data[i].app].vss) {
        $("#"+data[i].app+" td:eq(1)").html(data[i].vss);
        peakSet[data[i].app].vss = data[i].vss;
      }
      if (data[i].rss > peakSet[data[i].app].rss) {
        $("#"+data[i].app+" td:eq(2)").html(data[i].rss);
        peakSet[data[i].app].rss = data[i].rss;
      }
      if (data[i].pss > peakSet[data[i].app].pss) {
        $("#"+data[i].app+" td:eq(3)").html(data[i].pss);
        peakSet[data[i].app].pss = data[i].pss;
      }
      if (data[i].uss > peakSet[data[i].app].uss) {
        $("#"+data[i].app+" td:eq(4)").html(data[i].uss);
        peakSet[data[i].app].uss = data[i].uss;
      }
    }
    else {
      console.log("new item" + data[i].app);
      $("#peakTable > tbody:last").append("<tr id='"+data[i].app+"'><td>"+data[i].app+"</td><td>"+data[i].vss+"</td><td>"+data[i].rss+"</td><td>"+data[i].pss+"</td><td>"+data[i].uss+"</td><td>"+data[i].cmdline+"</td><tr>");
      peakSet[data[i].app] = {};
      peakSet[data[i].app]['vss'] = data[i].vss;
      peakSet[data[i].app]['rss'] = data[i].rss;
      peakSet[data[i].app]['pss'] = data[i].pss;
      peakSet[data[i].app]['uss'] = data[i].uss;
    }
  }
  // console.log(data);
});
