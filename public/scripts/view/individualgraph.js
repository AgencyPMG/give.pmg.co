/*
 * This is the finance graph which has my assets, debt and net incomes
 * @since 1.0
 */

define(['jquery', 'underscore'], function($,_) {
    
    var IndividualGraph = function(container, opts) 
    {
        this.container = $(container);
        this.options = $.extend(true, this.defaultOptions, opts);
        this.renderWithData(this.options.data);
    }
            
    IndividualGraph.prototype.renderWithData = function(data)
    {
        this.data = data;

        if(this.data.length == 0) {
            return this.renderNoData();
        }
        this.render();
    }
    
    IndividualGraph.prototype.render = function()
    {
        var table = $('<table>').addClass('table table-striped table-bordered');
        table.append(this.createHeader());
        
        for(var index in this.data) {
            var user = this.data[index].user;
            var tr = $('<tr>');
            tr.append($('<td>').text('#' + (Number(index)+1)));
            tr.append($('<td>').text('[' + user.clientName.toUpperCase() + '] ' + user.firstName + ' ' + user.lastName));
            tr.append($('<td>').text(number_format(this.data[index].score, 0)));
            table.append(tr);
        }
        
        this.container.html('').append(table);
    }
    
    IndividualGraph.prototype.createHeader = function()
    {
        var tr = $('<tr>');
        tr.append($('<th>').text('Rank'));
        tr.append($('<th>').text('Name'));
        tr.append($('<th>').text('Score'));
        return tr;
    }
    
    
    IndividualGraph.prototype.renderNoData = function() {
        this.container.html('<h2>No Data Just Yet, look back soon</h2>');
    }
    
    $.fn.individualGraph = function(options)
    {
        return $(this).each(function() {
            $(this).data('individualGraph', new IndividualGraph(this, options));
        });
    }
    
    return IndividualGraph;
    
});