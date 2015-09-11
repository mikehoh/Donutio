/* Donutio 1.0 by Michael Hohlovich */
(function( $ ) {
  $.fn.donutio = function(params) {
    var options = $.extend({
      "multiple": true,
      "color": "#f00",
      "backColor": "#eee",
      "radius": 200,
      "width": 10,
      "padding": 10
    }, params);

    var containerSize = (options.radius + options.padding) * 2;
    var dataLength = options.data.length;
    var circumference = 2 * 3.14 * options.radius;

    var sum = 0;
    options.data.forEach(function(obj, index){
      sum += Math.abs(obj.value);
    });

    var offsets = [];
    options.data.forEach(function(obj, index){
      var percent = Math.floor(Math.abs(obj.value) / sum * 100);
      var offset = Math.floor(circumference / 100 * percent);
      offsets.push(offset);
    });
    offsets.shift();
    offsets.push(0);
    offsets.reverse();

    for (i = 0; i < dataLength; i++) {
      var $donutContainer = $("<div class='donut' />").css({"width": containerSize, "height": containerSize});
      this.append($donutContainer);

      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute('width', containerSize);
      svg.setAttribute('height', containerSize);
      svg.setAttribute("style", "transform: rotate(-90deg)");
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

      var dashoffset = 0;
      for (j = 0; j < dataLength; j++) {
        dashoffset += offsets[j];
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", options.radius);
        circle.setAttribute("cx", Math.floor(containerSize / 2));
        circle.setAttribute("cy", Math.floor(containerSize / 2));
        circle.setAttribute("stroke-width", options.width);
        if (dataLength - j - 1 == i) {
          circle.setAttribute("stroke", options.color);
        } else {
          circle.setAttribute("stroke", options.backColor);
        }
        circle.setAttribute("fill", "none");
        circle.setAttribute("style", "stroke-dasharray: " + circumference + "; stroke-dashoffset: " + dashoffset);
        g.appendChild(circle);
        svg.appendChild(g);
      }

      $donutContainer.append(svg);

      options.data[i].text.forEach(function(value, index){
        var $text = $("<span class='value-" + index + "' />").html(value);
        $donutContainer.append($text);
      });
    };

    return this;
  };
})(jQuery);
