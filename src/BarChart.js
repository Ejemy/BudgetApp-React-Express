import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function BarChart({ data }) {
    const svgRef = useRef(null);
    useEffect(() => {

        if(!data){return null}

        

    
        return () => {
            d3.select(svgRef.current).selectAll("*").remove();
        };

    }, [data]);
    return (
        <div>
            <h1><u>Monthly Average</u></h1>
            <div ref={svgRef} ></div>
        </div>
    )

};




export default BarChart