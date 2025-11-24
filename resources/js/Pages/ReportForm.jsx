import { useState } from "react";
import Navbar from '@/Components/Navbar';

export default function ReportForm({ auth }) {

    const categories = [
        { name: "Building & Facilities", desc: "e.g., damaged public buildings, waiting sheds" },
        { name: "Flood Control Works", desc: "e.g., drainage, clogged canals, dikes, flooding" },
        { name: "Parks & Public Spaces", desc: "e.g., playground equipment, benches, landscaping" },
        { name: "Road Works", desc: "e.g., potholes, damaged pavements" },
        { name: "Streetlights & Electrical", desc: "e.g., broken or missing streetlights, exposed wiring" },
        { name: "Traffic & Signage", desc: "e.g., missing road signs, damaged traffic lights" },
        { name: "Waste Management", desc: "e.g., uncollected garbage, illegal dumping" },
        { name: "Water Supply & Plumbing", desc: "e.g., leaks, broken pipes, low water pressure" },
        { name: "Others", desc: "if the concern doesn't fit the categories above" },
    ];

    const [selected, setSelected] = useState(categories[3]); // Default: Road Works
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);



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
                        <strong>Heads up:</strong> All form submissions are posted publicly. Help prioritize issues by upvoting reports for barangay officials.
                    </p>

                    <img src="/images/logo_cat.PNG" alt="Mascot" className="w-44 mt-8 select-none pointer-events-none"/>
                </section>

                {/* RIGHT SIDE FORM */}
                <form
                    className="w-full max-w-2xl text-black bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl"
                    onSubmit={(e) => e.preventDefault()} // prevents form submission
                >

                    {/* CATEGORY */}
                    <label className="block mb-1 font-semibold text-white">CATEGORY:</label>
                    <select
                        className="w-full px-4 py-2 rounded-lg bg-white text-black shadow focus:outline-none"
                        value={selected.name}
                        onChange={(e) =>
                            setSelected(categories.find(c => c.name === e.target.value))
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

                    {/* LOCATION */}
                    <label className="block mb-1 font-semibold text-white">Location of Concern:</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg mb-4 bg-white text-black shadow focus:outline-none"
                    />

                    {/* MAIN SUBJECT */}
                    <label className="block mb-1 font-semibold text-white">Main Subject:</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg mb-4 bg-white text-black shadow focus:outline-none"
                    />

                    {/* DESCRIPTION */}
                    <label className="block mb-1 font-semibold text-white">Description:</label>
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
                    <label className="block mb-1 font-semibold text-white mt-3">Upload Images (max 6):</label>

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

                            const newPreviews = files.map(file => ({
                                file,
                                url: URL.createObjectURL(file),
                            }));

                            setImages(prev => [...prev, ...newPreviews]);
                        }}
                    />

                    <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 transition ${
                            isDragging ? "border-green-400 bg-white/20" : "border-blue-300"
                        } text-white/80`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);

                            const files = Array.from(e.dataTransfer.files).filter(f =>
                                f.type.startsWith("image/")
                            );

                            if (images.length + files.length > 6) {
                                alert("You can only upload up to 6 images.");
                                return;
                            }

                            const dropped = files.map(file => ({
                                file,
                                url: URL.createObjectURL(file),
                            }));

                            setImages(prev => [...prev, ...dropped]);
                        }}
                    >
                        <p className="text-sm flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
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
                                                setImages(prev => prev.filter((_, i) => i !== index))
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