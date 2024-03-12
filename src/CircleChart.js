import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function CircleChart({ data, style }) {
    const svgRef = useRef(null);
    useEffect(() => {
        if (!data) { return }
        console.log("DATA", data)
        var dataset = []
        for (var key in data.total) {
            if (data.total[key] > 0) {
                dataset.push({ category: key, expense: data.total[key] })
            }

        }
        const width = 500,
            height = 500,
            radius = Math.min(width, height) / 2;


        var colors = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

        const pie = d3.pie().value((d) => d.expense);
        const arcsdata = pie(dataset)
        const ordScale = d3.scaleOrdinal()
            .domain(dataset)
            .range(colors)

        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);



        const arc = svg.selectAll("arc")
            .data(arcsdata)
            .enter();

        const path = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius / 2)
            .cornerRadius(8)
            .padAngle(0.015)

        const labelArc = d3.arc()
            .outerRadius(radius * 1.1)
            .innerRadius(radius / 2.1)


        const tooltip = d3.select("body")
            .append("div").classed("tooltip", true)
        
        const pieSection = arc.append("path").attr("d", path).attr("fill", function(d) {return ordScale(d.data.expense)})

        pieSection
            .on("mouseover", (d,i) => {
                tooltip
                    .style("left", d.pageX + "px")
                    .style("top", d.pageY + "px")
                    .attr("data-value", i.value)
                    .html(`${i.data.category} <br> ${formatCurrency(i.data.expense)}`) 
                    .transition()
                    .duration(500)
                    .style("opacity", 1)
            })
            .on("mouseout", (d,i) => {
                tooltip.transition().duration(500).style("opacity", 0)
            })




        return () => {
            d3.select(svgRef.current).selectAll("*").remove();
        };

    }, [data]);
    return (
        <div style = {style}>
            <h1><u>Total Spent</u></h1>
            <div ref={svgRef} ></div>
        </div>
    )

};

function formatCurrency(num){

    const str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "¥" + str;
}



export default CircleChart