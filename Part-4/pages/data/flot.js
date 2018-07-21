//Flot Line Chart
$(document).ready(function() {

});


//Flot Multiple Axes Line Chart
$(function() {
    $.ajax ({
      url : './process/info/stat',
      type : 'GET',
      success : function(data){
        console.log("Min/Max data : ", data);
        $('.max-temperature').text(data[0]["max"][0].maxTemperature);
        $('.min-temperature').text(data[1]["min"][0].minTemperature);
      }
    });

    //
    // var oddHtml =   '<tr class="odd gradeX">'
    //                 +'<td> "2018-06-25 20:33:44"</td>'
    //                 +'<td>1</td></tr>';
    // var evenHtml = '<tr class="even gradeC">'
    //                 +'<td> "2018-06-25 20:33:44"</td>'
    //                 +'<td>1</td></tr>';

    var allTemp = [];
    var allHumid = [];
    var promise = $.ajax({
                    url : './process/info',
                    type : 'GET'
                  });
    var renderingPlot = function (res){
      console.log("response : " , res);
      for(var i=0; i<res.data.length; i++){
        allTemp.push([res.data[i].date, res.data[i].temperature]);
        allHumid.push([res.data[i].date, res.data[i].humidity]);
        if(i%2 ==0){
          $('.temp-table-body').append(
                  '<tr class="odd gradeX">'
                  +'<td>'+res.data[i].originalDate+'</td>'
                  +'<td>'+res.data[i].temperature+'</td></tr>'
                );
        }else{
          $('.temp-table-body').append(
            '<tr class="even gradeC">'
            +'<td>'+res.data[i].originalDate+'</td>'
            +'<td>'+res.data[i].temperature+'</td></tr>'
          );
        }
      }//end of for loop

      $('#dataTables-example').DataTable({
          responsive: true
      });
      return "right";
    }

    promise.then(renderingPlot).then(doPlot);

    function celciusFormatter(v, axis) {
        return v.toFixed(axis.tickDecimals) + "°C";
    }
    function humidFormatter(v, axis) {
        return v.toFixed(axis.tickDecimals) + "%";
    }

    function doPlot(position) {
        $.plot($("#flot-line-chart-multi"), [{
            data: allTemp,
            label: "온도 분석 (°C)"
        }, {
            data: allHumid,
            label: "습도 분석 (%)",
            yaxis: 2
        }], {
            xaxes: [{
                mode: 'time',
                timeformat : "%H:%M%:%S",
                minTickSize : [5, "second"]
            }],
            yaxes: [{
                min: 0,
                tickDecimals : 2,
                tickFormatter: celciusFormatter
            }, {
                // align if we are to the right
                alignTicksWithAxis: position == "right" ? 1 : null,
                position: position,
                tickFormatter: humidFormatter
            }],
            legend: {
                position: 'sw'
            },
            grid: {
                hoverable: true //IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s for %x was %y °C",
                xDateFormat: "%H:%M%:%S",
                onHover: function(flotItem, $tooltipEl) {
                }
            }
        }); //end of doPlot
    }
});


