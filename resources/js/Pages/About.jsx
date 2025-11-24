import { Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function About({ auth }) {

    const developers = [
        { name: 'Althea Erica M. Candido', image: '/images/person_candido.jpg' },
        { name: 'Olimar Dominic R. Olila', image: '/images/person_olila.jpg' },
        { name: 'Julianne Muriel L. Peña', image: '/images/person_pena.jpg' },
        { name: 'Margaret Crystal B. Xavier', image: '/images/person_xavier.jpg' },
    ];

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: "url('/images/bg (reports).jpg')" }}
        >
            <Navbar auth={auth} />

            {/* Content */}
            <main className="relative z-10 w-full px-6 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 space-y-16">
                {/* Platform Description */}
                <section className="max-w-5xl mx-auto text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                    <p className="text-justify">
                        Integrated Community Assistance & Reporting Environment, short for 'iCARE', is a web-based civic reporting platform where citizens can submit issues (e.g., damaged pavements, broken streetlights, flooding) with photos, location, and descriptions. Each report becomes a ticket tracked through statuses: <span className="font-semibold">Pending</span>, <span className="font-semibold">In Progress</span>, and <span className="font-semibold">Resolved</span>. Managed by local authorities. An admin dashboard provides real-time metrics such as total reports, average response and resolution times, and heatmaps of incident locations to promote accountability and transparent service delivery.
                    </p>
                </section>

                {/* Developers */}
                <section className="max-w-6xl mx-auto">
                    <h2 className="text-center text-lg md:text-xl font-bold mb-8 tracking-wide">MEET THE DEVELOPERS</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 lg:gap-14">
                        {developers.map(dev => (
                            <div key={dev.name} className="flex flex-col items-center text-center">
                                <div className="w-40 h-40 bg-white/10 backdrop-blur-sm border border-white/20 rounded shadow-inner flex items-center justify-center overflow-hidden mb-3">
                                    {/* Developer Photo Placeholder / Image */}
                                    <img src={dev.image} alt={dev.name} className="object-cover w-full h-full" />
                                </div>
                                <p className="text-xs md:text-sm leading-snug whitespace-pre-line">
                                    {dev.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SDG Section */}
                <section className="max-w-6xl mx-auto space-y-8">
                    <h2 className="text-left text-lg md:text-xl font-bold tracking-wide">SUSTAINABLE DEVELOPMENT GOALS</h2>
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Two-column image grid */}
                        <div className="grid grid-cols-2 gap-6 w-fit">
                            <div className="w-40 h-40 bg-white/10 border border-white/20 rounded flex items-center justify-center overflow-hidden">
                                <img src="/images/sdg (11).jpg" alt="SDG 11" className="object-contain w-full h-full" />
                            </div>
                            <div className="w-40 h-40 bg-white/10 border border-white/20 rounded flex items-center justify-center overflow-hidden">
                                <img src="/images/sdg (16).jpg" alt="SDG 16" className="object-contain w-full h-full" />
                            </div>
                        </div>
                        {/* Description */}
                        <div className="flex-1 text-sm md:text-base lg:text-lg leading-relaxed tracking-wide text-justify">
                            <p>
                                The iCARE system supports SDG 11 by providing a digital channel for citizens to report infrastructure and community issues, helping local authorities address problems such as unsafe roads, broken streetlights, and flooding more quickly and effectively. It contributes to SDG 16 by promoting transparency and accountability through real-time status tracking, audit logs of government actions, and performance analytics that guide evidence-based decision-making and resource allocation.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
