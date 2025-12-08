import Navbar from "@/Components/Navbar";
import { Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { loadLeaflet } from "@/utils/loadLeaflet";
import Footer from "@/Components/Footer";
import FlashMessages from "@/Components/FlashMessages";

// Utility: normalize subject casing for consistent display
const formatSubject = (text = "") => {
    const trimmed = text?.toString().trim();
    if (!trimmed) return "";
    return trimmed
        .toLowerCase()
        .replace(/\b([a-z])/g, (match, chr) => chr.toUpperCase());
};

const REPORT_CATEGORIES = [
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
    { name: "Others", desc: "if the concern doesn't fit the categories above" },
];

// Collapsible Report Form component embedded in Reports page
const CollapsibleReportForm = ({ auth, setShowBanModal }) => {
    const categories = REPORT_CATEGORIES;

    const [selected, setSelected] = useState(null);
    const [subject, setSubject] = useState("");
    const DEFAULT_COORDS = { lat: 14.60852, lng: 120.99206 };
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
    const [errors, setErrors] = useState({});
    const isLoggedIn = Boolean(auth?.user);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    // Helper: accept only locations whose resolved name contains "Philippines"
    const isWithinPhilippines = (name) => {
        if (!name || typeof name !== "string") return false;
        return name.toLowerCase().includes("philippines");
    };

    const buildFallbackLabel = (lat, lng) =>
        `Pinned at ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    useEffect(() => {
        let isMounted = true;
        loadLeaflet().then((L) => {
            if (!isMounted || !mapContainerRef.current) return;
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
            map.on("click", async ({ latlng }) => {
                if (!isLoggedIn) return;
                const { displayName, fallbackName } = await reverseGeocode(
                    latlng.lat,
                    latlng.lng
                );
                const resolved = displayName || fallbackName || "";
                setLatitude(latlng.lat);
                setLongitude(latlng.lng);
                setLocationName(resolved);
                setLocationQuery(resolved);
                if (errors.location) {
                    setErrors((prev) => ({ ...prev, location: undefined }));
                }
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
        if (
            !mapRef.current ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return;
        }
        if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
        }
        mapRef.current.setView(
            [latitude, longitude],
            mapRef.current.getZoom() || 13,
            {
                animate: true,
            }
        );
    }, [latitude, longitude]);

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const fallbackName = buildFallbackLabel(lat, lng);
            if (!response.ok) {
                setLocationName(fallbackName);
                setLocationQuery(fallbackName);
                return { displayName: null, fallbackName };
            }
            const data = await response.json();
            const displayName = data?.display_name ?? null;
            const label = displayName ?? fallbackName;
            setLocationName(label);
            setLocationQuery(label);
            return { displayName, fallbackName };
        } catch (error) {
            const fallbackName = buildFallbackLabel(lat, lng);
            setLocationName(fallbackName);
            setLocationQuery(fallbackName);
            return { displayName: null, fallbackName };
        }
    };

    const handleSearch = async () => {
        if (!isLoggedIn) {
            setSearchFeedback("Please log in to set a location.");
            return;
        }
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
            if (!response.ok) throw new Error("Request failed");
            const data = await response.json();
            setSearchResults(data);
            if (data.length === 0) {
                setSearchFeedback("No matches found.");
                return;
            }
            setSearchFeedback(`${data.length} result(s) found.`);
            applySearchResult(data[0]);
        } catch (error) {
            setSearchFeedback("Could not search location. Try again.");
        } finally {
            setSearching(false);
        }
    };

    const applySearchResult = (result) => {
        if (!result) return;
        const lat = Number(result.lat);
        const lng = Number(result.lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            setLatitude(lat);
            setLongitude(lng);
        }
        if (result.display_name) {
            const name = result.display_name;
            setLocationName(name);
            setLocationQuery(name);
        }
        if (errors.location) {
            setErrors((prev) => ({ ...prev, location: undefined }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setErrors({ auth: "Please log in to submit a report." });
            router.reload({
                only: ["flash"],
                preserveScroll: true,
                preserveState: true,
            });
            return;
        }

        if (auth?.user?.banned || auth?.user?.report_banned) {
            setShowBanModal(true);
            return;
        }

        const newErrors = {};
        if (!selected?.name) newErrors.category = "Please select a category.";
        if (!subject.trim()) newErrors.subject = "Please enter a main subject.";
        if (
            !locationName ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            newErrors.location =
                "Please pick a location on the map or via search.";
        } else if (!isWithinPhilippines(locationName)) {
            newErrors.location = "Reports must be within Philippines only.";
        }
        if (!description.trim())
            newErrors.description = "Please enter a description.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
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
            preserveScroll: true,
            onSuccess: () => {
                setSubject("");
                setDescription("");
                setImages([]);
                setLocationName("");
                setLocationQuery("");
                setLatitude(DEFAULT_COORDS.lat);
                setLongitude(DEFAULT_COORDS.lng);
            },
        });
    };

    return (
        <div className="w-full mx-auto mb-8 md:sticky md:top-6">
            <div className="bg-neutral-900/90 border border-white/10 rounded-xl shadow-lg">
                <div className="px-6 pt-6 pb-6">
                    {/* Prominent header to highlight the form */}
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                            REPORT A{" "}
                            <span className="text-red-400">PROBLEM</span>
                        </h1>
                        <div className="h-1 w-32 md:w-40 bg-white mt-4 mb-4"></div>
                        <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-md">
                            <strong>Heads up:</strong> All form submissions are
                            posted publicly. Help prioritize issues by upvoting
                            reports for barangay officials.
                        </p>
                    </div>
                    {/* Auth notice */}
                    {!isLoggedIn && (
                        <div className="mb-4 p-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-200">
                            You must be logged in to submit a report.{"  "}
                            <Link
                                href={route("login")}
                                className="underline font-semibold"
                            >
                                Log in
                            </Link>
                            {"  "}
                            or{"  "}
                            <Link
                                href={route("register")}
                                className="underline font-semibold"
                            >
                                Register
                            </Link>
                            .
                        </div>
                    )}
                    {/* Ban notice */}
                    {isLoggedIn &&
                        (auth?.user?.banned || auth?.user?.report_banned) && (
                            <div className="mb-4 p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200">
                                <p className="font-semibold mb-2">
                                    Your account has been restricted
                                </p>
                                <p className="mb-3">
                                    {auth?.user?.banned
                                        ? "You are currently banned from the platform and cannot post reports."
                                        : "You are currently banned from posting reports."}{" "}
                                    <button
                                        onClick={() => setShowBanModal(true)}
                                        className="underline font-semibold text-red-300 hover:text-red-200"
                                    >
                                        Click here to view details
                                    </button>
                                    .
                                </p>
                            </div>
                        )}

                    {/* Subheading with attention icon */}
                    <form
                        className="w-full text-black bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <label className="block mb-1 font-semibold text-white">
                            CATEGORY <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full px-4 py-2 rounded-lg bg-white text-black shadow focus:outline-none"
                            value={selected?.name || ""}
                            onChange={(e) => {
                                const next =
                                    categories.find(
                                        (c) => c.name === e.target.value
                                    ) || null;
                                setSelected(next);
                                if (errors.category) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        category: undefined,
                                    }));
                                }
                            }}
                            disabled={
                                !isLoggedIn ||
                                auth?.user?.banned ||
                                auth?.user?.report_banned
                            }
                            aria-invalid={Boolean(errors.category)}
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.name} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {/* Removed helper text under category as requested */}
                        {errors.category && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.category}
                            </p>
                        )}
                        <div className="mb-3" />

                        <label className="block mb-1 font-semibold text-white">
                            Location of Concern{" "}
                            <span className="text-red-500">*</span>
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
                                    disabled={
                                        !isLoggedIn ||
                                        auth?.user?.banned ||
                                        auth?.user?.report_banned
                                    }
                                />
                                <button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                                    disabled={
                                        searching ||
                                        !isLoggedIn ||
                                        auth?.user?.banned ||
                                        auth?.user?.report_banned
                                    }
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
                                <div className="bg-white rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto shadow-lg border border-gray-300">
                                    {searchResults.map((result) => (
                                        <button
                                            type="button"
                                            key={`${result.place_id}-${result.lon}`}
                                            className="text-left text-sm w-full bg-gray-100 hover:bg-blue-100 rounded-md px-4 py-3 text-gray-800 font-medium transition"
                                            onClick={() =>
                                                applySearchResult(result)
                                            }
                                            disabled={
                                                !isLoggedIn ||
                                                auth?.user?.banned ||
                                                auth?.user?.report_banned
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
                        {errors.location && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.location}
                            </p>
                        )}

                        <label className="block mt-5 mb-1 font-semibold text-white">
                            Main Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg mb-4 bg-white text-black shadow focus:outline-none"
                            value={subject}
                            onChange={(e) => {
                                setSubject(e.target.value);
                                if (errors.subject)
                                    setErrors((prev) => ({
                                        ...prev,
                                        subject: undefined,
                                    }));
                            }}
                            maxLength={80}
                            disabled={!isLoggedIn}
                            aria-invalid={Boolean(errors.subject)}
                        />
                        {errors.subject && (
                            <p className="text-red-400 text-sm -mt-3 mb-3">
                                {errors.subject}
                            </p>
                        )}

                        <label className="block mb-1 font-semibold text-white">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            maxLength={100}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description)
                                    setErrors((prev) => ({
                                        ...prev,
                                        description: undefined,
                                    }));
                            }}
                            className="w-full px-4 py-2 h-32 rounded-lg bg-white text-black shadow focus:outline-none"
                            disabled={!isLoggedIn}
                            aria-invalid={Boolean(errors.description)}
                        ></textarea>
                        <p className="text-right text-white/70 text-sm">
                            {description.length}/100
                        </p>
                        {errors.description && (
                            <p className="text-red-400 text-sm mt-1 mb-2">
                                {errors.description}
                            </p>
                        )}

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
                                if (
                                    !isLoggedIn ||
                                    auth?.user?.banned ||
                                    auth?.user?.report_banned
                                )
                                    return;
                                const files = Array.from(e.target.files);
                                if (images.length + files.length > 6) {
                                    alert(
                                        "You can only upload up to 6 images."
                                    );
                                    return;
                                }
                                const newPreviews = files.map((file) => ({
                                    file,
                                    url: URL.createObjectURL(file),
                                }));
                                setImages((prev) => [...prev, ...newPreviews]);
                            }}
                            disabled={
                                !isLoggedIn ||
                                auth?.user?.banned ||
                                auth?.user?.report_banned
                            }
                        />

                        <div
                            className={`w-full border-2 border-dashed rounded-lg p-4 transition ${
                                isDragging
                                    ? "border-green-400 bg-white/20"
                                    : "border-blue-300"
                            } text-white/80`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                if (
                                    !isLoggedIn ||
                                    auth?.user?.banned ||
                                    auth?.user?.report_banned
                                )
                                    return;
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (
                                    !isLoggedIn ||
                                    auth?.user?.banned ||
                                    auth?.user?.report_banned
                                )
                                    return;
                                const files = Array.from(
                                    e.dataTransfer.files
                                ).filter((f) => f.type.startsWith("image/"));
                                if (images.length + files.length > 6) {
                                    alert(
                                        "You can only upload up to 6 images."
                                    );
                                    return;
                                }
                                const dropped = files.map((file) => ({
                                    file,
                                    url: URL.createObjectURL(file),
                                }));
                                setImages((prev) => [...prev, ...dropped]);
                            }}
                            aria-disabled={
                                !isLoggedIn ||
                                auth?.user?.banned ||
                                auth?.user?.report_banned
                            }
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
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                    {images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/30"
                                        >
                                            <img
                                                src={img.url}
                                                className="w-full h-full object-cover"
                                                alt={`preview-${index}`}
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow"
                                                onClick={() =>
                                                    setImages((prev) =>
                                                        prev.filter(
                                                            (_, i) =>
                                                                i !== index
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

                        <button
                            type="submit"
                            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
                            disabled={
                                !isLoggedIn ||
                                auth?.user?.banned ||
                                auth?.user?.report_banned
                            }
                        >
                            SUBMIT
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const ReportCard = ({ report, auth }) => {
    const DEFAULT_ZOOM = 15;
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const bodyOverflowRef = useRef("");
    const reportActionRef = useRef(null);
    const [reportPopupOpen, setReportPopupOpen] = useState(false);
    const submittedDate = report.submitted_at
        ? new Date(report.submitted_at)
        : null;
    const dateStr = submittedDate ? submittedDate.toLocaleDateString() : "—";
    const timeStr = submittedDate
        ? submittedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";
    const images = Array.isArray(report.images) ? report.images : [];
    const latitude =
        report.latitude !== null && report.latitude !== undefined
            ? Number(report.latitude)
            : null;
    const longitude =
        report.longitude !== null && report.longitude !== undefined
            ? Number(report.longitude)
            : null;
    const hasCoordinates =
        Number.isFinite(latitude) && Number.isFinite(longitude);
    const locationLabel =
        report.location_name || report.street || "Location not specified";
    const isUpvoted = report.user_vote === 1;
    const isDownvoted = report.user_vote === -1;
    const votePillClass = [
        "flex items-center gap-3 rounded-full px-4 py-2",
        isUpvoted
            ? "bg-[#d93900]"
            : isDownvoted
            ? "bg-[#6a5cff]"
            : "bg-black/40",
    ].join(" ");

    const statusBadgeClass =
        {
            Resolved: "bg-green-600 text-white border border-green-400/60",
            Pending: "bg-gray-600 text-white border border-white/10",
            "In Progress": "bg-yellow-500 text-black border border-yellow-300",
        }[report.status] || "bg-gray-600 text-white border border-white/10";
    const voteCountClass = `text-sm ${
        isUpvoted || isDownvoted ? "text-white" : ""
    }`;

    useEffect(() => {
        if (!isMapModalOpen) {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            return;
        }
        if (!hasCoordinates || !mapContainerRef.current) {
            return;
        }
        let cancelled = false;
        loadLeaflet().then((L) => {
            if (cancelled || !mapContainerRef.current) {
                return;
            }
            if (mapRef.current) {
                mapRef.current.remove();
            }
            const map = L.map(mapContainerRef.current, {
                zoomControl: false,
            }).setView([latitude, longitude], DEFAULT_ZOOM);
            mapRef.current = map;
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
                maxZoom: 19,
            }).addTo(map);
            L.marker([latitude, longitude]).addTo(map);
        });
        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [hasCoordinates, isMapModalOpen, latitude, longitude]);

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }
        const modalActive = isMapModalOpen || Boolean(activeImage);
        if (modalActive) {
            bodyOverflowRef.current = document.body.style.overflow;
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = bodyOverflowRef.current || "";
        }
        return () => {
            document.body.style.overflow = bodyOverflowRef.current || "";
        };
    }, [activeImage, isMapModalOpen]);

    useEffect(() => {
        if (!reportPopupOpen) {
            return undefined;
        }
        const handleClick = (event) => {
            if (
                reportActionRef.current &&
                !reportActionRef.current.contains(event.target)
            ) {
                setReportPopupOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [reportPopupOpen]);

    return (
        <section className="w-full" key={report.id}>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-950/95 via-neutral-900/90 to-neutral-800/80 text-gray-100 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-40 blur-[120px]"
                    aria-hidden="true"
                />
                <div className="relative p-6 md:p-8 space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 font-semibold text-base flex items-center justify-center text-white shadow-lg">
                                {(report.user?.name || "Guest")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                            <div>
                                <p className="text-lg font-semibold">
                                    {report.user?.name || "Guest"}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 bg-white/5">
                                        <span className="size-2 rounded-full bg-emerald-400"></span>
                                        {report.category || "Uncategorized"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 font-mono">
                            <span className="rounded-full border border-white/15 px-3 py-1 bg-white/5">
                                {dateStr}
                                {timeStr && (
                                    <span className="ml-1">| {timeStr}</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-5 space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white">
                            {formatSubject(report.subject)}
                        </h2>
                        <div
                            className="h-px w-full bg-white/10"
                            aria-hidden="true"
                        ></div>
                        <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                            {report.description || "No description provided."}
                        </p>
                    </div>

                    {images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/3]"
                                >
                                    <img
                                        src={`/storage/${img}`}
                                        alt={`Report Image ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                                            aria-label="View full image"
                                            onClick={() =>
                                                setActiveImage({
                                                    src: `/storage/${img}`,
                                                    alt: `Report Image ${
                                                        idx + 1
                                                    }`,
                                                })
                                            }
                                        >
                                            Expand
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {(hasCoordinates || locationLabel) && (
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-transparent p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="shrink-0 rounded-full bg-blue-500/20 text-blue-200 p-2.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 21c-4.5-4.2-6-7.5-6-10.2C6 7 8.5 4.5 12 4.5s6 2.5 6 6.3c0 2.7-1.5 6-6 10.2z"
                                            />
                                            <circle cx="12" cy="10.5" r="2.2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">
                                            Location Details
                                        </h3>
                                    </div>
                                </div>
                                {hasCoordinates && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-full bg-blue-500/90 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                        onClick={() => setMapModalOpen(true)}
                                    >
                                        View on Map
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path d="M10.75 4a.75.75 0 0 0-1.5 0v6.638L6.832 8.22a.75.75 0 0 0-1.06 1.06l4.243 4.243a.75.75 0 0 0 1.06 0l4.243-4.243a.75.75 0 0 0-1.06-1.06l-2.418 2.418z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {isMapModalOpen && (
                        <div className="fixed inset-0 z-[4000] flex items-start justify-center px-4 pt-24 pb-6">
                            <div
                                className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                                aria-hidden="true"
                            ></div>
                            <div
                                className="relative z-[4100] w-full max-w-3xl rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-950 text-white border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
                                role="dialog"
                                aria-modal="true"
                                aria-label={`Map for ${formatSubject(
                                    report.subject
                                )}`}
                            >
                                <div className="flex items-start justify-between gap-4 p-6 border-b border-white/10">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-gray-300">
                                            <span className="size-2 rounded-full bg-emerald-400"></span>
                                            Map Preview
                                        </div>
                                        <h4 className="text-2xl font-semibold">
                                            {formatSubject(report.subject)}
                                        </h4>
                                        <p className="text-sm text-gray-300 text-justify">
                                            {locationLabel}
                                        </p>
                                        {hasCoordinates && (
                                            <div className="text-xs text-gray-400 font-mono">
                                                Lat {latitude?.toFixed(5)} · Lng{" "}
                                                {longitude?.toFixed(5)}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-full border border-white/20 px-3 py-1 text-sm text-gray-300 hover:bg-white/10"
                                        onClick={() => setMapModalOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className="p-6">
                                    {hasCoordinates ? (
                                        <div className="relative h-80 rounded-2xl overflow-hidden border border-white/15 shadow-inner shadow-black/40">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!mapRef.current) return;
                                                    mapRef.current.setView(
                                                        [latitude, longitude],
                                                        DEFAULT_ZOOM
                                                    );
                                                }}
                                                className="absolute top-4 right-4 z-[4200] inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold tracking-wide border border-white/30 hover:bg-black/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                            >
                                                Reset View
                                            </button>
                                            <div
                                                ref={mapContainerRef}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-300">
                                            Coordinates unavailable.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeImage && (
                        <div className="fixed inset-0 z-[4000] flex items-start justify-center px-4 pt-24 pb-6">
                            <div
                                className="absolute inset-0 bg-black/80"
                                onClick={() => setActiveImage(null)}
                            ></div>
                            <div
                                className="relative z-[4100] bg-neutral-900 text-white w-full max-w-[90vw] md:max-w-[1200px] rounded-2xl border border-white/10 shadow-2xl p-4 md:p-5 max-h-[80vh] overflow-y-auto"
                                role="dialog"
                                aria-modal="true"
                                aria-label={activeImage.alt || "Report image"}
                            >
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80"
                                    onClick={() => setActiveImage(null)}
                                    aria-label="Close image modal"
                                >
                                    ✕
                                </button>
                                <img
                                    src={activeImage.src}
                                    alt={activeImage.alt || "Report image"}
                                    className="w-full h-auto rounded-xl object-contain max-h-[65vh]"
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className={votePillClass}>
                                <button
                                    type="button"
                                    className="flex items-center justify-center"
                                    aria-label="upvote"
                                    onClick={() => {
                                        if (!auth?.user) {
                                            router.reload({
                                                only: ["flash"],
                                                data: {
                                                    flash: {
                                                        error: "Please log in to vote.",
                                                    },
                                                },
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: (page) => {
                                                    page.props.flash = {
                                                        error: "Please log in to vote.",
                                                    };
                                                },
                                            });
                                            return;
                                        }
                                        router.post(
                                            route("reports.vote", report.id),
                                            { direction: "up" },
                                            { preserveScroll: true }
                                        );
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        className={`w-4 h-4 ${
                                            isUpvoted
                                                ? "text-white"
                                                : "text-gray-300 hover:text-gray-100"
                                        }`}
                                        fill="currentColor"
                                    >
                                        <path
                                            d={
                                                isUpvoted
                                                    ? "M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10z"
                                                    : "M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"
                                            }
                                        />
                                    </svg>
                                </button>
                                <span className={voteCountClass}>
                                    {report.votes ?? 0}
                                </span>
                                <button
                                    type="button"
                                    className="flex items-center justify-center"
                                    aria-label="downvote"
                                    onClick={() => {
                                        if (!auth?.user) {
                                            router.reload({
                                                only: ["flash"],
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: (page) => {
                                                    page.props.flash = {
                                                        error: "Please log in to vote.",
                                                    };
                                                },
                                            });
                                            return;
                                        }
                                        router.post(
                                            route("reports.vote", report.id),
                                            { direction: "down" },
                                            { preserveScroll: true }
                                        );
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        className={`w-4 h-4 ${
                                            isDownvoted
                                                ? "text-white"
                                                : "text-gray-300 hover:text-gray-100"
                                        }`}
                                        fill="currentColor"
                                    >
                                        <path
                                            d={
                                                isDownvoted
                                                    ? "M10 1a3.966 3.966 0 013.96 3.962V9.02h3.202c.706 0 1.335.42 1.605 1.073.27.652.122 1.396-.377 1.895l-7.754 7.759a.925.925 0 01-1.272 0l-7.754-7.76a1.734 1.734 0 01-.376-1.894c.27-.652.9-1.073 1.605-1.073h3.202V4.962A3.965 3.965 0 0110 1z"
                                                    : "M10 1a3.966 3.966 0 013.96 3.962V9.02h3.202c.706 0 1.335.42 1.605 1.073.27.652.122 1.396-.377 1.895l-7.754 7.759a.925.925 0 01-1.272 0l-7.754-7.76a1.734 1.734 0 01-.376-1.894c.27-.652.9-1.073 1.605-1.073h3.202V4.962A3.965 3.965 0 0110 1zm7.01 9.82h-4.85V5.09c0-1.13-.81-2.163-1.934-2.278a2.163 2.163 0 00-2.386 2.15v5.859H2.989l7.01 7.016 7.012-7.016z"
                                            }
                                        />
                                    </svg>
                                </button>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-2 bg-black/40 rounded-full px-4 py-2"
                                aria-label="comments"
                                onClick={() => setCommentsOpen((v) => !v)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className={`w-4 h-4 ${
                                        commentsOpen
                                            ? "text-green-400"
                                            : "text-gray-300 hover:text-gray-100"
                                    }`}
                                    fill="currentColor"
                                >
                                    <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z" />
                                </svg>
                                <span className="text-sm">
                                    {report.comments_count ??
                                        (Array.isArray(report.comments)
                                            ? report.comments.length
                                            : 0)}
                                </span>
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm text-gray-300">
                            <span className="font-medium flex items-center gap-2">
                                Status:
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}`}
                                >
                                    {report.status}
                                </span>
                            </span>
                            <span className="font-medium">
                                Ticket ID:{" "}
                                <span className="font-mono">
                                    {report.ticket_id}
                                </span>
                            </span>
                        </div>
                    </div>
                    {/* Comments Section */}
                    <div
                        id={`comments-${report.id}`}
                        className={`${commentsOpen ? "" : "hidden"} mt-4`}
                    >
                        <div className="space-y-3">
                            {Array.isArray(report.comments) &&
                            report.comments.length > 0 ? (
                                report.comments.map((c) => (
                                    <div
                                        key={c.id}
                                        className="bg-black/30 border border-white/10 rounded-lg p-3"
                                    >
                                        <div className="text-xs text-gray-400 mb-1">
                                            <span className="font-semibold">
                                                {c.user?.name ?? "User"}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span>
                                                {new Date(
                                                    c.created_at
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-100">
                                            {c.body}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-400 italic">
                                    No comments yet.
                                </div>
                            )}
                        </div>
                        <form
                            className="mt-3 flex items-center gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!auth?.user) {
                                    router.reload({
                                        only: ["flash"],
                                        preserveScroll: true,
                                        preserveState: true,
                                        onSuccess: (page) => {
                                            page.props.flash = {
                                                error: "Please log in to comment.",
                                            };
                                        },
                                    });
                                    return;
                                }
                                const form = e.currentTarget;
                                const input =
                                    form.querySelector('input[name="body"]');
                                const body = input?.value?.trim();
                                if (!body) return;
                                router.post(
                                    route("reports.comment", report.id),
                                    { body },
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            if (input) input.value = "";
                                        },
                                    }
                                );
                            }}
                        >
                            <input
                                type="text"
                                name="body"
                                className="flex-1 px-3 py-2 rounded-lg bg-white/90 text-black placeholder-gray-500"
                                placeholder={
                                    auth?.user
                                        ? "Add a comment..."
                                        : "Log in to comment"
                                }
                                disabled={!auth?.user}
                                maxLength={500}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
                                disabled={!auth?.user}
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function Reports({
    auth,
    reports = { data: [], links: [] },
    filters = {},
}) {
    const [sort, setSort] = useState(filters.sort || "votes");
    const [direction, setDirection] = useState(filters.direction || "desc");
    const [category, setCategory] = useState(filters.category || "");
    const [status, setStatus] = useState(filters.status || "");
    const [recentDays, setRecentDays] = useState(
        Number(filters.recent_days) || 0
    );
    const [perPage, setPerPage] = useState(Number(filters.perPage) || 3);
    const [showQuote, setShowQuote] = useState(false);
    const [quote, setQuote] = useState(null);
    const [loadingQuote, setLoadingQuote] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);

    const sortOptions = [
        { value: "votes", label: "Top", direction: "desc" },
        { value: "submitted_at", label: "Recent", direction: "desc" },
    ];

    const statusOptions = ["Pending", "In Progress", "Resolved"];
    const reportsData = Array.isArray(reports?.data)
        ? reports.data
        : Array.isArray(reports)
        ? reports
        : [];
    const links = reports?.links ?? [];

    const refresh = (overrides = {}) => {
        const params = {
            sort,
            direction,
            category: category || undefined,
            status: status || undefined,
            recent_days: recentDays || undefined,
            perPage,
            page: overrides.page ?? 1,
            ...overrides,
        };
        router.get(route("reports"), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSort("votes");
        setDirection("desc");
        setCategory("");
        setStatus("");
        setRecentDays(0);
        setPerPage(3);
        refresh({
            sort: "votes",
            direction: "desc",
            category: undefined,
            status: undefined,
            recent_days: undefined,
            perPage: 3,
            page: 1,
        });
    };

    const handleSortChange = (nextSort) => {
        const option = sortOptions.find((o) => o.value === nextSort);
        const nextDirection = option?.direction || "desc";
        setSort(nextSort);
        setDirection(nextDirection);
        refresh({ sort: nextSort, direction: nextDirection, page: 1 });
    };

    const fetchQuote = async () => {
        setLoadingQuote(true);
        try {
            const response = await fetch(
                "https://api.api-ninjas.com/v2/randomquotes",
                {
                    headers: {
                        "X-Api-Key": "KkvMqe5Wuu+EKuuaCzFK5w==Z5LYVswitw5RWktW",
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setQuote(data[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch quote:", error);
        } finally {
            setLoadingQuote(false);
        }
    };

    const handleCatClick = () => {
        if (showQuote) {
            fetchQuote();
        } else {
            setShowQuote(true);
            if (!quote) {
                fetchQuote();
            }
        }
    };

    const handleCloseQuote = () => {
        setShowQuote(false);
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: "url('/images/bg (reports).jpg')" }}
        >
            <FlashMessages />
            <Navbar auth={auth} />
            <main className="relative z-10 min-h-[80vh] px-6 md:px-12 lg:px-20 xl:px-24 py-10">
                {/* Two-column responsive layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left: Collapsible Report Form */}
                    <div className="md:col-span-4 lg:col-span-5 xl:col-span-4">
                        <CollapsibleReportForm
                            auth={auth}
                            setShowBanModal={setShowBanModal}
                        />
                    </div>
                    {/* Right: Reports list */}
                    <div className="md:col-span-8 lg:col-span-7 xl:col-span-8 flex flex-col items-start space-y-6 w-full">
                        <div className="w-full bg-neutral-900/80 border border-white/10 rounded-xl p-4 shadow-lg">
                            <div className="flex flex-wrap items-end gap-3">
                                <div className="flex flex-col gap-1 min-w-[160px]">
                                    <label className="text-xs text-white/70 uppercase tracking-wide">
                                        Sort
                                    </label>
                                    <select
                                        value={sort}
                                        onChange={(e) =>
                                            handleSortChange(e.target.value)
                                        }
                                        className="px-3 py-2 rounded-lg bg-white text-black text-sm"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1 min-w-[160px]">
                                    <label className="text-xs text-white/70 uppercase tracking-wide">
                                        Recent
                                    </label>
                                    <select
                                        value={
                                            recentDays ? String(recentDays) : ""
                                        }
                                        onChange={(e) => {
                                            const val = Number(
                                                e.target.value || 0
                                            );
                                            setRecentDays(val);
                                            refresh({
                                                recent_days: val || undefined,
                                                page: 1,
                                            });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-white text-black text-sm"
                                    >
                                        <option value="">All time</option>
                                        <option value="7">Last 7 days</option>
                                        <option value="30">Last 30 days</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1 min-w-[180px]">
                                    <label className="text-xs text-white/70 uppercase tracking-wide">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setCategory(val);
                                            refresh({
                                                category: val || undefined,
                                                page: 1,
                                            });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-white text-black text-sm"
                                    >
                                        <option value="">All categories</option>
                                        {REPORT_CATEGORIES.map((cat) => (
                                            <option
                                                key={cat.name}
                                                value={cat.name}
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1 min-w-[160px]">
                                    <label className="text-xs text-white/70 uppercase tracking-wide">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setStatus(val);
                                            refresh({
                                                status: val || undefined,
                                                page: 1,
                                            });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-white text-black text-sm"
                                    >
                                        <option value="">All status</option>
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1 min-w-[140px]">
                                    <label className="text-xs text-white/70 uppercase tracking-wide">
                                        Per page
                                    </label>
                                    <select
                                        value={String(perPage)}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setPerPage(val);
                                            refresh({ perPage: val, page: 1 });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-white text-black text-sm"
                                    >
                                        {[3, 5, 10, 15, 20].map((n) => (
                                            <option key={n} value={n}>
                                                {n} per page
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="ml-auto">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="text-sm px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        {reportsData.length === 0 && (
                            <p className="mt-4 text-white/80 italic">
                                No reports submitted yet.
                            </p>
                        )}
                        {reportsData.map((r) => (
                            <ReportCard key={r.id} report={r} auth={auth} />
                        ))}

                        {links.length > 0 && (
                            <div className="flex items-center justify-end w-full">
                                <div className="flex gap-2 flex-wrap">
                                    {links.map((l, idx) => (
                                        <button
                                            key={idx}
                                            disabled={!l.url}
                                            onClick={() => {
                                                if (!l.url) return;
                                                const match =
                                                    l.url.match(/page=(\d+)/);
                                                const pageNum = match
                                                    ? Number(match[1])
                                                    : 1;
                                                refresh({ page: pageNum });
                                            }}
                                            className={`px-3 py-1 rounded text-sm border transition ${
                                                l.active
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent text-white border-white/40 hover:bg-white hover:text-black"
                                            } ${
                                                !l.url
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: l.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {/* Footer at the bottom */}
            {/* Ban Info Modal */}
            {showBanModal &&
                (auth?.user?.banned || auth?.user?.report_banned) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                            {/* Header - Dark with red accent */}
                            <div className="bg-neutral-950 border-b border-red-600/30 px-6 py-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                            <span className="text-xs uppercase tracking-widest text-red-400 font-semibold">
                                                Restricted
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-white">
                                            Account Restricted
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setShowBanModal(false)}
                                        className="text-gray-400 hover:text-white transition mt-1"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6 space-y-5">
                                {/* Ban Reason */}
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                        Reason
                                    </p>
                                    <p className="text-sm text-gray-300 leading-relaxed bg-neutral-800/50 rounded-lg p-3 border border-white/5">
                                        {(auth.user.banned
                                            ? auth.user.ban_reason
                                            : auth.user.report_ban_reason) ||
                                            "No reason provided"}
                                    </p>
                                </div>

                                {/* Ban Date */}
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                        Restricted Since
                                    </p>
                                    <p className="text-sm text-gray-300 font-mono">
                                        {(
                                            auth.user.banned
                                                ? auth.user.banned_at
                                                : auth.user.report_banned_at
                                        )
                                            ? new Date(
                                                  auth.user.banned
                                                      ? auth.user.banned_at
                                                      : auth.user
                                                            .report_banned_at
                                              ).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "Unknown"}
                                    </p>
                                </div>

                                {/* What You Can Still Do */}
                                {auth.user.banned ? (
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                            Platform Ban
                                        </p>
                                        <p className="text-sm text-red-400">
                                            You are banned from all platform
                                            activities including voting,
                                            commenting, and posting reports.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                            You Can Still
                                        </p>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">
                                                    ✓
                                                </span>
                                                View reports
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">
                                                    ✓
                                                </span>
                                                Vote on reports
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">
                                                    ✓
                                                </span>
                                                Comment on reports
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* Appeal Section */}
                                <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3">
                                    <p className="text-xs text-red-400/80 text-center">
                                        To appeal this restriction, contact an
                                        administrator
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-neutral-950 border-t border-white/5 px-6 py-4 flex gap-3">
                                <button
                                    onClick={() => setShowBanModal(false)}
                                    className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            {/* Floating Cat with Quote */}
            {showQuote && (
                <div className="fixed bottom-[200px] right-6 z-50 max-w-sm">
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl p-5 mb-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseQuote}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        {loadingQuote ? (
                            <div className="text-center py-6">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                            </div>
                        ) : quote ? (
                            <>
                                <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">
                                    "{quote.quote}"
                                </p>
                                <p className="text-xs text-gray-500 text-right">
                                    - {quote.author}
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-500 text-center text-sm py-4">
                                Failed to load quote. Please try again.
                            </p>
                        )}
                        <div className="absolute -bottom-3 right-12 w-6 h-6 bg-white transform rotate-45"></div>
                    </div>
                </div>
            )}
            <img
                src="/images/logo_cat3.png"
                alt="Floating Cat"
                className="floating-cat w-32 md:w-48 lg:w-60 z-50 cursor-pointer hover:scale-110 transition-transform"
                onClick={handleCatClick}
            />
            <style>{`
                .floating-cat { position: fixed; bottom: 20px; right: 20px; animation: float 4s ease-in-out infinite; }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
            `}</style>
            <footer className="relative z-10">
                <Footer />
            </footer>
        </div>
    );
}
