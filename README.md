Donutio 2.5.2
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
    color_negative: "#D2494B",
    color_positive: "#55A647",
    color_zero: "#ccc",
    percents: true,
    colored_percents: true
  });
```

Where is data is an array of objects with keys – value, text, url, id.
Value must contain a number (ex. 12, -50, 38...).
Text is array of strings (ex. ["Label", "100", "<span>23</span>", ...])
It can contain html tags.
Each string will be placed into a separate html tag with unique class name.
Url - if it exists, the donut container will be wrapped into link with indicated url.
Id - should contain any unique data about current object.

Type - "donut" or "pie", see example on preview

Multiple - indicates that each data item should be drawn separately. By default true.
In case of false, you have to add the parameter "active" with data item array index.
For example, active: 2.

Radius - radius of donut chart

Width - donut line width. Don't need to indicate this parameter if you want pie-chart.

Padding - the distance between chart and its container

color_negative - highlighted segment color with negative value

color_positive - highlighted segment color with positive value

color_zero - segment color for zero value

Percents - If true, it calculates percents to show, depending on given values in data.

Colored-percents - true/false, makes coloured percent value (color depends on value)

onclick - callback function, accepts item argument with value from id key.


**Data example**

```
[
  {
    value: -628,
    text: ["46%", "-628.<span>00</span>", "Groceries"]
  },
  {
    value: -310,
    text: ["28%", "-310.<span>00</span>", "Cafe and restaurants"],
    id: "310-Cafes"
  },
  {
    value: -186,
    text: ["20%", "-186.<span>00</span>", "Lunches"]
  },
  {
    value: -100,
    text: ["6%", "-628.<span>00</span>", "Alcohol and bars"],
    url: "#bars"
  }
]
```

The plugin will draw four donut charts with text and highlighted value segment.
(if multiple:true or without multiple option)
