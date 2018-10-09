import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";

let map; //do not use "var". only const if the value is never going to change again

async function init() {
    const custom = await import("./custom-style.json");
    const style = map.getStyle();
    const catchments = await import("../data/outupt.json");
    const lid = await import("../data/scc_lid_pts_wgs3.json");

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("catchments").setData(catchments);
    map.getSource("lid").setData(lid);

    initLegend();
    initPopup();

}

let hovered;
const popup = document.querySelector('#popup');
function initPopup() {
    const nameSpan = document.querySelector('#name');
    const countSpan = document.querySelector('#count');

    map.on('mousemove', 'catchments', function(e) {
        clearHover();
        if (e.features.length > 0) {
            hovered = e.features[0];
            map.setFeatureState(hovered, {
                'hover': true
            });
            popup.style.display = 'block';

            nameSpan.textContent = hovered.properties.DIST_CODE;
            countSpan.textContent = hovered.properties.TotalArea;
        }
    });

    map.on('mouseleave', 'neighborhoods', clearHover)
}

function clearHover() {
    if (hovered) {
        map.setFeatureState(hovered, {
            'hover': false
        });
    }
    popup.style.display = 'none';
    hovered = null;
}

function initLegend() {
    const legend = document.querySelector('#legend');
    const template = document.querySelector('#legend-entry');

    const colors = map.getPaintProperty(
        'catchments',
        'fill-extrusion-color'
    ).stops;

    colors.forEach(function(color, i) {
        const entry = document.importNode(template.content, true);
        const colorSpan = entry.querySelector('.color');
        const valueSpan = entry.querySelector('.value');

        colorSpan.style.backgroundColor = color[1]

        if (colors.length === i+1) {
            valueSpan.textContent = `>=${color[0]}`;
        } else {
            valueSpan.textContent = `${color[0]}-${colors[i+1][0]-1}`;
        }

        legend.appendChild(entry);
    });
}

mapboxgl.accessToken = settings.accessToken;

settings.customAttribution = document.querySelector('#attribution').innerHTML;

map = new mapboxgl.Map(settings);
map.on("load", init);
