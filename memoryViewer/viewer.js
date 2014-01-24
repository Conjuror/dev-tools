// Let"s create a new socket and assign it to a local variable.
var socket = new io.Socket();
var socket = io.connect("http://localhost");
socket.on("updateProcRank", function(data) {
  for (var i = 0 ; i < data.length ; i++) {
    if ($("#"+data[i].app).length > 0) {
      $("#"+data[i].app+" td:eq(1)").html(data[i].pid);
      $("#"+data[i].app+" td:eq(2)").html(data[i].vss);
      $("#"+data[i].app+" td:eq(3)").html(data[i].rss);
      $("#"+data[i].app+" td:eq(4)").html(data[i].pss);
      $("#"+data[i].app+" td:eq(5)").html(data[i].uss);
    }
    else {
      console.log("new item" + data[i].app);
      $("#rtTable > tbody:last").append("<tr id='"+data[i].app+"'><td>"+data[i].app+"</td><td>"+data[i].pid+"</td><td>"+data[i].vss+"</td><td>"+data[i].rss+"</td><td>"+data[i].pss+"</td><td>"+data[i].uss+"</td><td>"+data[i].cmdline+"</td><tr>");
    }
  }
  // console.log(data);
});
