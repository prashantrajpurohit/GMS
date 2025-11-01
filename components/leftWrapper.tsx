import React from "react";
import { ImageWithFallback } from "./reusableComponents/image-fallback";

function LeftWrapper() {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-neon-green/10 via-background to-neon-blue/10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1584827387150-8ae4caebe906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBkdW1iYmVsbHMlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzYxNDkxMTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Gym Dumbbells"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 opacity-15">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1735647134600-fd2b75fba36d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBtYWNoaW5lcyUyMGZpdG5lc3N8ZW58MXx8fHwxNzYxNDkxMTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Gym Machines"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/30 via-background/40 to-neon-blue/30" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content - Feature Cards */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
        <div className="max-w-lg w-full">
          {/* Features */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-sm bg-card/60 border border-neon-green/30 rounded-lg p-4 shadow-lg">
                <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center mb-3">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-medium mb-1 text-foreground">
                  Member Management
                </h3>
                <p className="text-xs text-muted-foreground">
                  Track and manage all members
                </p>
              </div>

              <div className="backdrop-blur-sm bg-card/60 border border-neon-blue/30 rounded-lg p-4 shadow-lg">
                <div className="w-10 h-10 rounded-lg bg-neon-blue/20 flex items-center justify-center mb-3">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-medium mb-1 text-foreground">
                  Payment Tracking
                </h3>
                <p className="text-xs text-muted-foreground">
                  Monitor monthly payments
                </p>
              </div>

              <div className="backdrop-blur-sm bg-card/60 border border-purple-500/30 rounded-lg p-4 shadow-lg">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-medium mb-1 text-foreground">
                  Reports & Analytics
                </h3>
                <p className="text-xs text-muted-foreground">
                  Insights and statistics
                </p>
              </div>

              <div className="backdrop-blur-sm bg-card/60 border border-orange-500/30 rounded-lg p-4 shadow-lg">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-medium mb-1 text-foreground">
                  Referral Program
                </h3>
                <p className="text-xs text-muted-foreground">
                  Grow your business
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LeftWrapper;
