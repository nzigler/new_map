import fs from "fs";
import turf from "@turf/turf";
import neighborhoods from "../data/scc_catchments.json";
import lid from "../data/scc_lid_pts_wgs3.json";


let output = turf.collect(neighborhoods, lid, 'Final_Area', 'TotalArea');

output.features = output.features.filter(function(feature, i) {
   feature.id = i;
   feature.properties.TotalArea = feature.properties.TotalArea.reduce(function(value, total) {
     return value + total;
   }, 0);
   return feature.properties.TotalArea > 0;
});



output = JSON.stringify(output, null, "\t");
fs.writeFile("../data/outupt.json", output, function(err) {
	if (err) throw err;

  console.log("success. 👍");
});