// Flot Moving Line Chart
$(function() {
    var temp = [];
    var humid = [];
    var idx=0;
    var container = $("#flot-line-chart-moving");
    // var tempData = [];
    // var humidData = [];
    var tempRes = [];
    var humidRes = [];

    var maximum = 20;//container.outerWidth() / 2 || 300;

    var data = [];
    function getData(){
      $.ajax({
        url : './process/info1',
        type: 'GET',
        success : function(res){
          console.log("res.data : ", res.data[0]);

            temp.push([res.data[0].date, res.data[0].temperature]);
            humid.push([res.data[0].date, res.data[0].humidity]);
            if(temp.length > maximum){
              temp.slice(1);
            }
            if(humid.length > maximum){
              humid.slice(1);
            }
               $('.current-humidity').text(res.data[0].humidity);
               var curMaxTemp = Number($('.max-temperature').text());
               var curMinTemp = Number($('.min-temperature').text());
               if ( curMaxTemp < res.data[0].temperature){
                      curMaxTemp = res.data[0].temperature;
                      $('.max-temperature').text(curMaxTemp);
               }
               if ( curMinTemp > res.data[0].temperature){
                      curMinTemp = res.data[0].temperature;
                      $('.min-temperature').text(curMinTemp);
               }

        }
      })
    };

    function getRandomData() {
        var max = 20;

        getData();

        if(tempRes.length >= max){
          tempRes = tempRes.slice(1);
        }
        if(temp.length > max){
          temp = temp.slice(1);
        }
        if(humid.length > max){
          humid = humid.slice(1);
        }

        if(idx>temp.length){
          idx = 0;
        }


        // for (var i = 0; i < temp.length; ++i) {
            // console.log("temp[i][0] as date : ",temp[temp.length-1][0]);
            // console.log("temp[i][1] as temperature : ",temp[temp.length-1][1]);
            if(temp.length>1)
              tempRes.push([temp[temp.length-1][0],temp[temp.length-1][1]]);
        // }
        console.log("==== temp, humid 길이 ==== ");
        console.log(temp.length+", "+humid.length);
        console.log("tempRes : ", tempRes);
        return tempRes;
    }

    //

    series = [{
        data: getRandomData(),
        lines: {
            fill: true,
            show: true
        }
    }];

    //

    var plot = $.plot(container, series, {
        grid: {
            // borderWidth: 1,
            // minBorderMargin: 20,
            // labelMargin: 10,
            backgroundColor: {
                colors: ["#eee", "#e4f4f4"]
            },
            margin: {
                top: 8,
                bottom: 20,
                left: 20
            },
            //상세보기 추가내역
            hoverable: true, //IMPORTANT! this is needed for tooltip to work
            tooltip: true,
            tooltipOpts: {
                content: "%s Time : %x , temperature : %y°C",
                xDateFormat: "%H:%M:%S",
                onHover: function(flotItem, $tooltipEl) {
                }
            },
            markings: function(axes) {
                var markings = [];
                var xaxis = axes.xaxis;
                for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
                    markings.push({
                        xaxis: {
                            from: x,
                            to: x + xaxis.tickSize
                        },
                        color: "rgba(232, 232, 255, 0.2)"
                    });
                }
                return markings;
            }
        },
        xaxis: {
            mode: 'time',
            timeformat : "%H:%M:%S",
            minTickSize : [5, "second"]
        },
        yaxis: {
            min: -20,
            max: 45
        },
        legend: {
            show: true
        },
        "points": {"show":"true"},
        hoverable :true,
        tooltip: true,
        tooltipOpts: {
            content: "%s Time : %x , temperature : %y°C",
            xDateFormat: "%H:%M:%S",
            onHover: function(flotItem, $tooltipEl) {
            }
        }
    });

    // Update the random dataset at 25FPS for a smoothly-animating chart

    setInterval(function updateRandom() {
        series[0].data = getRandomData();
        plot.setData(series);
        plot.setupGrid();
        plot.draw();
        // console.log( new Date("2018-06-27 19:02:08").getTime());
    }, 1000);
});

//Flot Bar Chart
// $(function() {
//
//     var barOptions = {
//         series: {
//             bars: {
//                 show: true,
//                 barWidth: 43200000
//             }
//         },
//         xaxis: {
//             mode: "time",
//             timeformat: "%m/%d",
//             minTickSize: [1, "day"]
//         },
//         grid: {
//             hoverable: true
//         },
//         legend: {
//             show: false
//         },
//         tooltip: true,
//         tooltipOpts: {
//             content: "x: %x, y: %y"
//         }
//     };
//     var barData = {
//         label: "bar",
//         data: [
//             [1354521600000, 1000],
//             [1355040000000, 2000],
//             [1355223600000, 3000],
//             [1355306400000, 4000],
//             [1355487300000, 5000],
//             [1355571900000, 6000]
//         ]
//     };
//     $.plot($("#flot-bar-chart"), [barData], barOptions);
//
// });
