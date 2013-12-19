/*
 * This is the finance graph which has my assets, debt and net incomes
 * @since 1.0
 */

define(['jquery', 'underscore'], function($,_) {
    
    var TeamGraph = function(container, opts) 
    {
        this.container = $(container);
        this.options = $.extend(true, this.defaultOptions, opts);
        this.renderWithData(this.options.data);
    }
            
    TeamGraph.prototype.renderWithData = function(data)
    {
        this.data = data;

        if(this.data.length == 0) {
            return this.renderNoData();
        }
        this.render();
    }
    
    TeamGraph.prototype.render = function()
    {
        var table = $('<table>').addClass('table table-striped table-bordered');
        table.append(this.createHeader());
        
        for(var index in this.data) {
            var team = this.data[index];
            var tr = $('<tr>');
            tr.append($('<td>').text('#' + (Number(index)+1)));
            tr.append($('<td>').text(team.companyName));
            tr.append($('<td>').text(number_format(team.score, 0)));
            table.append(tr);
        }
        
        this.container.html('').append(table);
    }
    
    TeamGraph.prototype.createHeader = function()
    {
        var tr = $('<tr>');
        tr.append($('<th>').text('Rank'));
        tr.append($('<th>').text('Company'));
        tr.append($('<th>').text('Score'));
        return tr;
    }
    
    
    TeamGraph.prototype.renderNoData = function() {
        this.container.html('<h2>No Data Just Yet, look back soon</h2>');
    }
    
    $.fn.teamGraph = function(options)
    {
        return $(this).each(function() {
            $(this).data('teamGraph', new TeamGraph(this, options));
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
    
    return TeamGraph;
    
});