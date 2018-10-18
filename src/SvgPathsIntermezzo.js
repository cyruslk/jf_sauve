const paths = [
  ["M42.28,978.06S189.39-336.67,745.15,255,336.51,698.53,336.51,698.53"],
  ["M597,52.5c0,538.92-104.66,975-234,975"],
  ["M87,982.25s786-1990.12,786,0"],
];

export default function getRandomPathIntermezzo() {
  return paths[Math.floor(Math.random() * ((paths.length - 1) - 0 + 1))];
}
