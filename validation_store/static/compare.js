var jsonURL = '/api/compare?ids=' + reportIDs.join(',');
var margin = {top: 20, bottom: 60, left: 40, right: 180};
var colors = ['#7fc97f', '#beaed4', '#fdc086'];
var metrics = ['accuracy', 'precision', 'recall', 'f1_score'];
var colors = {
    'accuracy': '#8dd3c7',
    'precision': '#eeeea2',
    'recall': '#bebada',
    'f1_score': '#fb8072'}

var compareData = [{
    class: 'org_name',
    validationRuns: [
        {
            created_at: '2018-02-10T10:48:00',
            uploaded_by: 'peter',
            config_version: 'abcd',
            metrics: {
                accuracy: 0.9,
                precision: 0.8,
                recall: 0.7,
            }
        },
        {
            created_at: '2018-02-20T10:00:00',
            uploaded_by: 'peter',
            config_version: 'abcd',
            metrics: {
                accuracy: 0.94,
                precision: 0.75,
                recall: 0.78,
            }
        },
        {
            created_at: '2018-02-21T12:08:00',
            uploaded_by: 'peter',
            config_version: 'abcd',
            metrics: {
                accuracy: 0.6,
                precision: 0.9,
                recall: 0.5,
            }
        }
        ]
    },
    {
    class: 'family_name',
    validationRuns: [
        {
            created_at: '2018-02-10T10:48:00',
            uploaded_by: 'peter',
            config_version: 'abcd',
            metrics: {
                accuracy: 0.9,
                precision: 0.8,
                recall: 0.7,
            }
        },
        {
            created_at: '2018-02-20T10:00:00',
            uploaded_by: 'peter',
            config_version: 'abcd',
            metrics: {
                accuracy: 0.94,
                precision: 0.75,
                recall: 0.78,
                }
        },
        {
            created_at: '2018-02-21T12:08:00',
            uploaded_by: 'peter',
            config_version: 'abcd',
            metrics: {
                accuracy: 0.6,
                precision: 0.9,
                recall: 0.5,
            }
        }
        ]
        }]


var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);


function makePlot(){
    var width = 800,
        height = 200;

    function chart(d, i){
        var container = d3.select(this);
        container.append('h2')
            .text(d.class);

        var svg = container.append('svg')
            .attr('height', height + margin.bottom + margin.top)
            .attr('width', width + margin.left + margin.right)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var validationRunsData = d.validationRuns;
        var numObservations = validationRunsData.length;
        var accuracyLineData = validationRunsData.map((val, ind) => [ind, val.metrics.accuracy]);

        var x = d3.scaleLinear()
            .domain([-0.3, numObservations - 1 + 0.3])
            .range([0, width]);
        var y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);
        var line = d3.line()
            .x((d, i) => x(i))
            .y(d => y(d[1]));


        function plotLine(selection, metric){
            group = selection.append('g')
                .attr('class', metric);

            var color = colors[metric];
            group.selectAll('circle')
                .data(d.validationRuns)
                .enter()
                .append('circle')
                .attr('cx', (d, i) => x(i))
                .attr('cy', d => y(d.metrics[metric]))
                .attr('r', 4)
                .attr('fill', color)
                .on('mouseover', function(d, i){
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 1);
                    tooltip.html('<p>' + metric + ' ' + d.metrics[metric] + '</p>')
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 28)+ 'px');
                    })
                 .on('mouseout', function(d, i){
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 0);
                 });

            var lineData = validationRunsData.map((val, ind) => [ind, val.metrics[metric]]);
            group.append("path")
                .data([lineData])
                .attr('class', 'line')
                .attr('d', line)
                .attr('stroke-width', '2')
                .attr('stroke', color)
                .attr('fill', 'none');
                group.selectAll('cir')
        }
        svg.call(plotLine, 'accuracy');
        svg.call(plotLine, 'precision');
        svg.call(plotLine, 'recall');
        svg.call(plotLine, 'f1_score');


        function addLegend(selection){
            var legend = selection.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + (width - 100) + ', ' + 20 + ')');

            legend.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 100)
                .attr('height', 70)
                .attr('stroke', 'blue')
                .attr('fill', 'none');

            legend.selectAll('circle')
                .data(d3.entries(colors))
                .enter()
                .append('circle')
                .attr('fill', function(d){return d.value})
                .attr('r', 4)
                .attr('cx', 10)
                .attr('cy', (d, i) => 10 + i*15);

            legend.selectAll('text')
                .data(d3.entries(colors))
                .enter()
                .append('text')
                .attr('fill', 'black')
                .attr('x', 20)
                .attr('y', (d, i) => 14 + i*15)
                .text(d => d.key)
        }

        svg.call(addLegend);

        var xAxis = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(d3.axisBottom(x)
                .tickValues(d3.range(0, numObservations, 1))
                );

        var xTicks = xAxis.selectAll('.tick');

        xTicks.selectAll('text')
            .remove();

        xAxis.selectAll('.tick')
            .data(validationRunsData)
            .append('text')
            .selectAll('tspan')
            .data(d => ['Created at: ' + d.created_at, 'Uploaded by: ' + d.uploaded_by, 'Config version: ' + d.config_version])
            .enter()
            .append('tspan')
            .text(d => d)
            .attr('fill', 'black')
            .attr('dy', '1.3em')
            .attr('x', -30)
            .attr('text-anchor', 'start')

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));
    }
    return chart
}
function renderPage(error, data){
    var plotter = makePlot();
    var plotContainers = d3.select("#main")
        .append("div")
        .attr("class", "plots")
        .selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "plot");

    plotContainers.each(plotter);
}

d3.queue()
    .defer(d3.json, jsonURL)
    .await(renderPage);
