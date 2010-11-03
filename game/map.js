var map =
[
  [ -11, -14.8, -20.6, -4.1, 1, "whitewall", 0 ],
  [ -20.6, -4.1, -16.5, 5.2, 1, "whitewall", 14.375326083258077 ],
  [ -16.5, 5.2, -1.3, 9.2, 1, "whitewall", 24.53898684107561 ],
  [ 11.7, -18.8, -11, -14.8, 1, "whitewall", 80.42717040352525 ],
  [ 11.7, -18.8, 13.182623314829499, -14.893405233941317, 1, "whitewall", 80.42717040352525 ],
  [ 13.182623314829499, -14.893405233941317, 18.5, -17.1, 1, "whitewall", 84.60564555121647 ],
  [ 18.5, -17.1, 21.3, -9, 1, "whitewall", 90.36268952131019 ],
  [ 21.3, -9, 16.338918318794608, -6.576818398096749, 1, "whitewall", 98.93298706573653 ],
  [ 16.338918318794608, -6.576818398096749, 18, -2.1999999999999997, 1, "whitewall", 104.45423153808098 ],
  [ 18, -2.1999999999999997, 10.36489003880983, 2.3098576972833125, 1, "whitewall", 22.41539649437413 ],
  [ -1.3, 9.2, 5.506183699870634, 5.179767141009055, 1, "whitewall", 31.282962145059265 ],
  [ 10.36489003880983, 2.3098576972833125, 14.3, 8.4, 1, "whitewall", 0 ],
  [ 14.3, 8.4, 20.6, 10.1, 1, "whitewall", 7.250856754480633 ],
  [ 20.6, 10.1, 25.9, 7.7, 1, "whitewall", 13.776191994910814 ],
  [ 25.9, 7.7, 27.1, 3, 1, "whitewall", 19.594267278026354 ],
  [ 27.1, 3, 27.9, -2.7, 1, "whitewall", 24.445040412280317 ],
  [ 27.9, -2.7, 29.5, -6.7, 1, "whitewall", 30.200906984743582 ],
  [ 29.5, -6.7, 33.6, -9.2, 1, "whitewall", 34.50903883045119 ],
  [ 33.6, -9.2, 40, -10, 1, "whitewall", 39.31112171186838 ],
  [ 40, -10, 40, -20, 1, "whitewall", 45.76092791050722 ],
  [ 40, -20, 50, -20, 1, "whitewall", 55.76092791050722 ],
  [ 50, -20, 50, 0, 1, "whitewall", 65.76092791050722 ],
  [ 50, 0, 40, 0, 1, "whitewall", 85.76092791050722 ],
  [ 40, 0, 40, -7, 1, "whitewall", 95.76092791050722 ],
  [ 40, -7, 34.1, -5.9, 1, "whitewall", 102.76092791050722 ],
  [ 34.1, -5.9, 32, -3.9, 1, "whitewall", 108.76259434575668 ],
  [ 32, -3.9, 31.2, -0.3, 1, "whitewall", 111.66259434575669 ],
  [ 31.2, -0.3, 29.9, 6.5, 1, "whitewall", 115.35041212867384 ],
  [ 29.9, 6.5, 29.4, 9.3, 1, "whitewall", 122.27356170094222 ],
  [ 29.4, 9.3, 28.5, 10.7, 1, "whitewall", 125.11785423160781 ],
  [ 28.5, 10.7, 22.8, 13.1, 1, "whitewall", 126.78218592931712 ],
  [ 22.8, 13.1, 19.1, 13.2, 1, "whitewall", 132.96684436774362 ],
  [ 19.1, 13.2, 16.6, 12.8, 1, "whitewall", 136.66819547240797 ],
  [ 8.9, 8.1, 5.506183699870634, 5.179767141009055, 1, "whitewall", 148.24493500469612 ],
  [ 8.9, 8.1, 12.3, 11.4, 1, "whitewall", 0 ],
  [ 12.3, 11.4, 16.6, 12.8, 1, "whitewall", 4.738143096192855 ],
  [ 1, -7, 1, -6, 1, "whitewall", 0 ],
  [ 1, -6, 2, -6, 1, "whitewall", 1 ],
  [ 2, -6, 2, -7, 1, "whitewall", 2 ],
  [ 2, -7, 1, -7, 1, "whitewall", 3 ],
  [ 4, -13, 3, -12, 1, "whitewall", 0 ],
  [ 3, -12, 3, -11, 1, "whitewall", 1.4142135623730951 ],
  [ 3, -11, 4, -10, 1, "whitewall", 2.414213562373095 ],
  [ 4, -10, 5, -10, 1, "whitewall", 3.82842712474619 ],
  [ 5, -10, 6, -11, 1, "whitewall", 4.82842712474619 ],
  [ 6, -11, 6, -12, 1, "whitewall", 6.242640687119285 ],
  [ 6, -12, 5, -13, 1, "whitewall", 7.242640687119285 ],
  [ 5, -13, 4, -13, 1, "whitewall", 8.65685424949238 ],
];

var entities =
[
  { pos: [-3.3, 1.7], dir: [-0.9524241471993241, 0.3047757271037837], type: "guard" },
  { pos: [-5.55, -1.35], dir: [-0.9721742579200405, 0.23425885733013027], type: "guard" },
  { pos: [-6.95, -3.8], dir: [-0.9863939238321436, 0.16439898730535718], type: "guard" },
  { pos: [10.25, 1.05], dir: [0, 1], type: "healthpack" },
  { pos: [11.55, 0.25], dir: [0, 1], type: "healthpack" },
  { pos: [12.9, -0.8], dir: [0, 1], type: "healthpack" },
];
