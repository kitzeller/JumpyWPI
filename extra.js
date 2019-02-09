
window.onload = function () {

    console.log(d3); // Test if d3 is loaded

    /**
     * Title Color Animation using D3 transitions
     */

    function titleColorTransition() {
        d3.selectAll("h1")
            .transition()
            .duration(3000)
            .style("color", function () {
                return getRandomColor();
            })
            .on("end", titleColorTransition);
    }

    titleColorTransition();

    /**
     * SVG 1 - Rectangle with Color Gradient: Visible Light Spectrum
     */

    var width = 800;
    var height = 300;
    var svg = d3.select("#svgcontainer")
        .append("svg").attr("width", width).attr("height", height);


    // Data for Visible Light Spectrum
    var colorRange = ['violet', 'blue', 'cyan', 'green', 'yellow', 'orange', 'red'];
    var colorStart = [380, 450, 485, 500, 565, 590, 625];
    var colorEnd = [450, 485, 500, 565, 590, 625, 740];
    var start = 380;
    var end = 740;

    // Tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var linearGradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "linear-gradient");

    linearGradient = createGradient(linearGradient);

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height / 2)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "url(#linear-gradient)")
        .on('mousemove', function (d) {
            var mouse = d3.mouse(this);
            var x = mouse[0];
            var y = mouse[1];
            // show tooltip
            div.transition()
                .duration(200)
                .style("opacity", .9);
            // Scale mouse x coordinate to nanometers
            // Percentage * diff + min
            div.html((((x / 800) * 360) + 380) + "nm")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        });

    /**
     * Rectangle Transition
     */

    var recto = svg.append('rect')
        .attr("width", 80)
        .attr("height", 80)
        .attr("y", height / 1.5);

    repeatTransition();

    function repeatTransition() {
        recto.attr("x", 0)
            .attr("fill", colorRange[0])
            .transition()
            .duration(1000)
            .attr("x", 120)
            .attr("fill", colorRange[1])
            .transition()
            .duration(1000)
            .attr("x", 240)
            .attr("fill", colorRange[2])
            .transition()
            .duration(1000)
            .attr("x", 360)
            .attr("fill", colorRange[3])
            .transition()
            .duration(1000)
            .attr("x", 480)
            .attr("fill", colorRange[4])
            .transition()
            .duration(1000)
            .attr("x", 600)
            .attr("fill", colorRange[5])
            .transition()
            .duration(1000)
            .attr("x", 720)
            .attr("fill", colorRange[6])
            .transition()
            .duration(1000)
            .attr("x", 0)
            .attr("fill", colorRange[0])
            .on("end", repeatTransition);  // After all transitions have finished, repeat the function
    }

    /**
     * SVG 2 - Circle Animation: Particle Movement
     * Adapted from https://bl.ocks.org/curran/e30339061fb0dac8dfcfbb57d06715b8
     */

    var svg2 = d3.select("#svgcontainer2")
        .append("svg").attr("width", width).attr("height", height);


    // Text Labels
    svg2.append("text")
        .attr("x", 0)
        .attr("y", height)
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("380 nm");

    svg2.append("text")
        .attr("x", width)
        .attr("y", height)
        .attr("text-anchor", "end")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("740 nm");

    var nCircles = 50;
    var t = 0;
    var circles2 = svg2.selectAll("circle").data(d3.range(nCircles))
        .enter().append("circle")
        .attr("cx", function (d) {
            return (d + 0.5) * width / nCircles;
        })
        .attr("n", function (d) {
            return d;
        })
        .attr("r", 10)
        .attr("r2", function (d) { // Store original r value for mouseout
            return 10;
        })
        .attr("fill", function (d) {
            xval = d * width / nCircles;
            nmval = (((xval / 800) * 360) + 380);
            color = colorFromWavelength(nmval);
            return color;

        })
        .on('mouseover', function (d) {
            var nodeSelection = d3.select(this).attr("r", 20);
            t = d3.now();
            timer.stop();
        })
        .on('mouseout', function (d) {
            var n = d3.select(this).attr("r2");
            var nodeSelection = d3.select(this).attr("r", n);
            timer = d3.timer(function (time) {
                circles2.attr("cy", function (d) {
                    // Sine wave function
                    return sineWave(d, time);
                });
            }, 0, t);
        });

    var timer = d3.timer(function (time) {
        circles2.attr("cy", function (d) {
            return sineWave(d, time)
        });
    });


    function sineWave(d, t) {
        // y = a sin (bx + c) + d
        // a - amplitude
        // b - frequency
        // c - x-axis shift
        // d - y-axis shift
        return (Math.sin(d / 5 + t / 800)) * height / 3 + height / 2;
    }


    /**
     * SVG 3 - Rectangle with Rotated Color Gradient and Drawable Lines
     */

    var svg3 = d3.select("#svgcontainer3")
        .append("svg").attr("width", width).attr("height", 500);


    // Linear Gradient Transformation
    var linearGradient2 = svg3.append("defs")
        .append("linearGradient")
        .attr("id", "linear-gradient2")
        .attr("gradientTransform", "rotate(90)");

    linearGradient2 = createGradient(linearGradient2);

    svg3.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 150)
        .attr("height", 400)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "url(#linear-gradient2)");

    var quizText = ["450 - 485 nm", "565 - 590 nm", "625 - 740 nm", "485 - 500 nm", "380 - 450 nm", "590 - 625 nm", "500 - 565 nm"];
    var quizY = 50;

    for (q = 0; q < quizText.length; q++) {
        svg3.append("text")
            .attr("x", width)
            .attr("y", quizY)
            .attr("text-anchor", "end")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(quizText[q]);

        quizY = quizY + 50;
    }

    var btnAnswers = document.getElementById("btnAnswers");

    btnAnswers.addEventListener("click", function (event) {
        checkAnswers();
    });


    /**
     * SVG 4: Circles: Color Changing Rainbow using Transitions & Transformations
     */


    var svg4 = d3.select("#svgcontainer4")
        .append("svg").attr("width", width).attr("height", height);

    const rainbowColors = ['violet', 'blue', 'cyan', 'green', 'yellow', 'orange', 'red'];
    let MULTIPLIER = 20;

    var i;
    for (i = rainbowColors.length - 1; i >= 0; i--) {
        svg4.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", (i + 1) * MULTIPLIER)
            .attr("ncol", rainbowColors[i])
            .attr("hcol", rainbowColors[rainbowColors.length - i - 1])
            .style("fill", rainbowColors[i])
            .on('mouseenter', function (d) {
                const color = d3.select(this).attr("hcol");
                d3.select(this).transition().duration(500).style("fill", color).attr("transform", "translate(200,0)");
            })
            .on('mouseout', function (d) {
                const color = d3.select(this).attr("ncol");
                d3.select(this).transition().duration(500).style("fill", color).attr("transform", "translate(-200,0)");
            });
    }


    /**
     * SVG 5: Circles - Add Circles with Color and Radius/By Clicking
     */

    var svg5 = d3.select("#svgcontainer5")
        .append("svg").attr("width", width).attr("height", height)
        .on('click', function (d) {
            var mouse = d3.mouse(this);
            var x = mouse[0];
            var y = mouse[1];
            addCircle(x, y, 40, getRandomColor());
        });


    // Initial Circle data
    var data = [
        {
            x: 400,
            y: 150,
            r: 15,
            color: "red"
        },
        {
            x: 400,
            y: 150,
            r: 10,
            color: "blue"
        },
        {
            x: 400,
            y: 150,
            r: 5,
            color: "yellow"
        }
    ];

    var circles = svg5.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    var circleAttrs = circles
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d) {
            return d.color;
        });

    var input = document.getElementById("userinput");
    var colorinput = document.getElementById("usercolor");
    var btn = document.getElementById("btn");

    btn.addEventListener("click", function (event) {
        var r = input.value;
        input.value = "";
        var color = colorinput.value;
        colorinput.value = "";
        addCircle(400, 150, r, color);
    });

    /**
     * SVG 6: Polygons - Add Polygon from List of Coords
     */

    var svg6 = d3.select("#svgcontainer6")
        .append("svg").attr("width", width).attr("height", height);

    var poly = [[{"x": 10, "y": 50},
        {"x": 400, "y": 20},
        {"x": 50, "y": 10},
        {"x": 30, "y": 50}]];

    svg6.selectAll("polygon")
        .data(poly)
        .enter().append("polygon")
        .attr("points", function (d) {
            return d.map(function (d) {
                return [(d.x), (d.y)].join(",");
            }).join(" ");
        })
        .attr("stroke", getRandomColor())
        .attr("fill",getRandomColor())
        .attr("stroke-width", 3);

    var btnPoly = document.getElementById("btnPoly");

    btnPoly.addEventListener("click", function (event) {
        addPolygon();
    });

    /**
     * SVG 7: Circle Game
     */

    var svg7 = d3.select("#svgcontainer7")
        .append("svg").attr("width", width).attr("height", height);

    // Initial Circle data
    var dataCircle = ["25", "35", "45"];

    var circles3 = svg7.selectAll("circle")
        .data(dataCircle)
        .enter()
        .append("circle")
        .on("mousemove", function (d) {
            var radiii = d3.select(this).attr("r");
            var val = parseFloat(parseFloat(radiii).toFixed(2)) + 0.4;
            d3.select(this).attr("r", val);
        });

    var circleAttrs3;

    var btnGame = document.getElementById("btnGame");
    var timer2;

    btnGame.addEventListener("click", function (event) {
        circleAttrs3 = circles3
            .attr("cx", function (d) {
                return d3.randomUniform(0, width - d)()
            })
            .attr("cy", function (d) {
                return d3.randomUniform(0, height - d)()
            })
            .attr("r", function (d) {
                return d;
            })
            .style("fill", function (d) {
                return getRandomColor();
            });
        startGame();
    });


    /**
     * Button Helper Functions
     */

    function startGame() {
        if (typeof timer2 !== 'undefined') {
            timer2.stop();
        }
        timer2 = d3.timer(function (time) {
            circleAttrs3.attr("r", function (d) {
                var radi = d3.select(this).attr("r");
                if (radi <= 1) {
                    alert("You lose!");
                    timer2.stop();
                    return 1;
                }
                radi = radi - 0.1;
                return radi;
            });
        });
    }

    function checkAnswers() {
        var lineStart = [[150, 36], [150, 109], [150, 135], [150, 200], [150, 234], [150, 300], [150, 390]];
        var lineEnd = [[704, 245], [704, 45], [704, 200], [704, 350], [704, 100], [704, 300], [704, 150]];
        let lineColor = ['violet', 'blue', 'cyan', 'green', 'yellow', 'orange', 'red'];

        for (i = 0; i < lineStart.length; i++) {
            var circle = svg3.append("line")
                .attr("x1", lineStart[i][0])
                .attr("y1", lineStart[i][1])
                .attr("x2", lineEnd[i][0])
                .attr("y2", lineEnd[i][1])
                .attr("stroke-width", 4)
                .attr("stroke", lineColor[i])
                .style("stroke-dasharray", ("3, 3"));

        }
    }


    function addCircle(x, y, r, color) {
        var dataToAdd = {
            x: x,
            y: y,
            r: r,
            color: color
        };

        var circle = svg5.selectAll("circle")
            .data(data);
        circle.remove();

        data.push(dataToAdd);
        data.sort(function (x, y) {
            return d3.descending(x.r, y.r);
        });

        var circles = svg5.selectAll("circle")
            .data(data)
            .enter()
            .append("circle");

        var attrs = circles
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d) {
                return d.color;
            });
    }

    function addPolygon() {
        var polyArray = [];
        var polyTextarea = document.getElementById("txtPoly");
        var lines = polyTextarea.value.split('\n');
        polyTextarea.value = "";
        for (var i = 0; i < lines.length; i++) {
            var polyObject = {};
            var xyVal = lines[i].split(',');
            polyObject["x"] = xyVal[0];
            polyObject["y"] = xyVal[1];
            polyArray.push(polyObject);
        }

        poly.push(polyArray);

        svg6.selectAll("polygon")
            .data(poly)
            .enter().append("polygon")
            .attr("points", function (d) {
                return d.map(function (d) {
                    return [(d.x), (d.y)].join(",");
                }).join(" ");
            })
            .attr("stroke", getRandomColor())
            .attr("fill",getRandomColor())
            .attr("stroke-width", 3);
    }


    /**
     * Helper Functions
     */

    function getRandomColor() {
        return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
    }

    function createGradient(gradient) {
        var rollingSum = 0;

        var color = d3.scaleLinear().range(colorRange).domain([1, 2, 3, 4, 5, 6, 7]);

        for (var c = 0; c < colorRange.length; c++) {
            var offset = ((colorEnd[c] - colorStart[c]) / (end - start)) + rollingSum;
            rollingSum = offset;

            gradient.append("stop")
                .attr("offset", offset)
                .attr("stop-color", color(c + 1));
        }
        return gradient;
    }

    function colorFromWavelength(wl) {
        let colorRange = ['violet', 'blue', 'cyan', 'green', 'yellow', 'orange', 'red'];
        let colorStart = [380, 450, 485, 500, 565, 590, 625];
        let colorEnd = [450, 485, 500, 565, 590, 625, 740];

        for (i = 0; i < colorRange.length; i++) {
            if (wl >= colorStart[i] && wl <= colorEnd[i]) {
                return colorRange[i];
            }
        }
    }

};