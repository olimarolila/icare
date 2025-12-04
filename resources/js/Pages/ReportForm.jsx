import { useEffect, useRef, useState } from "react";
import Navbar from "@/Components/Navbar";
import { router } from "@inertiajs/react";
import { loadLeaflet } from "@/utils/loadLeaflet";

export default function ReportForm({ auth }) {
    const categories = [
        {
            name: "Building & Facilities",
            desc: "e.g., damaged public buildings, waiting sheds",
        },
        {
            name: "Flood Control Works",
            desc: "e.g., drainage, clogged canals, dikes, flooding",
        },
        {
            name: "Parks & Public Spaces",
            desc: "e.g., playground equipment, benches, landscaping",
        },
        { name: "Road Works", desc: "e.g., potholes, damaged pavements" },
        {
            name: "Streetlights & Electrical",
            desc: "e.g., broken or missing streetlights, exposed wiring",
        },
        {
            name: "Traffic & Signage",
            desc: "e.g., missing road signs, damaged traffic lights",
        },
        {
            name: "Waste Management",
            desc: "e.g., uncollected garbage, illegal dumping",
        },
        {
            name: "Water Supply & Plumbing",
            desc: "e.g., leaks, broken pipes, low water pressure",
        },
        {
            name: "Others",
            desc: "if the concern doesn't fit the categories above",
        },
    ];

    const [selected, setSelected] = useState(categories[3]); // Default: Road Works
    const [subject, setSubject] = useState("");
    const DEFAULT_COORDS = { lat: 14.60852, lng: 120.99206 }; // Default: Frassati
    const [locationName, setLocationName] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [latitude, setLatitude] = useState(DEFAULT_COORDS.lat);
    const [longitude, setLongitude] = useState(DEFAULT_COORDS.lng);
    const [searching, setSearching] = useState(false);
    const [searchFeedback, setSearchFeedback] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const buildFallbackLabel = (lat, lng) =>
        `Pinned at ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    useEffect(() => {
        let isMounted = true;
        loadLeaflet().then((L) => {
            if (!isMounted || !mapContainerRef.current) {
                return;
            }
            const map = L.map(mapContainerRef.current).setView(
                [latitude, longitude],
                13
            );
            mapRef.current = map;
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
                maxZoom: 19,
            }).addTo(map);
            markerRef.current = L.marker([latitude, longitude]).addTo(map);
            map.on("click", ({ latlng }) => {
                setLatitude(latlng.lat);
                setLongitude(latlng.lng);
                reverseGeocode(latlng.lat, latlng.lng);
            });
        });
        return () => {
            isMounted = false;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markerRef.current) {
            return;
        }
        markerRef.current.setLatLng([latitude, longitude]);
        mapRef.current.setView([latitude, longitude]);
    }, [latitude, longitude]);

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            if (!response.ok) {
                setLocationName(buildFallbackLabel(lat, lng));
                setLocationQuery(buildFallbackLabel(lat, lng));
                return;
            }
            const data = await response.json();
            const label = data?.display_name ?? buildFallbackLabel(lat, lng);
            setLocationName(label);
            setLocationQuery(label);
        } catch (error) {
            console.error("Reverse geocode failed", error);
            const label = buildFallbackLabel(lat, lng);
            setLocationName(label);
            setLocationQuery(label);
        }
    };

    const handleSearch = async () => {
        if (!locationQuery.trim()) {
            setSearchFeedback("Enter a location to search.");
            return;
        }
        setSearching(true);
        setSearchFeedback("Searching...");
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
                    locationQuery
                )}&addressdetails=1&limit=5`
            );
            if (!response.ok) {
                throw new Error("Request failed");
            }
            const data = await response.json();
            setSearchResults(data);
            if (data.length === 0) {
                setSearchFeedback("No matches found.");
                return;
            }
            setSearchFeedback(`${data.length} result(s) found.`);
            applySearchResult(data[0]);
        } catch (error) {
            console.error(error);
            setSearchFeedback("Could not search location. Try again.");
        } finally {
            setSearching(false);
        }
    };

    const applySearchResult = (result) => {
        if (!result) {
            return;
        }
        const lat = Number(result.lat);
        const lng = Number(result.lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            setLatitude(lat);
            setLongitude(lng);
        }
        if (result.display_name) {
            setLocationName(result.display_name);
            setLocationQuery(result.display_name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!locationName || !latitude || !longitude) {
            alert("Please pick a location on the map or via search.");
            return;
        }
        const payload = {
            category: selected.name,
            street: locationName,
            location_name: locationName,
            latitude,
            longitude,
            subject,
            description,
            images: images.map((img) => img.file),
        };
        router.post(route("reports.store"), payload, {
            forceFormData: true,
            onSuccess: () => {
                setSubject("");
                setDescription("");
                setImages([]);
                setLocationName("");
                setLocationQuery("");
                setLatitude(DEFAULT_COORDS.lat);
                setLongitude(DEFAULT_COORDS.lng);
                alert("Report submitted successfully");
            },
        });
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: "url('/images/bg (reports).jpg')" }}
        >
            <Navbar auth={auth} />

            <main className="relative z-10 flex flex-col md:flex-row gap-10 items-start justify-start min-h-[80vh] px-8 md:px-20 lg:px-36 pt-20">
                {/* LEFT SIDE MOCKUP */}
                <section className="max-w-xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                        REPORT A <span className="text-red-400">PROBLEM</span>
                    </h1>

                    <div className="h-1 w-40 bg-white mt-4 mb-6"></div>

                    <p className="text-lg opacity-90 leading-relaxed max-w-md">
                        <strong>Heads up:</strong> All form submissions are
                        posted publicly. Help prioritize issues by upvoting
                        reports for barangay officials.
                    </p>

                    <img
                        src="/images/logo_cat.PNG"
                        alt="Mascot"
                        className="w-44 mt-8 select-none pointer-events-none"
                    />
                </section>

                {/* RIGHT SIDE FORM */}
                <form
                    className="w-full max-w-2xl text-black bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl"
                    onSubmit={handleSubmit}
                >
                    {/* CATEGORY */}
                    <label className="block mb-1 font-semibold text-white">
                        CATEGORY:
                    </label>
                    <select
                        className="w-full px-4 py-2 rounded-lg bg-white text-black shadow focus:outline-none"
                        value={selected.name}
                        onChange={(e) =>
                            setSelected(
                                categories.find(
                                    (c) => c.name === e.target.value
                                )
                            )
                        }
                    >
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <p className="text-sm italic text-white/80 mt-1 mb-5">
                        ({selected.desc})
                    </p>

                    {/* LOCATION SEARCH & MAP */}
                    <label className="block mb-1 font-semibold text-white">
                        Location of Concern (OpenStreetMap):
                    </label>
                    <div className="flex flex-col gap-3 mb-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 rounded-lg bg-white text-black shadow focus:outline-none"
                                placeholder="Search an address, barangay, or landmark"
                                value={locationQuery}
                                onChange={(e) =>
                                    setLocationQuery(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                                disabled={searching}
                                onClick={handleSearch}
                            >
                                {searching ? "Searching..." : "Search"}
                            </button>
                        </div>
                        {searchFeedback && (
                            <p className="text-sm text-white/70">
                                {searchFeedback}
                            </p>
                        )}
                        {searchResults.length > 1 && (
                            <div className="bg-white/20 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <button
                                        type="button"
                                        key={`${result.place_id}-${result.lon}`}
                                        className="text-left text-sm w-full bg-white/10 hover:bg-white/20 rounded-md px-3 py-2"
                                        onClick={() =>
                                            applySearchResult(result)
                                        }
                                    >
                                        {result.display_name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div
                        ref={mapContainerRef}
                        className="w-full h-64 rounded-xl overflow-hidden border border-white/30"
                    ></div>
                    <p className="text-sm text-white/80 mt-2">
                        Selected:{" "}
                        {locationName || "Tap the map or search to set"}
                    </p>
                    <p className="text-xs text-white/60">
                        Lat: {latitude?.toFixed(5)} | Lng:{" "}
                        {longitude?.toFixed(5)}
                    </p>

                    {/* MAIN SUBJECT */}
                    <label className="block mt-5 mb-1 font-semibold text-white">
                        Main Subject:
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg mb-4 bg-white text-black shadow focus:outline-none"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    {/* DESCRIPTION */}
                    <label className="block mb-1 font-semibold text-white">
                        Description:
                    </label>
                    <textarea
                        maxLength={100}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 h-32 rounded-lg bg-white text-black shadow focus:outline-none"
                    ></textarea>

                    <p className="text-right text-white/70 text-sm">
                        {description.length}/100
                    </p>

                    {/* IMAGE UPLOAD */}
                    <label className="block mb-1 font-semibold text-white mt-3">
                        Upload Images (max 6):
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="uploadInput"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);

                            // Limit to 6 images
                            if (images.length + files.length > 6) {
                                alert("You can only upload up to 6 images.");
                                return;
                            }

                            const newPreviews = files.map((file) => ({
                                file,
                                url: URL.createObjectURL(file),
                            }));

                            setImages((prev) => [...prev, ...newPreviews]);
                        }}
                    />

                    <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 transition ${
                            isDragging
                                ? "border-green-400 bg-white/20"
                                : "border-blue-300"
                        } text-white/80`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);

                            const files = Array.from(
                                e.dataTransfer.files
                            ).filter((f) => f.type.startsWith("image/"));

                            if (images.length + files.length > 6) {
                                alert("You can only upload up to 6 images.");
                                return;
                            }

                            const dropped = files.map((file) => ({
                                file,
                                url: URL.createObjectURL(file),
                            }));

                            setImages((prev) => [...prev, ...dropped]);
                        }}
                    >
                        <p className="text-sm flex items-center justify-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                />
                            </svg>
                            Drag and drop images here
                        </p>

                        <p className="text-sm text-center my-1">—— OR ——</p>

                        <label
                            htmlFor="uploadInput"
                            className="cursor-pointer text-sm underline block text-center"
                        >
                            Browse files
                        </label>

                        {/* PREVIEW GRID */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative w-full h-24 rounded-lg overflow-hidden border border-white/30"
                                    >
                                        {/* Image */}
                                        <img
                                            src={img.url}
                                            className="w-full h-full object-cover"
                                            alt={`preview-${index}`}
                                        />

                                        {/* DELETE BUTTON */}
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow"
                                            onClick={() =>
                                                setImages((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg"
                    >
                        SUBMIT
                    </button>
                </form>
            </main>
        </div>
    );
}
