// adds funloader.js library into the examples.html via self-invoking function
// (function(){
//     var script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = 'funloader.js';
//     document.getElementsByTagName('head')[0].appendChild(script);    
// })();

// aaand i just realized its not needed since it has to be loaded before this one

// test that i can run a funloader.js function with
logDate();

function startLoadingSomething(){
    
}
