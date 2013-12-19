/*
 * This is the finance graph which has my assets, debt and net incomes
 * @since 1.0
 */

define(['jquery', 'underscore', 'jqueryui', 'highcharts', 'jqueryui'], function($,_) {
    
    var UserActivityGraph = function(container, opts) 
    {
        this.container = $(container);
        this.options = $.extend(true, this.defaultOptions, opts);
        this.renderWithData(this.options.data);
    }
            
    UserActivityGraph.prototype.renderWithData = function(data)
    {
        this.data = data;

        if(this.data.length == 0) {
            return this.renderNoData();
        }
        this.fillSeries();
        this.fillData();
        
/*
        this.fillData(data.assets, 0);
        this.fillData(data.debt, 1);
        this.fillData(data.net, 2);
*/
        this.render();
    }
    
    UserActivityGraph.prototype.renderNoData = function() {
        this.container.html('<h1>No Data Just Yet, look back soon</h1>');
    }
    
    UserActivityGraph.prototype.fillSeries = function()
    {
        this.series = {};
        var row = _.first(this.data);

        var series = {
            name:"",
            data:[],
            marker: {
               enabled: false
            },
            type: 'spline',
            color:"black",
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 4
                }
            }
        }

        var i =0;
        
        for(var key in row) {
            if(_.indexOf(['_id', 'userid'], key) != -1)
                continue;
            this.series[key] = $.extend(true, {}, series, {
                name:this.getNameForKey(key), 
                color:this.getColor(i), 
                yAxis:(key=='steps'||key=='marginalCalories')?0:1,
                visible:(key=='steps'||key=='marginalCalories')
            });
            i++;
        }
    }
    
    UserActivityGraph.prototype.fillData = function()
    {
        this.dates = [];
        for(var index in this.data)
        {
            var row = this.data[index];
            for(var key in row) {
                if(typeof this.series[key] !== 'undefined') {
                    if(key == 'date') {
                        this.dates.unshift(new Date(row[key]));
                        this.series[key].data.unshift(new Date(row[key]));
                    } else {
                        this.series[key].data.unshift(row[key]);
                    }
                }
            }
        }
    }
    
    UserActivityGraph.prototype.render = function()
    {
        this.series['date'].showInLegend = false;
        this.orderedSeries = [this.series['date']];
        for(var key in this.series) {
            if(key != 'date')
                this.orderedSeries.push(this.series[key]);
        }

        var that = this;
  		this.container.highcharts({
			chart: {
				zoomType: 'xy',
				height: 260,
				backgroundColor:'rgba(255,255,255,0)',
				borderWidth: 0,
				borderRadius: 4,
				borderColor:'#CCCCCC',
				plotBackgroundColor: 'rgba(255, 255, 255, 1)',
				plotBorderWidth: 1				
			},
			title: {
					text: '',
			},
			xAxis: {
					type: 'datetime',
					labels: {
					formatter: function() {

						if (typeof that.dates[this.value] !== 'undefined') {
							return Highcharts.dateFormat('%b %e', that.dates[this.value]);
						} else if (typeof that.dates[this.value+1] !== 'undefined') {
							return Highcharts.dateFormat('%b %e', that.dates[this.value+1]);
						} else if (typeof that.dates[this.value-1] !== 'undefined') {
							return Highcharts.dateFormat('%b %e', that.dates[this.value-1]);
						}
	  				}
				},
				title: {
					text: ''
				}
			},
			yAxis: [
				{ // Primary yAxis
					title: '',
					labels: {
						style: {
							color: this.getColor(0, 0),
							fontWeight: 'bold'
						}
					},
				}, { // Secondary yAxis
					gridLineWidth: 1,
					title: 'Minutes',
					labels: {
						style: {
							color: this.getColor(0,1),
							fontWeight: 'bold'
						}
					},
					opposite: true
				}
			],
			tooltip: {
				formatter: function() {
					var value = this.y;
					var axis = this.series.yAxis.options.index;
					
					switch(axis) {
						case 0:
							value = number_format(this.y);
							break;
						case 1:
							value = number_format(this.y) + " (Minutes)";
							break;
					}
					return '<b>'+ this.series.name +'</b><br/>'+
						Highcharts.dateFormat('%B %d %Y', that.dates[this.x]) +': '+ value;	
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			series: this.orderedSeries
 		});
    }
    
    UserActivityGraph.prototype.getNameForKey = function(key)
    {
        if(key == 'veryActiveMinutes') return 'High Activity';
        if(key == 'steps') return 'Steps';
        if(key == 'sedentaryMinutes') return 'Inactive Time';
        if(key == 'marginalCalories') return 'Estimated Calories Burned';
        if(key == 'lightlyActiveMinutes') return 'Light Activity';
        if(key == 'fairlyActiveMinutes') return 'Moderate Activity';
        

        return key;
    }
    
	UserActivityGraph.prototype.getColor = function(index)
	{		
		if(index < this.options.colors.length)
		{
			return this.options.colors[index];	
		}
		return "#" + (Math.round(Math.random() * 0XFFFFFF)).toString(16);
	}
	
    UserActivityGraph.prototype.defaultOptions = {
        data:null,
		colors: [
    		'#500aa6',
    		'#29075c',
    		'#8d3bf7',
    		'#6c30bf',
    		'#d94141',
    		'#730606',
    		'#730606',
    		'#ff4242',
    		'#265fab',
    		'#063e73',
    		'#428bff',
    		'#3879d9',
    		'#0aa65d',
    		'#075c37',
    		'#3bf799',
    		'#30bf83'
    	]

    }
    
    $.fn.userActivityGraph = function(options)
    {
        return $(this).each(function() {
            $(this).data("userActivityGraph", new UserActivityGraph(this, options));
        });
    }


    window.number_format = function(number, decimals, dec_point, thousands_sep) {
      number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
          var k = Math.pow(10, prec);
          return '' + Math.round(n * k) / k;
        };
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    }
    
    return UserActivityGraph;
    
});