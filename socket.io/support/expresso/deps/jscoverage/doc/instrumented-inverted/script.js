/* automatically generated by JSCoverage - do not edit */
if (! top._$jscoverage) {
  top._$jscoverage = {};
}
var _$jscoverage = top._$jscoverage;
if (! _$jscoverage['script.js']) {
  _$jscoverage['script.js'] = [];
  _$jscoverage['script.js'][1] = 0;
  _$jscoverage['script.js'][2] = 0;
  _$jscoverage['script.js'][3] = 0;
  _$jscoverage['script.js'][4] = 0;
  _$jscoverage['script.js'][6] = 0;
  _$jscoverage['script.js'][7] = 0;
  _$jscoverage['script.js'][9] = 0;
  _$jscoverage['script.js'][10] = 0;
  _$jscoverage['script.js'][12] = 0;
  _$jscoverage['script.js'][13] = 0;
  _$jscoverage['script.js'][15] = 0;
  _$jscoverage['script.js'][16] = 0;
  _$jscoverage['script.js'][17] = 0;
  _$jscoverage['script.js'][18] = 0;
  _$jscoverage['script.js'][19] = 0;
}
_$jscoverage['script.js'][1]++;
function go(element) {
  _$jscoverage['script.js'][2]++;
  var message;
  _$jscoverage['script.js'][3]++;
  if (element.id === "radio1") {
    _$jscoverage['script.js'][4]++;
    message = "You selected the number 1.";
  }
  else {
    _$jscoverage['script.js'][6]++;
    if (element.id === "radio2") {
      _$jscoverage['script.js'][7]++;
      message = "You selected the number 2.";
    }
    else {
      _$jscoverage['script.js'][9]++;
      if (element.id === "radio3") {
        _$jscoverage['script.js'][10]++;
        message = "You selected the number 3.";
      }
      else {
        _$jscoverage['script.js'][12]++;
        if (element.id === "radio4") {
          _$jscoverage['script.js'][13]++;
          message = "You selected the number 4.";
        }
      }
    }
  }
  _$jscoverage['script.js'][15]++;
  var div = document.getElementById("request");
  _$jscoverage['script.js'][16]++;
  div.className = "black";
  _$jscoverage['script.js'][17]++;
  div = document.getElementById("result");
  _$jscoverage['script.js'][18]++;
  div.innerHTML = "<p>" + message + "</p>";
  _$jscoverage['script.js'][19]++;
  div.innerHTML += "<p>If you are running the instrumented version of this program, you can click the \"Coverage report\" button to view a coverage report.</p>";
}
_$jscoverage['script.js'].source = ["<span class=\"k\">function</span> go<span class=\"k\">(</span>element<span class=\"k\">)</span> <span class=\"k\">{</span>","  <span class=\"k\">var</span> message<span class=\"k\">;</span>","  <span class=\"k\">if</span> <span class=\"k\">(</span>element<span class=\"k\">.</span>id <span class=\"k\">===</span> <span class=\"s\">'radio1'</span><span class=\"k\">)</span> <span class=\"k\">{</span>","    message <span class=\"k\">=</span> <span class=\"s\">'You selected the number 1.'</span><span class=\"k\">;</span>","  <span class=\"k\">}</span>","  <span class=\"k\">else</span> <span class=\"k\">if</span> <span class=\"k\">(</span>element<span class=\"k\">.</span>id <span class=\"k\">===</span> <span class=\"s\">'radio2'</span><span class=\"k\">)</span> <span class=\"k\">{</span>","    message <span class=\"k\">=</span> <span class=\"s\">'You selected the number 2.'</span><span class=\"k\">;</span>","  <span class=\"k\">}</span>","  <span class=\"k\">else</span> <span class=\"k\">if</span> <span class=\"k\">(</span>element<span class=\"k\">.</span>id <span class=\"k\">===</span> <span class=\"s\">'radio3'</span><span class=\"k\">)</span> <span class=\"k\">{</span>","    message <span class=\"k\">=</span> <span class=\"s\">'You selected the number 3.'</span><span class=\"k\">;</span>","  <span class=\"k\">}</span>","  <span class=\"k\">else</span> <span class=\"k\">if</span> <span class=\"k\">(</span>element<span class=\"k\">.</span>id <span class=\"k\">===</span> <span class=\"s\">'radio4'</span><span class=\"k\">)</span> <span class=\"k\">{</span>","    message <span class=\"k\">=</span> <span class=\"s\">'You selected the number 4.'</span><span class=\"k\">;</span>","  <span class=\"k\">}</span>","  <span class=\"k\">var</span> div <span class=\"k\">=</span> document<span class=\"k\">.</span>getElementById<span class=\"k\">(</span><span class=\"s\">'request'</span><span class=\"k\">);</span>","  div<span class=\"k\">.</span>className <span class=\"k\">=</span> <span class=\"s\">'black'</span><span class=\"k\">;</span>","  div <span class=\"k\">=</span> document<span class=\"k\">.</span>getElementById<span class=\"k\">(</span><span class=\"s\">'result'</span><span class=\"k\">);</span>","  div<span class=\"k\">.</span>innerHTML <span class=\"k\">=</span> <span class=\"s\">'&lt;p&gt;'</span> <span class=\"k\">+</span> message <span class=\"k\">+</span> <span class=\"s\">'&lt;/p&gt;'</span><span class=\"k\">;</span>","  div<span class=\"k\">.</span>innerHTML <span class=\"k\">+=</span> <span class=\"s\">'&lt;p&gt;If you are running the instrumented version of this program, you can click the \"Coverage report\" button to view a coverage report.&lt;/p&gt;'</span><span class=\"k\">;</span>","<span class=\"k\">}</span>"];
