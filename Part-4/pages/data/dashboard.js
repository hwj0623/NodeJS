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
    $('.checkbox').on('click', function(e){
      e.stopPropagation();
      // alert("clicked");
      console.log(e.currentTarget.checked);
      if(e.currentTarget.checked){ //checked === true
        $.ajax({
          url:'./process/iot/controller/1',
          type: 'PUT',
          success : function(data){
            console.log("success");
          }
        })
      }else{ //checked === false
        $.ajax({
          url:'./process/iot/controller/0',
          type: 'PUT',
          success : function(data){
            console.log("success");
          }
        })
      }
    })
});

//Flot Multiple Axes Line Chart
$(function() {
  var tmpMax = 0;
  var tmpMin = 100;
  $('.max-temperature').text(tmpMax);
  $('.min-temperature').text(tmpMin);

  function getCumulatedData(){
    $.ajax ({
      url : './process/info/stat',
      type : 'GET',
      success : function(data){
        // console.log("Min/Max data : ", data);

        //녹화용 코드
        // console.log("초기 최고온도 : ", $('.max-temperature').text());
        // console.log("초기 최저온도 : ", $('.min-temperature').text());
        // console.log("현재 비교 최고온도 : ", data[0]["max"][0].maxTemperature);
        // console.log("현재 비교 최저온도 : ", data[1]["min"][0].minTemperature);

        // console.log("비교시작 ");
        if(tmpMax < data[0]["max"][0].maxTemperature){
          tmpMax = data[0]["max"][0].maxTemperature;
          // console.log()
          $('.max-temperature').text(tmpMax);
        }
        if(tmpMin > data[1]["min"][0].minTemperature){
          tmpMin = data[1]["min"][0].minTemperature;
          $('.min-temperature').text(tmpMin);
        }

        // 원래 코드
        // $('.max-temperature').text(data[0]["max"][0].maxTemperature);
        // $('.min-temperature').text(data[1]["min"][0].minTemperature);
      }
    });

    var allTemp = [];
    var allHumid = [];
    var promise = $.ajax({
                    url : './process/info',
                    type : 'GET'
                  });
    var renderingPlot = function (res){
      // console.log("response : " , res);
      for(var i=0; i<res.data.length; i++){
        allTemp.push([res.data[i].date, res.data[i].temperature]);
        allHumid.push([res.data[i].date, res.data[i].humidity]);

      }//end of for loop
      $('.current-humidity').text(res.data[res.data.length-1].humidity);
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
                tickDecimals : 3,
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
                borderWidth: 3,
                backgroundColor: { colors: [ "#fff", "#eee" ] },
                hoverable: true //IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s for %x was %y ",
                xDateFormat: "%H:%M%:%S",
                onHover: function(flotItem, $tooltipEl) {
                }
            },
            colors: ["#EE0000", "#0022FF"],
            borderWidth: 10,
            lines:{
              lineWidth: 4
            }
        }); //end of doPlot
    }
  }
  getCumulatedData();
  setInterval(getCumulatedData, 2000);

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
        // console.log("Human In cnt ==== : ", res);
        inCount = res.data;
        // console.log("inCount :  ", inCount);
    }).then(outCountFunc).then(function(response){
      // console.log("Human Out cnt ==== : ", response);
      // console.log("response" , response);
      outCount = response.data;
      // console.log("outCount :  ", outCount);
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
