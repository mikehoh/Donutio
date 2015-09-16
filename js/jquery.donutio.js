/* Donutio 2.2 by Michael Hohlovich */
(function( $ ) {
  $.fn.donutio = function(params) {
    var options = $.extend({
      "multiple": true,
      "color": "#f00",
      "backColor": "#eee",
      "radius": 200,
      "width": 10,
      "padding": 10,
      "type": "donut",
      "active": 0
    }, params);

    var containerSize = (options.radius + options.padding) * 2;
    var dataLength = options.data.length;

    var sum = dataSum(options.data);
    var offsets = getDataPositions(options.data, sum);
    var gap = (360 - offsets.reduce(function(a, b){return a + b})) / dataLength;

    if (options.multiple) {
      for (i = 0; i < dataLength; i++) {
        drawChart(containerSize, gap, options, offsets, i, this);
      };
    } else {
      drawChart(containerSize, gap, options, offsets, options.active, this);
    };

    return this;
  };

  var drawChart = function(containerSize, gap, options, offsets, current, $wrap) {
    var $donutContainer = createContainer(containerSize);

    var svg = createSvgElement("svg");
    svg.setAttribute('width', containerSize);
    svg.setAttribute('height', containerSize);

    var dashoffset = 0,
        newoffset = 0;

    for (j = 0; j < options.data.length; j++) {
      dashoffset = newoffset + gap;
      newoffset = dashoffset + offsets[j];

      var path = createSvgElement("path");
      if (options.type == "donut") {
        path.setAttribute("stroke-width", options.width);
        path.setAttribute("fill", "none");
        if (j == current) {
          path.setAttribute("stroke", options.color);
        } else {
          path.setAttribute("stroke", options.backColor);
        }
      } else {
        path.setAttribute("stroke-width", 0);
        if (j == current) {
          path.setAttribute("fill", options.color);
        } else {
          path.setAttribute("fill", options.backColor);
        }
      }
      path.setAttribute("d", describeArc(options.type, Math.floor(containerSize / 2), Math.floor(containerSize / 2), options.radius, dashoffset, newoffset));
      svg.appendChild(path);
    }

    $donutContainer.append(svg);

    if ("text" in options.data[current]) {
      options.data[current].text.forEach(function(value, index){
        var $text = $("<span class='value-" + index + "' />").html(value);
        $donutContainer.append($text);
      });
    };

    $wrap.append($donutContainer);
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
      var percent = Math.floor(Math.abs(obj.value) / sum * 100);
      var offset = Math.ceil(360 / 100 * percent);
      offsets.push(offset);
    });
    return offsets;
  };

  var createContainer = function(size) {
    return $("<div class='donut' />").css({"width": size, "height": size});
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

})(jQuery);
