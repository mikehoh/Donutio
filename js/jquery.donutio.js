/* Donutio 2.0 by Michael Hohlovich */
(function( $ ) {
  $.fn.donutio = function(params) {
    var options = $.extend({
      "multiple": true,
      "color": "#f00",
      "backColor": "#eee",
      "radius": 200,
      "width": 10,
      "padding": 10,
      "type": "donut"
    }, params);

    var containerSize = (options.radius + options.padding) * 2;
    var dataLength = options.data.length;

    var sum = 0;
    options.data.forEach(function(obj, index){
      sum += Math.abs(obj.value);
    });

    var offsets = [];
    options.data.forEach(function(obj, index){
      var percent = Math.floor(Math.abs(obj.value) / sum * 100);
      var offset = Math.ceil(360 / 100 * percent);
      offsets.push(offset);
    });

    var gap = (360 - offsets.reduce(function(a, b){return a + b})) / (dataLength - 1);

    for (i = 0; i < dataLength; i++) {
      var $donutContainer = $("<div class='donut' />").css({"width": containerSize, "height": containerSize});
      this.append($donutContainer);

      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute('width', containerSize);
      svg.setAttribute('height', containerSize);
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

      var dashoffset = 0,
          newoffset = 0;

      for (j = 0; j < dataLength; j++) {
        dashoffset = newoffset + gap;
        newoffset = dashoffset + offsets[j];

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        if (options.type == "donut") {
          path.setAttribute("stroke-width", options.width);
          path.setAttribute("fill", "none");
          if (j == i) {
            path.setAttribute("stroke", options.color);
          } else {
            path.setAttribute("stroke", options.backColor);
          }
        } else {
          path.setAttribute("stroke-width", 0);
          if (j == i) {
            path.setAttribute("fill", options.color);
          } else {
            path.setAttribute("fill", options.backColor);
          }
        }
        path.setAttribute("d", describeArc(options.type, Math.floor(containerSize / 2), Math.floor(containerSize / 2), options.radius, dashoffset, newoffset));
        svg.appendChild(path);
      }

      $donutContainer.append(svg);

      options.data[i].text.forEach(function(value, index){
        var $text = $("<span class='value-" + index + "' />").html(value);
        $donutContainer.append($text);
      });
    };

    return this;
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
