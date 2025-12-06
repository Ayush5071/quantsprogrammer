import React from "react";
import Image from "next/image";
import useCurrentUser from "@/lib/useCurrentUser";

export default function CertificateShowcase() {
  const user = useCurrentUser();
  return (
    <section className="w-full py-20 px-4 md:px-8 flex flex-col items-center relative overflow-hidden">
      {/* Enhanced Background Effects - matching HeroPage/Footer style */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_70%)]"></div>
      
      {/* Animated Grid Pattern - matching HeroPage/Footer */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 text-center">
          Earn Your Achievement
        </h2>
        <p className="text-lg md:text-xl text-zinc-300 text-center max-w-3xl mx-auto mb-12 font-medium">
          Complete any roadmap and receive a beautiful, shareable digital certificate to showcase your skills
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Certificate Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-4 border-gradient-to-r from-purple-400 to-pink-400 bg-white/5">
                <Image
                  src="/sample.png"
                  alt="Sample Certificate - Dev Roadmap Achievement Certificate"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNlcnRpZmljYXRlIFNhbXBsZTwvdGV4dD48L3N2Zz4=";
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Certificate Features */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Professional Certificates</h3>
                  <p className="text-zinc-300">
                    Beautiful, professionally designed certificates with your name, completion date, and roadmap details.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📤</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Shareable & Downloadable</h3>
                  <p className="text-zinc-300">
                    Download high-resolution certificates or share them directly to LinkedIn, resume, or portfolio.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Instant Generation</h3>
                  <p className="text-zinc-300">
                    Certificates are generated instantly using Canvas API when you complete a roadmap milestone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Progress Recognition</h3>
                  <p className="text-zinc-300">
                    Each certificate represents real learning progress and skill development in your chosen technology stack.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start Your Journey Today
          </h3>
          <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
            Choose a roadmap, track your progress, and earn your first certificate. 
            Join thousands of developers building their careers with Dev Roadmap.
          </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/explore'}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Roadmaps
          </button>
          {user ? (
            <button
              onClick={() => window.location.href = '/profile'}
              className="px-8 py-3 border-2 border-blue-500 text-blue-400 font-bold rounded-xl hover:bg-blue-500/10 transition-all duration-200"
            >
              Go to Profile
            </button>
          ) : (
            <button
              onClick={() => window.location.href = '/auth/signup'}
              className="px-8 py-3 border-2 border-purple-500 text-purple-400 font-bold rounded-xl hover:bg-purple-500/10 transition-all duration-200"
            >
              Create Account
            </button>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
