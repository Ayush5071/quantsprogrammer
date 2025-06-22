import React, { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "../ui/Title";
import { useRouter } from "next/navigation";

const heroFeatures = [
	{
		icon: "🗺️",
		title: "Curated Roadmaps",
		desc: "Step-by-step learning paths for every stack, crafted by industry experts.",
		color:
			"from-blue-900 via-blue-950 to-purple-950 border-blue-700 text-blue-200",
	},
	{
		icon: "📈",
		title: "Track Progress",
		desc: "Mark tasks, save your journey, and unlock achievements as you grow.",
		color:
			"from-purple-900 via-purple-950 to-blue-950 border-purple-700 text-purple-200",
	},
	{
		icon: "🤝",
		title: "Community & AI",
		desc: "Connect, discuss, and get smart suggestions with a vibrant developer community.",
		color:
			"from-pink-900 via-pink-950 to-blue-950 border-pink-700 text-pink-200",
	},
];

export function HeroPage() {
	const router = useRouter();
	const RedirectAbout = () => {
		router.push("/explore");
	};

	// Carousel state for mobile
	const [current, setCurrent] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % heroFeatures.length);
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	return (
		<BackgroundBeamsWithCollision>
			<section className="w-full flex flex-col items-center justify-center min-h-[100vh] pt-1 md:pt-32 pb-28 px-2 sm:px-4 relative z-10 overflow-x-hidden overflow-y-visible">
				<h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 text-center drop-shadow-2xl mb-6 leading-tight tracking-tight animate-fade-in">
					Welcome to{" "}
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
						Dev Roadmap
					</span>
				</h1>
				<p className="text-base xs:text-lg sm:text-xl md:text-2xl text-zinc-100 font-semibold md:font-extrabold text-center max-w-2xl mb-10 tracking-tight animate-fade-in delay-100">
					Your all-in-one platform to explore curated tech roadmaps, track your
					progress, and connect with a vibrant developer community. Start your
					journey, unlock achievements, and level up your skills!
				</p>
				<button
					onClick={RedirectAbout}
					className="px-8 md:px-10 py-3 md:py-4 border text-base md:text-lg text-white bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 border-none rounded-2xl font-bold shadow-lg hover:from-blue-800 hover:to-pink-800 transition-all duration-200 group animate-fade-in delay-300 mb-6"
				>
					<span className="relative font-bebas text-xl md:text-2xl xl:text-3xl tracking-wide">
						Start Exploring
					</span>
				</button>
				{/* Mobile carousel (automatic slideshow, no scrollbar) */}
				<div className="w-full max-w-xs mx-auto mb-6 md:hidden animate-fade-in delay-200">
					<div className="relative">
						{heroFeatures.map((f, idx) => (
							<div
								key={f.title}
								className={`absolute left-0 top-0 w-full transition-opacity duration-700 ${
									idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
								} flex flex-col items-center justify-start bg-gradient-to-br ${f.color} border-2 border-opacity-60 rounded-2xl shadow-xl p-7 min-h-[220px] h-full glass-card`}
								style={{
									boxShadow:
										"0 6px 32px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.10)",
								}}
							>
								<span className="text-5xl mb-3 drop-shadow-lg">{f.icon}</span>
								<span
									className={`text-xl font-bold mb-2 text-center truncate w-full ${f.color.split(
										" "
									)[2]}`}
									title={f.title}
								>
									{f.title}
								</span>
								<span className="text-zinc-200 text-base text-center font-medium leading-snug line-clamp-3 w-full overflow-hidden">
									{f.desc}
								</span>
							</div>
						))}
					</div>
				</div>
				{/* Cards grid for md+ */}
				<div className="hidden md:grid w-full max-w-5xl grid-cols-3 gap-6 mb-10 animate-fade-in delay-200">
					{heroFeatures.map((f) => (
						<div
							key={f.title}
							className={`flex flex-col items-center justify-start bg-gradient-to-br ${f.color} border-2 border-opacity-60 rounded-2xl shadow-xl p-7 min-h-[220px] h-full w-full glass-card transition-transform duration-300 hover:scale-[1.03]`}
							style={{
								boxShadow:
									"0 6px 32px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.10)",
							}}
						>
							<span className="text-5xl mb-3 drop-shadow-lg">{f.icon}</span>
							<span
								className={`text-xl font-bold mb-2 text-center truncate w-full ${f.color.split(
									" "
								)[2]}`}
								title={f.title}
							>
								{f.title}
							</span>
							<span className="text-zinc-200 text-base text-center font-medium leading-snug line-clamp-3 w-full overflow-hidden">
								{f.desc}
							</span>
						</div>
					))}
				</div>
			</section>
		</BackgroundBeamsWithCollision>
	);
}
