console.log("hello this injected script")
var clickCount = 0
var scrollCount = 0
var keyCount = 0
var lordID = new Date().getTime()

var focused = true;
var startTime = new Date().getTime()
var endTime
window.onfocus = function() {
    focused = true;
    startTime = new Date().getTime()
    console.log("focus in")
    ref(10000)
};
window.onblur = function() {
    focused = false;
    startSubmit()
};
document.addEventListener('scroll', function(e) {
    scrollCount++

}, true);

window.onclick = function() {
    clickCount++
};
window.onkeypress = function() {
    keyCount++
};

window.ondblclick = function() {
    startSubmit()
};
ref(10000)

function ref(t) {
    setTimeout(function() {
        startSubmit()
    }, t);
}

function getDuration() {
    var d = ((new Date().getTime() - startTime) / 1000)
    startTime = new Date().getTime()
    return d
}


function startSubmit() {

    if (clickCount > 1 || keyCount > 1 || scrollCount > 1) {
        var v = JSON.stringify({
            host: window.location.host,
            page: window.location.href,
            clicked: clickCount,
            keyPressed: keyCount,
            scrol: scrollCount,
            duration: getDuration()
        })
        submit(v);
        ref(15000)
        clickCount = 0
        scrollCount = 0
        keyCount = 0
    } else {
        if (focused) {
            ref(10000)
        } else {

        }
        console.log("No action " + focused)
    }
}

function submit(values) {
    console.log(values)
    fetch('http://localhost:3000/test', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', } // json format sending
            ,
            body: values

        }).then(result => {})
        .catch(error => console.error(error))







}




/*
      var d = document
      var f = d.createElement('form');
      f.action = 'http://http://127.0.0.1:3000/test?bm';
      f.method = 'post';
      f.appendChild(values);
      d.body.appendChild(f);
      f.submit();



      
  data = new FormData()
  data.set('Foo', 1)
  data.set('Bar', 'boo')

  let request = new XMLHttpRequest();
  request.open("POST", 'http://localhost:3000/test', true);
  request.send(data)

        */