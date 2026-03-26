import { useEffect, useState, type ReactNode } from "react";
import { RotateCw } from "lucide-react";

interface SlideLayoutProps {
  children: ReactNode;
}

const SlideLayout = ({ children }: SlideLayoutProps) => {
  const [scale, setScale] = useState(1);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setScale(Math.min(vw / 1920, vh / 1080));
      setIsPortrait(vw < 768 && vh > vw);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  if (isPortrait) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-charcoal flex flex-col items-center justify-center gap-6 px-8 text-center">
        <RotateCw size={64} className="text-green animate-pulse" />
        <p className="text-white text-xl font-display font-semibold">
          Rotate your phone to landscape
        </p>
        <p className="text-muted-foreground text-sm">
          This presentation is best viewed horizontally
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <div
        className="absolute slide-content"
        style={{
          width: 1920,
          height: 1080,
          left: "50%",
          top: "50%",
          marginLeft: -960,
          marginTop: -540,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SlideLayout;
