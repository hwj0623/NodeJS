//Flot Line Chart
$(document).ready(function() {
    // $.ajax({
    //   url : './process/info1',
    //   dataType:'jsonp',
    //   jsonp: 'jsonp',
    //   method:'GET',
    //   success:function(data){
    //     console.log("success get data : " ,data);
    //   }
    // });
    // var offset = 0;
    // plot();
    //
    // function plot() {
    //     var sin = [],
    //         cos = [];
    //     for (var i = 0; i < 12; i += 0.2) {
    //         sin.push([i, Math.sin(i + offset)]);
    //         cos.push([i, Math.cos(i + offset)]);
    //     }
    //
    //     var options = {
    //         series: {
    //             lines: {
    //                 show: true
    //             },
    //             points: {
    //                 show: true
    //             }
    //         },
    //         grid: {
    //             hoverable: true //IMPORTANT! this is needed for tooltip to work
    //         },
    //         yaxis: {
    //             min: -1.2,
    //             max: 1.2
    //         },
    //         tooltip: true,
    //         tooltipOpts: {
    //             content: "'%s' of %x.1 is %y.4",
    //             shifts: {
    //                 x: -60,
    //                 y: 25
    //             }
    //         }
    //     };
    //
    //     var plotObj = $.plot($("#flot-line-chart"), [{
    //             data: sin,
    //             label: "sin(x)"
    //         }, {
    //             data: cos,
    //             label: "cos(x)"
    //         }],
    //         options);
    // }
});

//Flot Pie Chart
// $(function() {
//
//     var data = [{
//         label: "Series 0",
//         data: 1
//     }, {
//         label: "Series 1",
//         data: 3
//     }, {
//         label: "Series 2",
//         data: 9
//     }, {
//         label: "Series 3",
//         data: 20
//     }];
//
//     var plotObj = $.plot($("#flot-pie-chart"), data, {
//         series: {
//             pie: {
//                 show: true
//             }
//         },
//         grid: {
//             hoverable: true
//         },
//         tooltip: true,
//         tooltipOpts: {
//             content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
//             shifts: {
//                 x: 20,
//                 y: 0
//             },
//             defaultTheme: false
//         }
//     });
//
// });

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

      }//end of for loop
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
    // $("button").click(function() {
    //     doPlot($(this).text());
    // });
    // setInterval(function updateRandom() {
    //     promise.then(renderingPlot).then(doPlot);
    //     plot.setupGrid();
    //     plot.draw();
    //     console.log( new Date().getTime());
    // }, 6000);
});

//Min/Max Temperature, Humidity
$(function() {


});


// Flot Moving Line Chart
$(function() {
    var temp = [];
    var humid = [];
    var idx=0;
    var container = $("#flot-line-chart-moving");
    var tempData = [];
    var humidData = [];

    var currentHumid = "";
    // Determine how many data points to keep based on the placeholder's initial size;
    // this gives us a nice high-res plot while avoiding more than one point per pixel.

    var maximum = 20;//container.outerWidth() / 2 || 300;

    var data = [];
    function getData(){
      $.ajax({
        url : './process/info1',
        type: 'GET',
        success : function(res){
          console.log("res.data : ", res.data[0]);
          // for(var i=0; i<res.data.length; i++){
            temp.push([res.data[0].date, res.data[0].temperature]);
            humid.push([res.data[0].date, res.data[0].humidity]);
            currentHumid = res.data[0].humidity;
             $('.current-humidity').text(currentHumid);
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
        var tempRes = [];
        var humidRes = [];
        getData();
        if(temp.length > max){
          temp.slice(1);
        }
        if(humid.length > max){
          humid.slice(1);
        }

        if(tempRes.length >= max){
          tempRes = tempRes.slice(1);
        }
        if(idx>temp.length){
          idx = 0;
        }
        // console.log("date : ", temp[i][0], " temp : ", temp[i][1]);
        // tempData.push(temp[idx++]);


        for (var i = 0; i < temp.length; ++i) {
            // res.push([i, data[i]])
            // console.log("temp[i][0] as date : ",temp[i][0]);
            // console.log("temp[i][1] as temperature : ",temp[i][1]);
            tempRes.push([temp[i][0],temp[i][1]]);
        }
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
