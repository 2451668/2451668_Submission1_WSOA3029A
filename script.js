async function fetchNeoData() {
    const response = await fetch('https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=CclzIekItze09eK4Aw2H2oQQYRbaMBBPOvsdeHd4');
    const data = await response.json();
    return data.near_earth_objects;
}

async function createBarChart() {
    const years = Array.from({ length: 9 }, (_, i) => 2015 + i); // Year 2015 to 2023
    const neoCounts = [];
    for (const year of years) {
        const neoData = await fetchNeoData(year);
        neoCounts.push({ year: year.toString(), count: neoData.length });
    }

    //chart setup
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 900 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    
    const svg = d3.select('#bar-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    //scales
    const xScale = d3.scaleBand()
        .domain(neoCounts.map(d => d.year))
        .range([0, width])
        .padding(0.5);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(neoCounts, d => d.count)])
        .nice()
        .range([height, 0]);

    // bars
    svg.selectAll('.bar')
        .data(neoCounts)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.year))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count));

    //x-axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    //y-axis
    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale));

    //axis labels
    svg.append('text')
        .attr('class', 'x-label')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom)
        .style('text-anchor', 'middle')
        .text('Year');

    svg.append('text')
        .attr('class', 'y-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Number of NEOs');

    //chart title
    svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .style('text-anchor', 'middle')
        .text('Near-Earth Objects (2015-2023)');
}

// chart function
createBarChart();