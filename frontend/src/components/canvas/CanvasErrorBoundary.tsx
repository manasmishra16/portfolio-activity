"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Canvas Error Boundary caught exception:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Elegant editorial static workstation fallback (zero crash, preserved aesthetic)
      return (
        <div className="w-full h-full flex items-center justify-end pr-6 lg:pr-20">
          <div className="relative w-full max-w-[460px] aspect-[16/10] rounded-2xl border border-[#ff5a1f]/30 bg-[#0d1017] p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff5a1f]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f]" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
              <span className="font-mono text-[11px] text-[#8c94a5] tracking-widest">
                MANAS MISHRA // WORKSTATION
              </span>
            </div>

            <div className="font-mono text-xs text-white space-y-2 py-4">
              <p className="text-[#ff5a1f] font-semibold">&gt; whoami</p>
              <p className="text-white pl-4 font-bold">manas mishra</p>
              <p className="text-[#ff5a1f] font-semibold">&gt; focus</p>
              <p className="text-[#ff5a1f] pl-4">data &rarr; intelligence &rarr; application</p>
              <p className="text-[#ff5a1f] font-semibold">&gt; status</p>
              <p className="text-[#c8d0de] pl-4">building &bull; learning &bull; innovating</p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#6e7481]">2D ACCELERATED MODE</span>
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 hover:border-[#ff5a1f] text-[10px] font-mono text-[#c8d0de] hover:text-[#ff5a1f] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry 3D</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
