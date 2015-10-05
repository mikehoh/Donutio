/* Donutio 2.4.3 by Michael Hohlovich */
(function($) {

  var init = function(params) {
    return this.each(function(){
      var options = $.extend({
        "multiple": true,
        "color_negative": "#f00",
        "color_positive": "#0f0",
        "radius": 200,
        "width": 10,
        "padding": 10,
        "type": "donut",
        "active": 0,
        "percents": false,
        "colored_percents": false
      }, params);

      var containerSize = (options.radius + options.padding) * 2;
      var dataLength = options.data.length;

      var sum = dataSum(options.data);
      var correctedOffsets = getGapAndOffsets(getDataPositions(options.data, sum), dataLength);
      var gap = correctedOffsets[0];
      var offsets = correctedOffsets[1];

      if (options.multiple) {
        for (i = 0; i < dataLength; i++) {
          drawChart(containerSize, gap, options, offsets, i, $(this), sum);
        };
      } else {
        drawChart(containerSize, gap, options, offsets, options.active, $(this), sum);
      };
    });
  };

  var destroy = function() {
    return this.each(function(){
      var $donuts = $(this).find(".donut");
      $donuts.each(function(index, donut) {
        $(donut).off();
      });
      $(this).empty();
    });
  };

  var methods = {
    init: init,
    destroy: destroy
  };

  $.fn.donutio = function(options) {
    if (methods[options]) {
      return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof options === "object" || !options) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Method " + options + " does not exist on jQuery.Donutio");
    };
  };

  var drawChart = function(containerSize, gap, options, offsets, current, $wrap, sum) {
    var $donutContainer = createContainer(containerSize);

    var svg = createSvgElement("svg");
    svg.setAttribute('width', containerSize);
    svg.setAttribute('height', containerSize);

    var dashoffset = 0,
        newoffset = 0;

    for (j = 0; j < options.data.length; j++) {
      dashoffset = newoffset + gap;
      newoffset = dashoffset + offsets[j];
      var color = setColorsForValue(options, current);

      if (dashoffset == 0 && newoffset == 360) {
        var path = createSvgElement("circle");
        path.setAttribute("cx", containerSize / 2);
        path.setAttribute("cy", containerSize / 2);
        path.setAttribute("r", options.radius);
      } else {
        var path = createSvgElement("path");
        path.setAttribute("d", describeArc(options.type, Math.floor(containerSize / 2), Math.floor(containerSize / 2), options.radius, dashoffset, newoffset));
      };

      if (options.type == "donut") {
        path.setAttribute("stroke-width", options.width);
        path.setAttribute("fill", "none");
        if (j == current) {
          path.setAttribute("stroke", color.active);
        } else {
          path.setAttribute("stroke", color.muted);
        }
      } else {
        path.setAttribute("stroke-width", 0);
        if (j == current) {
          path.setAttribute("fill", color.active);
        } else {
          path.setAttribute("fill", color.muted);
        }
      }

      svg.appendChild(path);
    }

    $donutContainer.append(svg);

    if (options.percents) {
      var percent = (Math.round(Math.abs(options.data[current].value) / sum * 10000) / 100).toString() + "%";
      var $text = $("<span class='value-percent' />").html(percent);
      if (options.colored_percents) {
        $text.css("color", color.active);
      };
      $donutContainer.append($text);
    };

    if ("text" in options.data[current]) {
      options.data[current].text.forEach(function(value, index){
        $text = $("<span class='value-" + index + "' />").html(value);
        $donutContainer.append($text);
      });
    };

    if ("url" in options.data[current]) {
      var url = options.data[current].url;
      var $a = $("<a href='" + url + "' />").html($donutContainer);
      $wrap.append($a);
    } else {
      $wrap.append($donutContainer);
      if ($.isFunction(options.onclick)) {
        var callback = options.onclick;
        $donutContainer.on("click", function(event) {
          event.preventDefault();
          callback(options.data[current].id);
        });
      };
    };
  };

  var dataSum = function(data) {
    var sum = 0;
    data.forEach(function(obj, index){
      sum += Math.abs(obj.value);
    });
    return sum;
  };

  var getDataPositions = function(data, sum) {
    var offsets = [];
    data.forEach(function(obj, index){
      var percentFraction = Math.abs(obj.value) / sum * 100;
      var percent = Math.floor(percentFraction);
      if (percentFraction > 0.005 && percentFraction <= 1) {
        percent = 1;
      };
      var offset = Math.ceil(360 / 100 * percent);
      offsets.push(offset);
    });
    return offsets;
  };

  var getGapAndOffsets = function(offsets, dataLength) {
    var diff = 360 - offsets.reduce(function(a, b){return a + b});
    var gap =  diff / dataLength;
    if (gap < 1 || gap > 1.5) {
      var gap_diff = gap - 1.5;
      offsets = offsets.map(function(offset){return offset + gap_diff;});
      gap = 1.5;
    };
    if (offsets.length == 1) {
      offsets = [360];
      gap = 0;
    };
    return [gap, offsets];
  };

  var createContainer = function(size) {
    return $("<div class='donut' />").css({"width": size});
  };

  var createSvgElement = function(name) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (name == "svg") {
      elem.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    }
    return elem;
  };

  var describeArc = function(type, x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [];
    if (type == "donut") {
      d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
      ].join(" ");
    } else {
      d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
        "L", x,y,
        "L", start.x, start.y
      ].join(" ");
    }
    return d;
  };

  var polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  var setColorsForValue = function(options, current) {
    var value = options.data[current].value;
    if (value > 0) {
      return {
        active: options.color_positive,
        muted:  shadeBlendConvert(0.8, options.color_positive, "#fff")
      }
    } else {
      return {
        active: options.color_negative,
        muted:  shadeBlendConvert(0.8, options.color_negative, "#fff")
      }
    };
  };

  // function from http://stackoverflow.com/a/13542669
  var shadeBlendConvert = function(p, from, to) {
    if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(typeof(to)!="string"&&typeof(to)!="undefined"))return null; //ErrorCheck
    if(!this.sbcRip)this.sbcRip=function(d){
      var l=d.length,RGB=new Object();
      if(l>9){
        d=d.split(",");
        if(d.length<3||d.length>4)return null;//ErrorCheck
        RGB[0]=i(d[0].slice(4)),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
      }else{
        switch(l){case 8:case 6:case 3:case 2:case 1:return null;} //ErrorCheck
        if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 digit
        d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=l==9||l==5?r(((d>>24&255)/255)*10000)/10000:-1;
      }
      return RGB;}
    var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=sbcRip(from),t=sbcRip(to);
    if(!f||!t)return null; //ErrorCheck
    if(h)return "rgb("+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
    else return "#"+(0x100000000+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)*0x1000000+r((t[0]-f[0])*p+f[0])*0x10000+r((t[1]-f[1])*p+f[1])*0x100+r((t[2]-f[2])*p+f[2])).toString(16).slice(f[3]>-1||t[3]>-1?1:3);
  };

})(jQuery);
