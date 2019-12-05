
// Thanks @robbendebiene! https://stackoverflow.com/a/24559613
// jQuery free scroll to top

function scrollToTop(scrollDuration) {
    var cosParameter = window.scrollY / 2,
        scrollCount = 0,
        oldTimestamp = performance.now();
    function step (newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) window.scrollTo(0, 0);
        if (window.scrollY === 0) return;
        window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}

const t = d3.transition()
        .duration(300)
        .ease(d3.easeLinear);

function isShown(el,show) {

    let opacity = show ? 1 : 0;

    el.interrupt();
    el.classed('show',show)
        .transition(t)
        .style('opacity',opacity);
    }

(function () {

    let currCategory = 0;

    // listeners for selecting categories
    d3.selectAll('#blurb span').on('click', function(){
        let cards = d3.selectAll('.card.show,.year.show')
        isShown(cards,false);

        currCategory = d3.select(this).attr('class');

        let currShown = d3.selectAll('.card.' + currCategory)
        isShown(currShown,true);

        currShown.each(function(){ 

            let year = d3.select(this.parentNode).select('.year')
            isShown(year,true);
        });
    });

    // listener for scrolling to the top
    d3.select('#scrolltotop').on("click",function(){
        scrollToTop(500);
        isShown(d3.select('#scrolltotop'),currElTop < window.innerHeight);

    })

    // listener for hide/show scroll arrow
    d3.select(window).on('scroll', function(){
        let currElTop = d3.select('.row:nth-child(3) .year').node()
                            .getBoundingClientRect().top;
        isShown(d3.select('#scrolltotop'),currElTop < window.innerHeight);
    })
 
    // sine wave doodad

    const height = 100,
    width = 480,
    colors = ['cyan','magenta','yellow'],
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    // xRange = d3.range(0,2*Math.PI,Math.PI/10),
    xRange = d3.range(0,2.1*Math.PI,2*Math.PI/20),
    offset = .25 * Math.PI,
    hFactor = 10,
    yRange = d3.range(0,height,height/10).concat(d3.range(0,height,height/11).reverse()),
    data = xRange.map( (d,i) => [ d, 0] ),
    el = d3.select('svg'),
    blurb = d3.select('#blurb');

    let currData = data.slice(0),
        currMouseY = 0,
        timer;

    xScale.domain([0, 2*Math.PI])
        .range([0, width]);

    yScale.domain([0,height/hFactor])
        .range([height,0]);

    const sine = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(Math.sin(d[1])))
        .curve(d3.curveMonotoneX);

    const lines = el.selectAll('path')
        .data(colors)
        .enter()
        .append('path')
        .attr('id', d => d)
        .attr('d', sine(currData));

    lines.transition(t)
        .style('opacity',1)
        .call(function(d){
            d3.select('#blurb').classed('bordered',true);
        });

    function updatePath(reset = false) {

        lines.interrupt();

        lines.transition()
            .ease(d3.easeCircleOut)
            .duration(300)
            .attr('d', function(d,i) {
                let index = i;
                let yFactor = reset !== false ? 0 
                    : (height/10 - currMouseY)/hFactor - (Math.pow(-1,index) * index * offset);
                currData = xRange.map( (d,i) => [d, Math.sin(yRange[i] * yFactor)]);

                return sine(currData) 
                });  
    }

    function handleMove(d) {

        currMouseY = d3.mouse(el.node()) !== null ? d3.mouse(el.node())[1] : 0;
        updatePath();

        clearTimeout(timer);
        timer=setTimeout(handleMoveEnd,300);
    }

    function handleMoveEnd(d) {
        updatePath(true);
    }

    blurb.on('mousemove | touchmove', d => handleMove(d) );

}());