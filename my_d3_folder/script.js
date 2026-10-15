
import { select } from "https://esm.sh/d3-selection";
import { csv } from "https://esm.sh/d3-fetch";
import { scaleLinear } from "https://esm.sh/d3-scale";

const url = "https://raw.githubusercontent.com/vinguyen139/Data-Analyst-Job-Market-Analysis/main/data_analyst_jobs.csv";

const svg = select("svg");

// Chart title
svg.append("text")
  .attr("x", 50)
  .attr("y", 40)
  .attr("font-size", 24)
  .attr("font-weight", "bold")
  .text("Data Analyst Annual Salary Comparison");

csv(url).then(data => {

  // Only jobs with valid salaries
  const jobs = data.filter(d =>
    +d.salary_min > 20000 &&
    +d.salary_max > 20000 &&
    +d.salary_max >= +d.salary_min
  ).slice(0, 8);

  const maxSalary = Math.max(...jobs.map(d => +d.salary_max));

  const scale = scaleLinear()
    .domain([0, maxSalary])
    .range([0, 400]);

  // Job titles
  svg.selectAll(".job")
    .data(jobs)
    .enter()
    .append("text")
    .attr("class", "job")
    .attr("x", 30)
    .attr("y", (d, i) => 100 + i * 50)
    .attr("font-size", 13)
    .text(d => d.title);

  // Minimum salary bars
  svg.selectAll("rect")
    .data(jobs)
    .enter()
    .append("rect")
    .attr("x", 400)
    .attr("y", (d, i) => 85 + i * 50)
    .attr("width", d => scale(+d.salary_min))
    .attr("height", 20)
    .attr("rx", 4)
    .attr("fill", "steelblue");
  
  
  // Minimum salary labels
  svg.selectAll(".min-salary")
    .data(jobs)
    .enter()
    .append("text")
    .attr("class", "min-salary")
    .attr("x", d => 400 + scale(+d.salary_min) - 8)
    .attr("y", (d, i) => 100 + i * 50)
    .attr("font-size", 12)
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .text(d => "$" + Math.round(+d.salary_min).toLocaleString());


  // Maximum salary circles
  svg.selectAll("circle")
    .data(jobs)
    .enter()
    .append("circle")
    .attr("cx", d => 400 + scale(+d.salary_max))
    .attr("cy", (d, i) => 95 + i * 50)
    .attr("r", 7)
    .attr("fill", "orange");

  // Salary labels
  svg.selectAll(".salary")
    .data(jobs)
    .enter()
    .append("text")
    .attr("class", "salary")
    .attr("x", d => 415 + scale(+d.salary_max))
    .attr("y", (d, i) => 100 + i * 50)
    .attr("font-size", 12)
    .text(d => "$" + Math.round(+d.salary_max).toLocaleString());

}).catch(error => console.error(error));
