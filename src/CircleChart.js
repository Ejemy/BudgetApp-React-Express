import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function CircleChart({ data }) {
    const svgRef = useRef(null);
    useEffect(() => {
        if (!data) { return }

        var dataset = []
        for (var key in data) {
            if(data[key] > 0){
              dataset.push({ category: key, expense: data[key] })  
            }
            
        }
        const width = 500,
            height = 500,
            radius = Math.min(width, height) / 2;


        var colors = []
        dataset.forEach((i) => {
            colors.push("rgb(0," + Math.floor(Math.random() * 255) + " , " + Math.floor(Math.random() * 255) + ")")
        })

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

        arc.append("path")
            .attr("d", path)
            .attr("fill", function (d) { return ordScale(d.data.expense) })


  
        svg
            .selectAll('arc')
            .data(dataset)
            .enter()
            .append('text')
            .text(function (d) { return d.category })
            .attr("transform", function (d,i) { return "translate(" + labelArc.centroid(arcsdata[i]) +  ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 17)


        return () => {
            d3.select(svgRef.current).selectAll("*").remove();
        };

    }, [data]);
    return (
        <div>
            <h1>The Chart of Data!</h1>
            <div ref={svgRef} ></div>
        </div>
    )

};



export default CircleChart