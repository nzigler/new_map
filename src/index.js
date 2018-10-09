import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";

let map; //do not use "var". only const if the value is never going to change again

async function init() {
    const custom = await import("./custom-style.json");
    const style = map.getStyle();
    const catchments = await import("../data/scc_catchments.json");
    const lid = await import("../data/scc_lid_pts_wgs3.json");

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("catchments").setData(catchments);
    map.getSource("catchments").setData(catchments);
    map.getSource("lid").setData(lid);

}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);
