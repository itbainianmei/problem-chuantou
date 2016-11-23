;(function(){
    function setFont(){
        var base = 0.625/375;//ipone6为基准 除以375
        document.querySelector('html').style.fontSize = document.documentElement.clientWidth * base + 'rem';
    }
    setFont();
})();