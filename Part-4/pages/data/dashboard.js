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

// ====== Human cnt ======
$(function() {
  function updateCnt(){
    var inCount = null;
    var outCount = null;
    var curCount = null;
    //Promise object
    var promise =  new Promise(function (resolve, reject){
          $.ajax({
            url : './process/gate/stat/1',
            type : 'GET',
            success : function(res){
              resolve(res);
            }
          });
        });
    //Function that returns Promise
    function outCountFunc(){
      return new Promise(function (resolve, reject){
          $.ajax({
            url : './process/gate/stat/2',
            type : 'GET',
            success : function(response){
              resolve(response);
            }
          });
        });
      };
    promise = promise
        .then(function(res){
        console.log("Human In cnt ==== : ", res);
        inCount = res.data;
        console.log("inCount :  ", inCount);
    }).then(outCountFunc).then(function(response){
      console.log("Human Out cnt ==== : ", response);
      console.log("response" , response);
      outCount = response.data;
      console.log("outCount :  ", outCount);
    }).then(function(){
      curCount = inCount - outCount;
      if(curCount < 0){
        curCount = 0;
      }
    $('.current-human-cnt').text(curCount);
    });
  };
  updateCnt();
  setInterval(updateCnt, 3000);

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

    var maximum = 10;//container.outerWidth() / 2 || 300;

    var data = [];
    function getData(){
      $.ajax({
        url : './process/info1',
        type: 'GET',
        success : function(res){
            temp.push([res.data[0].date, res.data[0].temperature]);
            humid.push([res.data[0].date, res.data[0].humidity]);

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
        var max = 10;

        getData();

        if(tempRes.length >= max){
          tempRes = tempRes.slice(1);
        }
        if(temp.length >=max){
          temp = temp.slice(1);
        }
        if(humid.length>=max){
          humid = humid.slice(1);
        }
        if(idx>temp.length){
          idx = 0;
        }

        if(temp.length>=1){
          tempRes.push([temp[temp.length-1][0],temp[temp.length-1][1]]);
        }
        // console.log("==== temp, humid 길이 ==== ");
        // console.log(temp.length+", "+humid.length);
        if(temp.length > max){
          // console.log("temp slice 1");
          // console.log(temp);
          temp.slice(1,21);
        }
        if(humid.length > max){
          // console.log("humid slice 1");
          humid.slice(1,21);
        }
        // console.log("tempRes : ", tempRes);
        return tempRes;
    }


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
