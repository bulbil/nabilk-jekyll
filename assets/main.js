
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

(function () {

    let currCategory = 0;
    const t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

    function isShown(el,show) {
        let opacity = show ? 1 : 0;
        el.transition(t)
        .style('opacity', opacity);
        el.classed('show',show);
    }

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
    })

    // listener for hide/show scroll arrow
    d3.select(window).on('scroll', function(){
        let currElTop = document.querySelector('.section:nth-child(3)')
                            .getBoundingClientRect().top;
        console.log(currElTop < window.innerHeight)
        d3.select('#scrolltotop')
            .classed('show',currElTop < window.innerHeight);
    })

}());