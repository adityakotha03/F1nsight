import React from "react";
import { darkenColor } from "../utils/darkenColor";

export const HistoryBar = ({ history, color }) => {
    const MIN_DARKEN_PERCENT = 6;
    const MAX_DARKEN_PERCENT = 34;
    const baseColor = color || "#5F0B84";
    const maxIndex = Math.max((history?.length || 1) - 1, 1);
    const scaledDarkenColor = (index) => {
        const percent =
            MIN_DARKEN_PERCENT +
            ((MAX_DARKEN_PERCENT - MIN_DARKEN_PERCENT) * index) / maxIndex;
        return darkenColor(baseColor, percent);
    };

    // useEffect(() => {
        // const svg = d3.select(svgRef.current);
        // const width = svg.node().clientWidth;
        // const height = svg.node().clientHeight;
        // const margin = { top: 0, right: 0, bottom: 30, left: 0 };

        // Set up the scales
        // const xScale = d3
        //     .scaleLinear()
        //     .domain([
        //         d3.min(history, (d) => d.startYear),
        //         d3.max(history, (d) => d.endYear + 1),
        //     ])
            // .range([margin.left, width - margin.right]);

        // const xAxis = d3
        //     .axisBottom(xScale)
        //     .tickFormat(d3.format("d"))
        //     .ticks(10);

        // Draw the axis
        // svg.select(".x-axis")
        //     .attr("transform", `translate(0, ${height - margin.bottom})`)
        //     .call(xAxis);

        // Bind data to the bars
        // const bars = svg
        //     .selectAll(".timeline-bar")
        //     .data(history, (d) => d.startYear + "-" + d.endYear + 1); // Use a unique key for data binding

        // Exit phase
        // bars.exit().remove();

        // Enter phase
        // bars.enter()
        //     .append("rect")
        //     .attr("class", "timeline-bar")
        //     .attr("x", (d) => xScale(d.startYear))
        //     .attr("y", margin.top)
        //     .attr("width", (d) => xScale(d.endYear + 1) - xScale(d.startYear))
        //     .attr("height", height - margin.top - margin.bottom)
        //     .attr("fill", (d, i) => colorScale(i)) // Use color scale for different sections
        //     .merge(bars) // Merge enter and update selections
        //     .transition() // Optional: Add transition for smooth updates
        //     .duration(750)
        //     .attr("x", (d) => xScale(d.startYear))
        //     .attr("y", margin.top)
        //     .attr("width", (d) => xScale(d.endYear + 1) - xScale(d.startYear))
        //     .attr("height", height - margin.top - margin.bottom);

        // Add labels
        //   svg.selectAll('.label')
        //     .data(history)
        //     .enter()
        //     .append('text')
        //     .attr('class', 'label')
        //     .attr('x', d => xScale(d.startYear) + (xScale(d.endYear + 1) - xScale(d.startYear)) / 2)
        //     .attr('y', margin.top / 2)
        //     .attr('fill', 'black')
        //     .text(d => d.team)
        //     .attr('text-anchor', 'middle');
    // }, [history]);

    return (
        <div className="history-bar-container pb-32">
            <div className="flex flex-col sm:flex-row rounded-sm overflow-hidden w-[90%] mx-auto">
                {history.map((d, i) => (
                    <div 
                        className="text-xs flex flex-row max-sm:justify-between items-center sm:flex-col leading-none w-full shadow-md p-8 bg-glow-dark" 
                        style={{ backgroundColor: scaledDarkenColor(i) }} 
                        key={i}
                    >
                        <span className="font-display">{d.team} </span>
                        <span>({d.startYear} - {d.endYear})</span>
                    </div>
                ))}
            </div>
            {/* <svg ref={svgRef} width="100%" height="50">
                <g className="x-axis" />
            </svg> */}
        </div>
    );
};
