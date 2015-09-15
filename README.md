Donutio 2.1
=====

jQuery.Donutio - plugin that draws donut charts.

**Using example**

```
  $("#wrap").donutio({
    multiple: true,
    type: "donut",
    data: data,
    radius: 70,
    width: 10,
    padding: 10,
    color: "#D2494B",
    backColor: "#F5DADA"
  });
```

Where is data is an array of objects with two keys – value and text.
Value must contain a number (ex. 12, -50, 38...).
Text is array of strings (ex. ["Label", "100", "<span>23</span>", ...])
It can contain html tags.
Each string will be placed into a separate html tag with unique class name.

Type - "donut" or "pie", see example on preview

Multiple - indicates that each data item should be drawn separately. By default true.
In case of false, you have to add the parameter "active" with data item array index.
For example, active: 2.

Radius - radius of donut chart

Width - donut line width. Don't need to indicate this parameter if you want pie-chart.

Padding - the distance between chart and its container

Color - highlighted segment color

backColor - non-active segments color


**Data example**

```
[
  {
    value: -628,
    text: ["46%", "-628.<span>00</span>", "Groceries"]
  },
  {
    value: -310,
    text: ["28%", "-310.<span>00</span>", "Cafe and restaurants"]
  },
  {
    value: -186,
    text: ["20%", "-186.<span>00</span>", "Lunches"]
  },
  {
    value: -100,
    text: ["6%", "-628.<span>00</span>", "Alcohol and bars"]
  }
]
```

The plugin will draw four donut charts with text and highlighted value segment.
(if multiple:true or without multiple option)
