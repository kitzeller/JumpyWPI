/**
 * WPI Game
 * Kit Zellerbach
 *
 * - ENTER to start
 * - SPACE to jump
 *
 * Levels:
 * 0 - Normal
 * 15 - Changing obstacle height
 * 30 - More obstacles
 * 4 - ???
 *
 */

window.onload = function () {

    var width = 640;
    var height = 480;

    var START_GAME = false;
    var RADIUS = 13;
    var JUMP_HEIGHT = 45;
    var OBSTACLES_PASSED = 0;
    var TIMER_DELAY = 800;

    var timer;
    var rectTimer;

    /**
     * WPI Game
     */

    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            // Space
            if (START_GAME) {
                circle
                    .transition()
                    .duration(250)
                    .attr("cy", circle.attr("cy") - JUMP_HEIGHT);
            }
        }

        if (e.keyCode == 13) {
            // Enter
            if (!START_GAME) {
                START_GAME = true;
                startGame();
            }
        }
    };

    var svg = d3.select("#svgcontainer")
        .append("svg").attr("width", width).attr("height", height);

    // Background Image
    svg.append("defs")
        .append("pattern")
        .attr("id", "bg")
        .attr('patternUnits', 'userSpaceOnUse')
        .attr("width", 640)
        .attr("height", 480)
        .append("image")
        .attr("xlink:href", "img/wpi-campus-center.jpg")
        .attr("width", 640)
        .attr("height", 480);

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "url(#bg)");

    svg.append("text")
        .attr("x", (width / 2) - 70)
        .attr("y", (height / 2) - 150)
        .style("fill", "black")
        .text("Press ENTER to start");
    svg.append("text")
        .attr("x", (width / 2) - 70)
        .attr("y", (height / 2) - 120)
        .style("fill", "black")
        .text("Press SPACE to jump");

    var circle = svg
        .append("circle")
        .attr("r", RADIUS)
        .attr("cx", 100)
        .attr("cy", 100)
        .style("fill", "red");

    function startGame() {
        d3.selectAll("text").remove();
        OBSTACLES_PASSED = 0;

        circle.attr("cx", 100)
            .attr("cy", 100)
            .style("fill", "red");

        // Circle Timer
        timer = d3.timer(function (time) {
            circle.attr("cy", function (d) {
                var cy = circle.attr("cy");
                cy = parseFloat(cy) + 4;
                return cy;
            });

            if (parseFloat(circle.attr("cy")) + parseFloat(circle.attr("r")) > height) {
                endGame();
            }
        });

        obstacleTimer();


    }

    function obstacleTimer() {
        // Obstacle Timer
        rectTimer = d3.interval(function () {
            var rectoU = svg.append('rect')
                .attr("width", 80)
                .attr("height", d3.randomUniform(1, 150)())
                .attr("y", 0)
                .attr("fill", getRandomColor());

            rectoU.attr("x", width + 100)
                .transition()
                .attr("x", -300)
                .attr("height", function () {
                    if (OBSTACLES_PASSED > 15) {
                        // After 15 obstacle start changing heights
                        return d3.randomUniform(1, 150)()
                    } else {
                        return d3.select(this).attr("height");
                    }
                })
                .tween("attr.fill", function () {
                    var node = d3.select(this);
                    return function (t) {
                        if (node.attr("x") < 110 && node.attr("x") > 80) {
                            let x1 = node.attr("x");
                            let y1 = node.attr("y");

                            let x2 = parseFloat(x1) + parseFloat(node.attr("width"));
                            let y2 = parseFloat(y1) + parseFloat(node.attr("height"));

                            let x = parseFloat(circle.attr("cx"));
                            let y = parseFloat(circle.attr("cy"));

                            checkHit(x1, y1, x2, y2, x, y);
                        }
                    }
                })
                .duration(5000)
                .on("end", function () {
                    OBSTACLES_PASSED++;
                });


            var rectoB = svg.append('rect')
                .attr("width", 80)
                .attr("height", 300)
                .attr("y", function (d) {
                    return d3.randomUniform(250, height - 100)()
                })
                .style("fill", getRandomColor());

            rectoB.attr("x", width + 100)
                .transition()
                .attr("x", -300)
                .attr("y", function () {
                    if (OBSTACLES_PASSED > 15) {
                        // After 15 obstacle start changing heights
                        return d3.randomUniform(250, height - 100)()
                    } else {
                        return d3.select(this).attr("y");
                    }
                })
                .tween("attr.fill", function () {
                    var node = d3.select(this);
                    return function (t) {
                        if (node.attr("x") < 110 && node.attr("x") > 80) {
                            let x1 = node.attr("x");
                            let y1 = node.attr("y");

                            let x2 = parseFloat(x1) + parseFloat(node.attr("width"));
                            let y2 = parseFloat(y1) + parseFloat(node.attr("height"));

                            let x = parseFloat(circle.attr("cx"));
                            let y = parseFloat(circle.attr("cy"));

                            checkHit(x1, y1, x2, y2, x, y);
                        }
                    }
                })
                .duration(5000);

            if (OBSTACLES_PASSED === 30) {
                TIMER_DELAY = 300;
                rectTimer.stop();
                obstacleTimer();
            }

        }, TIMER_DELAY);
    }

    function checkHit(x1, y1, x2, y2, x, y) {
        if (x + RADIUS > x1 && x - RADIUS < x2 && y + RADIUS > y1 && y - RADIUS < y2) {
            console.log("made it");
            circle.style("fill", "grey");
            endGame();
        }
    }

    function endGame() {
        timer.stop();
        rectTimer.stop();

        if (START_GAME) {
            svg.append("text")
                .attr("x", (width / 2) - 20)
                .attr("y", (height / 2) - 150)
                .style("fill", "red")
                .text("You lose!");

            svg.append("text")
                .attr("x", (width / 2) - 60)
                .attr("y", (height / 2) - 120)
                .style("fill", "red")
                .text("(" + OBSTACLES_PASSED + " obstacles passed)");

            circle.transition()
                .attr("cy", 500)
                .duration(1000);

        }
        START_GAME = false;
    }

    /**
     * Helper Functions
     */

    function getRandomColor() {
        return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
    }

};