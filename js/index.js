import ArtPiece from './ArtPiece.js';
import LocationFinder from './LocationFinder.js';

const items = [];
const locator = new LocationFinder();

async function fetchData() {
  const res = await fetch("https://opendata.brussels.be/api/records/1.0/search?dataset=street-art&rows=50");
  const data = await res.json();

  data.records.forEach(record => {
    const title = record.fields.artwork_name || "No title";
    const image = record.fields.image?.[0]?.url || "";
    const author = record.fields.artist_name || "Unknown";
    const lat = record.fields.geo_point_2d?.[0];
    const lon = record.fields.geo_point_2d?.[1];

    if (lat && lon) {
      const piece = new ArtPiece(title, image, author, lat, lon);
      items.push(piece);
    }
  });

  render();
}

function render(list = items) {
  const listDiv = document.getElementById("list");
  listDiv.innerHTML = "";
  list.forEach(item => {
    listDiv.innerHTML += item.htmlString();
  });
}

function onSearch(searchValue) {
  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );
  render(filtered);
}

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const val = document.getElementById("search").value;
  onSearch(val);
});

function init() {
  fetchData();
}

init();
