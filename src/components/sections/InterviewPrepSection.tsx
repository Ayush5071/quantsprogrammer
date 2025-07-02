// File touched to force re-indexing for Next.js build bug
import React from "react";
import { motion } from "framer-motion";
import { IconBrain, IconCode, IconDatabase, IconDeviceDesktop, IconRocket, IconTarget } from "@tabler/icons-react";

const interviewTopics = [
	{
		title: "Operating Systems",
		icon: <IconDeviceDesktop className="w-8 h-8" />,
		description: "Process management, memory allocation, file systems, and more",
		status: "Available",
		color: "from-blue-600 to-cyan-600",
		bgColor: "from-blue-900/20 to-cyan-900/20",
		link: "/prepare-interviews/operating-systems",
	},
	{
		title: "Data Structures",
		icon: <IconDatabase className="w-8 h-8" />,
		description: "Arrays, trees, graphs, and algorithmic problem solving",
		status: "Coming Soon",
		color: "from-purple-600 to-pink-600",
		bgColor: "from-purple-900/20 to-pink-900/20",
		link: "#",
	},
	{
		title: "System Design",
		icon: <IconRocket className="w-8 h-8" />,
		description: "Scalable architecture, distributed systems, and design patterns",
		status: "Coming Soon",
		color: "from-green-600 to-teal-600",
		bgColor: "from-green-900/20 to-teal-900/20",
		link: "#",
	},
	{
		title: "Programming",
		icon: <IconCode className="w-8 h-8" />,
		description: "Language-specific concepts, OOP, and coding best practices",
		status: "Coming Soon",
		color: "from-orange-600 to-red-600",
		bgColor: "from-orange-900/20 to-red-900/20",
		link: "#",
	},
];

const features = [
	{
		icon: <IconBrain className="w-6 h-6" />,
		title: "Comprehensive Coverage",
		description: "Complete topic coverage with real interview questions",
	},
	{
		icon: <IconTarget className="w-6 h-6" />,
		title: "Targeted Practice",
		description: "Focus on specific areas that need improvement",
	},
	{
		icon: <IconCode className="w-6 h-6" />,
		title: "Code Examples",
		description: "Practical examples and implementation details",
	},
];

export default function InterviewPrepSection() {
	return (
		<section className="w-full py-16 md:py-20 px-4 md:px-8 flex flex-col items-center relative overflow-hidden">
			{/* Enhanced Background Effects - matching HeroPage/Footer style */}
			<div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_70%)]"></div>

			{/* Animated Grid Pattern - matching HeroPage/Footer */}
			<div className="absolute inset-0 opacity-20">
				<div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
			</div>

			<div className="w-full max-w-7xl relative z-10">
				{/* Section Header */}
				<div className="text-center mb-12 md:mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm text-zinc-300 mb-6"
					>
						<div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
						<span>Interview Preparation</span>
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 text-center"
					>
						Master Technical{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
							Interviews
						</span>
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="text-base md:text-lg text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed text-center"
					>
						Comprehensive preparation materials covering all major computer science topics with
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
							{" "}
							real interview questions
						</span>
						.
					</motion.p>
				</div>

				<div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
					{/* Features Column */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7 }}
						className="lg:col-span-1"
					>
						<div className="p-6 md:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl h-full">
							<h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
								<div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
									<svg
										className="w-4 h-4 md:w-6 md:h-6 text-white"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
								</div>
								Why Choose Our System?
							</h3>
							<div className="space-y-4 md:space-y-6">
								{features.map((feature, index) => (
									<motion.div
										key={feature.title}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: index * 0.1 }}
										className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
									>
										<div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
											<div className="text-purple-400">{feature.icon}</div>
										</div>
										<div className="flex-1">
											<h4 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">
												{feature.title}
											</h4>
											<p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
												{feature.description}
											</p>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>

					{/* Topics Grid */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7 }}
						className="lg:col-span-2"
					>
						{/* Topics Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
							{interviewTopics.map((topic, index) => {
								const isAvailable = topic.status === "Available";
								return (
									<motion.div
										key={topic.title}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										className={`group relative overflow-hidden bg-gradient-to-br ${topic.bgColor} backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:p-6 hover:border-white/20 transition-all duration-500 ${
											isAvailable
												? "cursor-pointer hover:scale-[1.02] hover:shadow-2xl"
												: "cursor-not-allowed opacity-75"
										}`}
										onClick={() => isAvailable && (window.location.href = topic.link)}
										whileHover={isAvailable ? { y: -5 } : {}}
									>
										{/* Background Gradient Effect */}
										<div
											className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
										/>

										{/* Status Badge */}
										<div
											className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
												isAvailable
													? "bg-green-500/20 text-green-400 border border-green-500/30"
													: "bg-orange-500/20 text-orange-400 border border-orange-500/30"
											}`}
										>
											{topic.status}
										</div>

										{/* Icon */}
										<div
											className={`text-transparent bg-clip-text bg-gradient-to-r ${topic.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
										>
											{topic.icon}
										</div>

										{/* Content */}
										<h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
											{topic.title}
										</h3>

										<p className="text-zinc-400 text-sm leading-relaxed mb-4 group-hover:text-zinc-300 transition-colors duration-300">
											{topic.description}
										</p>

										{/* Action */}
										<div className="flex items-center justify-between">
											{isAvailable ? (
												<span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 group-hover:from-purple-300 group-hover:to-pink-300 flex items-center gap-2">
													Start Practicing
													<svg
														className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M13 7l5 5m0 0l-5 5m5-5H6"
														/>
													</svg>
												</span>
											) : (
												<span className="text-sm font-medium text-zinc-500 flex items-center gap-2">
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
														/>
													</svg>
													Coming Soon
												</span>
											)}
										</div>
									</motion.div>
								);
							})}
						</div>
					</motion.div>
				</div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3 }}
					className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
				>
					<h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
						Ready to Master Your Interviews?
					</h3>
					<p className="text-zinc-300 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
						Join thousands of developers who've landed their dream jobs using our comprehensive interview
						preparation system.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => (window.location.href = "/prepare-interviews/operating-systems")}
							className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
						>
							Start Free Practice
							<svg
								className="w-4 h-4 md:w-5 md:h-5"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
						>
							View All Topics
						</motion.button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
