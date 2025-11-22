"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, Layout, Users, FileText, BarChart3, Settings, Shield } from "lucide-react";

export default function UserHomePage() {
  const router = useRouter();
  const conceptRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollToConcept = () => {
    conceptRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center space-y-8 px-4"
        >
          {/* Main Title - Cinematic Typography */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-none lowercase"
            style={{
              letterSpacing: "-0.02em",
            }}
          >
            flow form builder
          </motion.h1>
          
          {/* Descriptive Sentence */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light tracking-wide"
            style={{ letterSpacing: "0.01em" }}
          >
            A platform designed to help you build websites and forms with ease.
          </motion.p>

          {/* Downward Arrow */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={scrollToConcept}
            className="mt-16 flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
            <div className="h-12 w-px bg-border opacity-50" />
          </motion.button>
        </motion.div>
      </section>

      {/* Concept Introduction Section */}
      <section ref={conceptRef} className="relative min-h-screen flex items-center py-32 px-4 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image on Left - Smooth Fade In */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              <div className="relative rounded-[12px] border border-border bg-card p-8">
                <div className="aspect-[4/3] rounded-[10px] border border-border bg-card flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <Layout className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-bold text-foreground lowercase">Visual Builder</h3>
                    <p className="text-sm text-muted-foreground font-light">Create with ease</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Text on Right - Smooth Fade In */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight lowercase">
                build without limits
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-light">
                <p>
                  Flow Form Builder gives you the tools to quickly create forms, pages, and components with a smooth, structured workflow.
                </p>
                <p>
                  We focus on clarity, usability, and a premium experience — so you can build without limits.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Admin Features Section */}
      <section ref={adminRef} className="relative min-h-screen flex items-center py-32 px-4 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Image on Left - Slide In */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              <div className="relative rounded-[12px] border border-border bg-card p-8">
                <div className="aspect-[4/3] rounded-[10px] border border-border bg-card flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-bold text-foreground lowercase">Admin Dashboard</h3>
                    <p className="text-sm text-muted-foreground font-light">Full control</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Text on Right - Slide In */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight lowercase mb-6">
                as an admin
                </h2>
              
              <ul className="space-y-3 text-lg text-muted-foreground font-light">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => router.push("/auth/login")}
                  variant="primary"
                    size="lg"
                  className="lowercase"
                  >
                  Sign In as Admin
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
      <section className="relative min-h-screen flex items-center py-32 px-4 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text on Left - Slide In */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8 md:order-1"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight lowercase">
                as a user
                </h2>
              
              <ul className="space-y-3 text-lg text-muted-foreground font-light">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => router.push("/user/access-key")}
                  variant="primary"
                  size="lg"
                  className="lowercase"
                >
                  Enter Access Key
                </Button>
                  <Button
                    onClick={() => router.push("/auth/login")}
                  variant="outline"
                    size="lg"
                  className="lowercase"
                  >
                  Sign In as User
                  </Button>
              </div>
            </motion.div>

            {/* Image on Right - Slide In */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative md:order-2"
            >
              <div className="relative rounded-[12px] border border-border bg-card p-8">
                <div className="aspect-[4/3] rounded-[10px] border border-border bg-card flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-bold text-foreground lowercase">User Interface</h3>
                    <p className="text-sm text-muted-foreground font-light">Clean and simple</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
