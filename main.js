window.onload = function () {

    var width = 640;
    var height = 480;

    console.log(d3); // Test if d3 is loaded

    var START_GAME = false;
    var RADIUS = 13;

    /**
     * WPI Game
     */

    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            if (START_GAME){
                circle
                    .transition()
                    .duration(250)
                    .attr("cy", circle.attr("cy") - 40);
            } else {
                START_GAME = true;
                startGame();
            }

        }
    };

    var svg = d3.select("#svgcontainer")
        .append("svg").attr("width", width).attr("height", height);


    svg.append("defs")
        .append("pattern")
        .attr("id", "venus")
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
        .attr("fill", "url(#venus)");

    svg.append("text")
        .attr("x", (width / 2) - 70)
        .attr("y", (height / 2) - 150)
        .style("fill", "black")
        .text("Press SPACE to start");

    var circle = svg
        .append("circle")
        .attr("r", RADIUS)
        .attr("cx", 100)
        .attr("cy", 100)
        .style("fill", "red");

    var timer;
    var rectTimer;

    function startGame() {
        d3.selectAll("text").remove();

        circle.attr("cx", 100)
            .attr("cy", 100)
            .style("fill","red");

        timer = d3.timer(function (time) {
            circle.attr("cy", function (d) {
                var cy = circle.attr("cy");
                cy = parseFloat(cy) + 3;
                return cy;
            });

            if (parseFloat(circle.attr("cy")) + parseFloat(circle.attr("r"))> height){
                endGame();
            }
        });


        rectTimer = d3.interval(function () {
            var rectoU = svg.append('rect')
                .attr("width", 80)
                .attr("height", d3.randomUniform(1, 150)())
                .attr("y", 0)
                .attr("fill", getRandomColor());

            rectoU.attr("x", width + 100)
                .transition()
                .attr("x", -300)
                .tween("attr.fill", function () {
                    var node = d3.select(this);
                    return function (t) {
                        if (node.attr("x") < 110 && node.attr("x") > 80) {
                            let x1 = node.attr("x");
                            let y1 = node.attr("y");

                            //console.log(node.attr("width"),node.attr("height"));
                            let x2 = parseFloat(x1) + parseFloat(node.attr("width"));
                            let y2 = parseFloat(y1) + parseFloat(node.attr("height"));

                            let x = parseFloat(circle.attr("cx"));
                            let y = parseFloat(circle.attr("cy"));

                            //console.log("r", x1, y1, x2, y2,"c", x, y);

                            checkHit(x1, y1, x2, y2, x, y);
                        }
                    }
                })
                .duration(5000);


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
                .tween("attr.fill", function () {
                    var node = d3.select(this);
                    return function (t) {
                        if (node.attr("x") < 110 && node.attr("x") > 80) {
                            let x1 = node.attr("x");
                            let y1 = node.attr("y");

                            //console.log(node.attr("width"),node.attr("height"));
                            let x2 = parseFloat(x1) + parseFloat(node.attr("width"));
                            let y2 = parseFloat(y1) + parseFloat(node.attr("height"));

                            let x = parseFloat(circle.attr("cx"));
                            let y = parseFloat(circle.attr("cy"));

                            //console.log("r", x1, y1, x2, y2,"c", x, y);

                            checkHit(x1, y1, x2, y2, x, y);
                        }
                    }
                })
                .duration(5000);

        }, 800);

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

        svg.append("text")
            .attr("x", (width / 2) - 20)
            .attr("y", (height / 2) - 100)
            .style("fill", "red")
            .text("You lose!");

        START_GAME = false;

        circle.transition()
            .attr("cy", 500)
            .duration(1000);

        btnGame.disabled = false;

    }


    /**
     * Helper Functions
     */

    function getRandomColor() {
        return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
    }

};