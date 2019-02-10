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
 *
 * Firebase Leaderboard
 * Sound Effects
 *
 * TODO: More levels, different backgrounds
 * TODO: Text inside obstacles
 *
 */

window.onload = function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDZJmjUZW0F58e0I7ZeKpaFRTb8DW57b4Y",
        authDomain: "jumpywpi.firebaseapp.com",
        databaseURL: "https://jumpywpi.firebaseio.com",
        projectId: "jumpywpi",
        storageBucket: "jumpywpi.appspot.com",
        messagingSenderId: "122348286885"
    };
    firebase.initializeApp(config);

    loadScores();

    var jumpSound = new Audio('sound/jump-1.wav');
    var loseSound = new Audio('sound/lose.wav');
    var bgSound = new Audio('sound/bg-1.wav');
    bgSound.loop = true;

    var width = 640;
    var height = 480;

    var START_GAME = false;
    var RADIUS = 13;
    var JUMP_HEIGHT = 50;
    var OBSTACLES_PASSED = 0;
    var TIMER_DELAY = 800;
    var MUTE_SOUND = false;

    var timer;
    var rectTimer;

    document.getElementById("placeholder").style.display = "none";

    document.body.onkeydown = function (e) {
        if (e.keyCode == 32) {
            // Space
            if (START_GAME) {
                circle
                    .transition()
                    .duration(250)
                    .attr("cy", function () {
                        if (circle.attr("cy") - JUMP_HEIGHT - circle.attr("r") < 0) {
                            return circle.attr("r");
                        } else {
                            return circle.attr("cy") - JUMP_HEIGHT;
                        }
                    });
                // Allow for sound overlap
                if (!MUTE_SOUND){
                    const newAudio = jumpSound.cloneNode();
                    newAudio.play();
                }
            }
            return !(e.keyCode == 32);
        }

        if (e.keyCode == 13) {
            // Enter
            if (!START_GAME) {
                START_GAME = true;
                startGame();
            }
        }

        if (e.keyCode == 77){
            // Mute sound
            MUTE_SOUND = !MUTE_SOUND;
            if (!MUTE_SOUND){
                document.getElementById("vol_off").style.display = "none";
                document.getElementById("vol_on").style.display = "block";
                bgSound.play();
            } else {
                document.getElementById("vol_off").style.display = "block";
                document.getElementById("vol_on").style.display = "none";
                bgSound.pause();
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
        if (!MUTE_SOUND){
            bgSound.play();
        }
        d3.selectAll("text").remove();
        OBSTACLES_PASSED = 0;
        TIMER_DELAY = 800;

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
                .attr("fill", getRandomColor())
                .attr("class", "obstacle");

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

                        if (node.attr("x") < 70 && node.attr("x") > 65) {
                            if (START_GAME) {
                                OBSTACLES_PASSED++;
                                svg.selectAll("text").remove();
                                svg.append("text")
                                    .attr("x", width - 30)
                                    .attr("y", 20)
                                    .attr("id", "counter")
                                    .style("fill", "black")
                                    .text(OBSTACLES_PASSED);
                            }
                        }

                    }
                })
                .duration(5000)
                .on("end", function () {
                    d3.select(this).remove();
                });


            var rectoB = svg.append('rect')
                .attr("width", 80)
                .attr("height", 300)
                .attr("y", function (d) {
                    return d3.randomUniform(250, height - 100)()
                })
                .style("fill", getRandomColor())
                .attr("class", "obstacle");


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
            if (!MUTE_SOUND) loseSound.play();

            d3.selectAll(".obstacle").remove();

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
                .duration(1000)
                .on("end", function () {
                    var name = prompt("Please enter your name", "");
                    submitScore(name, OBSTACLES_PASSED);
                });

        }
        START_GAME = false;
    }

    /**
     * Helper Functions
     */

    function loadScores() {
        var leaderboard = firebase.database().ref();
        leaderboard.on('value', function (snapshot) {
            var board = document.getElementById("leaderboard");
            board.innerHTML = "";

            var scores = snapshot.val();
            var sorted = {};

            // Sort by score
            Object.keys(scores).sort(function (a, b) {
                return scores[b] - scores[a]
            })
                .map(key => sorted[key] = scores[key]);

            // Only top 5
            const sliced = Object.keys(sorted).slice(0, 5).reduce((result, key) => {
                result[key] = sorted[key];
                return result;
            }, {});

            Object.entries(sliced).forEach(
                ([key, value]) =>
                    board.innerHTML += key.split("--")[0] + " " + key.split("--")[1] + "<span style='float:right'>" + value + "</span><br>"
            );

        });
    }

    function submitScore(name, score) {
        if (name !== null && name !== "") {
            var d = new Date();
            var dateString = d.getMonth() + 1 + "-" + d.getDate() + "-" + d.getFullYear();
            return firebase.database().ref().child(dateString + "--" + name).set(score);
        }
    }

    function getRandomColor() {
        return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
    }

};