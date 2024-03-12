import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function BarChart({ data, style }) {
    const svgRef = useRef(null);
    useEffect(() => {
        if (!data) { return null }

        var dataset = []
        for (var key in data.average) {
            if (data.average[key].expense > 0) {
                dataset.push({ category: key, expense: data.average[key].expense })
            }

        }
        const height = 500, //window.innerHeight,
            width = 500,//window.innerWidth,
            border = 30;
        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("viewBox", [0, 0, width + border, height + border])
            //.append("g")
            //    .attr("transform", "translate(" + border + "," + border + ")")

        const x = d3.scaleBand()
            .range([0, width])
            .domain(dataset.map((d) => d.category))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0, " + height  + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10, 0)rotate(-45)")
            .style("text-anchor", "end");

        const maxY = d3.max(dataset, (d) => d.expense);

        const y = d3.scaleLinear()
            .domain([0, maxY])
            .range([height, 0]);
        const tooltip = d3.select("body")
            .append("div").classed("tooltip", true)
        svg.selectAll("bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", (d, i) => x(d.category))
            .attr("y", (d, i) => y(d.expense))
            .attr("height", (d, i) => height - y(d.expense))
            .attr("width", x.bandwidth())
            .attr("fill", "navy")
            .on("mouseover", (d, i) => {
                console.log(d, i)
                tooltip
                    .style("left", d.pageX + "px")
                    .style("top", d.pageY + "px")
                    .attr("data-value", i.value)
                    .html(`${i.category} <br> ${formatCurrency(i.expense)}`)
                    .transition()
                    .duration(500)
                    .style("opacity", 1)
            })
            .on("mouseout", (d, i) => {
                tooltip.transition().duration(500).style("opacity", 0)
            })




        return () => {
            d3.select(svgRef.current).selectAll("*").remove();
        };

    }, [data]);
    return (
        <div style={style}>
            <h1><u>Monthly Average</u></h1>
            <div ref={svgRef} ></div>
        </div>
    )

};

function formatCurrency(num) {

    const str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "¥" + str;
}



export default BarChart