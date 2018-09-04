//Flot Line Chart
$(document).ready(function() {
    var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


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
    });

    var weatherApiUrl='http://dataservice.accuweather.com/currentconditions/v1/223642?apikey=qvD1thdR0e3EjkElFEDd1eCq4b1bo3G0&language=ko&details=false';
    //'http://apidev.accuweather.com/currentconditions/v1/223642.json?language=ko&apikey=hoArfRosT1215';
    var forecastApiUrl='http://dataservice.accuweather.com/forecasts/v1/daily/5day/223642?apikey=qvD1thdR0e3EjkElFEDd1eCq4b1bo3G0&language=ko&details=true&metric=true';
    //accuweather 현재 날씨 정보
    $.ajax({
      url : weatherApiUrl,
      type:'GET',
      success : function (data){
        // console.log("현재 날씨정보 ", data);
        // $('.weather-now > h3').text('측정 시간 : '+new Date(data[0].EpochTime));
        // $('.weather-now > week-day-temperature .stat1').text('현재 날씨 : '+data[0].WeatherText);
        // $('.weather-now > week-day-temperature .stat2').text('현재 온도 : '+data[0].Temperature.Metric.Value+'°C');
        // $('.weather-now > week-day-temperature .stat3').text('현재 습도 : '+data[0].RelativeHumidity+'%');
        // $('.weather-now > week-day-temperature .stat4').text('풍향 : '+data[0].Wind.Speed.Metric.Value+data[0].Wind.Speed.Metric.Unit);
      }
    });
    //accuweather 5days 날씨 예보
    $.ajax({
      url : forecastApiUrl,
      type:'GET',
      success:function(data){
        console.log("날씨예보 5days ", data);
        for(var i=0; i<data.DailyForecasts.length; i++){
          console.log(i+" 번째" ,data.DailyForecasts[i]);
          var weatherIcon = data.DailyForecasts[i].Day.Icon;
          console.log("weatherIcon : ", weatherIcon);
          // var days = data.
          if(weatherIcon < 3  ){
            $('.day-'+i+'').addClass("sun");
            $('.day-'+i+' .climacon').addClass("sun");
          }else if(weatherIcon < 6){
            $('.day-'+i+'').addClass('cloud').addClass("sun");
            $('.day-'+i+' .climacon').addClass("cloud").addClass("sun");
          }else if(weatherIcon < 11){
            $('.day-'+i+'').addClass('cloud');
            $('.day-'+i+' .climacon').addClass("cloud");
          }else if(weatherIcon < 18){
            $('.day-'+i+'').addClass("rain").addClass("sun");
            $('.day-'+i+' .climacon').addClass("rain").addClass("sun");
          }else if(weatherIcon == 18){
            $('.day-'+i+'').addClass('rain');
            $('.day-'+i+' .climacon').addClass('rain');
          }

          $('.day-'+i+' .week-day').text(week[new Date(data.DailyForecasts[i].Date).getDay()]);
          $('.day-'+i+' .week-day-temperature.max').text(data.DailyForecasts[i].Temperature.Maximum.Value+"°C");
          $('.day-'+i+' .week-day-temperature.min').text(data.DailyForecasts[i].Temperature.Minimum.Value+"°C");

        }
      }
    });
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
                tickDecimals : 1,
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
  setInterval(getCumulatedData, 5000);

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
  setInterval(updateCnt, 5000);

});
