'use client';

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();
  const conceptRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto"
        >
          {/* Main Title - Minimal Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight lowercase leading-[1.1]"
          >
            flow form
            <br />
            builder
          </motion.h1>

          {/* Descriptive Sentence */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
          >
            A platform designed to help you build websites and forms with ease.
          </motion.p>

          {/* Scroll Arrow */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={() => scrollToSection(conceptRef)}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
            <div className="h-12 w-px bg-border opacity-50" />
          </motion.button>
        </motion.div>
      </section>

      {/* Concept Introduction Section */}
      <section
        ref={conceptRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="relative aspect-video rounded-[10px] overflow-hidden flex items-center justify-center bg-card border border-border">
                    <Sparkles className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground font-light tracking-wide text-center mt-6 uppercase">
                    Form Builder Interface
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight lowercase">
                build with
                <br />
                clarity & flow
              </h2>
              <div className="space-y-4">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light max-w-xl">
                  Flow Form Builder gives you the tools to quickly create forms, pages, and components with a smooth, structured workflow.
                </p>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light max-w-xl">
                  We focus on clarity, usability, and a premium experience — so you can build without limits.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Admin Features Section */}
      <section
        ref={adminRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative order-2 lg:order-1"
            >
              <Card>
                <CardContent className="p-8">
                  <div className="relative aspect-video rounded-[10px] overflow-hidden flex items-center justify-center bg-card border border-border">
                    <Settings className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground font-light tracking-wide text-center mt-6 uppercase">
                    Admin Dashboard
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Text & Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight lowercase">
                  as an
                  <br />
                  admin
                </h2>
                <ul className="space-y-3 text-lg sm:text-xl text-muted-foreground font-light">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                    <span>Create and customize forms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                    <span>Manage user submissions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                    <span>Build full pages and UI components</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                    <span>Control settings and behavior with a simple interface</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => router.push("/auth/login")}
                  variant="primary"
                  size="lg"
                  className="group"
                >
                  <span className="flex items-center gap-2 lowercase">
                    Sign In as Admin
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Button>
                <Button
                  onClick={() => router.push("/auth/register")}
                  variant="outline"
                  size="lg"
                  className="lowercase"
                >
                  Create an Admin Account
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Features Section */}
      <section
        ref={userRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text & Button */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight lowercase">
                  as a
                  <br />
                  user
                </h2>
                <ul className="space-y-3 text-lg sm:text-xl text-muted-foreground font-light">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                    <span>Submit forms with a clean, simple UI</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                    <span>Track your submissions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                    <span>Interact with custom-built pages</span>
                  </li>
                </ul>
              </div>
              
              <Button
                onClick={() => router.push("/auth/login")}
                variant="primary"
                size="lg"
                className="group lowercase"
              >
                <span className="flex items-center gap-2">
                  Sign In as User
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="relative aspect-video rounded-[10px] overflow-hidden flex items-center justify-center bg-card border border-border">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground font-light tracking-wide text-center mt-6 uppercase">
                    User Interface
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="relative border-t border-border px-4 py-16 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground font-light tracking-wide">
            © 2025 Flow Form Builder. Crafted with precision and care.
          </p>
        </div>
      </footer>
    </div>
  );
}
