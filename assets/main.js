$( function(){

    let currCategory = 0;

    $('#blurb span').on('click',function(d){
        $('.card.show,.year.show').removeClass('show');
        currCategory = $(d.currentTarget).attr('class');
        $('.card.' + currCategory).addClass('show');
        $('.section .card.show').parent().find('.year').addClass('show');
    });

});