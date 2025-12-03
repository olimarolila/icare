import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let leafletPromise;

export function loadLeaflet() {
    if (!leafletPromise) {
        leafletPromise = import("leaflet").then((module) => {
            const L = module.default;
            if (L && L.Icon && L.Icon.Default) {
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: markerIcon2x,
                    iconUrl: markerIcon,
                    shadowUrl: markerShadow,
                });
            }
            return L;
        });
    }
    return leafletPromise;
}
