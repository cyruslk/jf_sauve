const paths = [
  ["M83.88,77.57S2713.35,233,1530.08,820.12,642.93,388.4,642.93,388.4"],
  ["M240.22,104.5s2230,308.15,1139,758.46-1248-584.52,204-758.46"],
  ["M169.74,70.94s2584,147,1144,764-740-604-740-604"]
];

export default function getRandomPathIndex() {
  return paths[Math.floor(Math.random() * ((paths.length - 1) - 0 + 1))];
}
