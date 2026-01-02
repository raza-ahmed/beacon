"use client";

import { PageLayout, type TocItem, AnimationShowcase } from "@/components";
import { Card3D } from "@/components/animations/Card3D";
import { ButtonAnimated } from "@/components/animations/ButtonAnimated";
import { HoverLift } from "@/components/animations/HoverLift";
import { TiltContainer } from "@/components/animations/TiltContainer";
import { ParallaxHover } from "@/components/animations/ParallaxHover";
import { DepthGlow } from "@/components/animations/DepthGlow";
import { Card, Button } from "beacon-ui";
import { motion } from "framer-motion";
import {
  professionalSmoothScaleVariants,
  playfulBounceVariants,
  playfulElasticVariants,
  playfulJellyVariants,
  playfulPopVariants,
  minimalFadeVariants,
  minimalShiftVariants,
  minimalSoftGlowVariants,
  minimalBorderFadeVariants,
} from "@/utils/animations";

function BorderGlowCard() {
  const borderGlowVariants = {
    hover: {
      borderColor: "var(--border-primary)",
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    rest: {
      borderColor: "var(--border-strong-200)",
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div style={{ width: "300px" }}>
      <motion.div
        variants={borderGlowVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        style={{
          borderWidth: "var(--border-width-25)",
          borderStyle: "solid",
          borderRadius: "var(--corner-radius-400)",
        }}
      >
        <Card
          padding={400}
          cornerRadius={4}
          showBorder={false}
          style={{
            height: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-200)",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <h6
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--fonts-title-regular-text-size)",
                color: "var(--fg-neutral)",
                margin: 0,
              }}
            >
              Border Glow
            </h6>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

const tocItems: TocItem[] = [
  { id: "professional", label: "Professional" },
  { id: "playful", label: "Playful" },
  { id: "minimal", label: "Minimal" },
  { id: "3d-focused", label: "3D-Focused" },
];

export default function AnimationsPage() {
  return (
    <PageLayout tocItems={tocItems} currentPath="/motion/animations">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Animations</h3>
          <p className="ds-content__text">
            Explore hover animations and 3D effects for components. Each animation includes interactive 
            previews and ready-to-use code examples that you can copy and adapt for your needs.
          </p>
        </header>

        {/* Professional Animations */}
        <section id="professional" className="ds-content__section">
            <h6 className="ds-content__section-title">Professional Animations</h6>
            <p className="ds-content__text">
              Subtle, business-appropriate animations that enhance user experience
              without being distracting.
            </p>

            <div className="ds-animations-grid">
              <AnimationShowcase
                title="Lift Effect"
                description="Subtle upward movement on hover"
                category="Professional"
                code={`import { motion } from "framer-motion";
import { professionalVariants } from "@/utils/animations";

<motion.div
  variants={professionalVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <HoverLift showShadow={false} />
              </AnimationShowcase>

              <AnimationShowcase
                title="Shadow Depth"
                description="Dynamic shadow that increases on hover"
                category="Professional"
                code={`import { motion } from "framer-motion";
import { professionalShadowVariants } from "@/utils/animations";

<motion.div
  variants={professionalShadowVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <HoverLift showShadow={true} />
              </AnimationShowcase>

              <AnimationShowcase
                title="Border Glow"
                description="Border color transition on hover"
                category="Professional"
                code={`import { motion, useMotionValue, useSpring } from "framer-motion";
import { Card } from "beacon-ui";

const borderColor = useMotionValue("var(--border-strong-200)");
const animatedBorderColor = useSpring(borderColor, {
  stiffness: 300,
  damping: 30,
});

<motion.div
  onHoverStart={() => borderColor.set("var(--border-primary)")}
  onHoverEnd={() => borderColor.set("var(--border-strong-200)")}
  style={{ width: "300px" }}
>
  <Card
    padding={400}
    cornerRadius={4}
    showBorder={false}
    style={{
      height: "200px",
      border: "var(--border-width-25) solid",
      borderColor: animatedBorderColor,
    }}
  >
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <BorderGlowCard />
              </AnimationShowcase>

              <AnimationShowcase
                title="Smooth Scale"
                description="Subtle scaling on hover"
                category="Professional"
                code={`import { motion } from "framer-motion";
import { professionalSmoothScaleVariants } from "@/utils/animations";

<motion.div
  variants={professionalSmoothScaleVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={professionalSmoothScaleVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{ width: "300px" }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={true}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Smooth Scale
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>
            </div>
        </section>

        {/* Playful Animations */}
        <section id="playful" className="ds-content__section">
            <h6 className="ds-content__section-title">Playful Animations</h6>
            <p className="ds-content__text">
              Fun, energetic animations that add personality and delight to
              interactions.
            </p>

            <div className="ds-animations-grid">
              <AnimationShowcase
                title="Bounce Effect"
                description="Bouncy rotation animation on hover"
                category="Playful"
                code={`import { motion } from "framer-motion";
import { playfulBounceVariants } from "@/utils/animations";

<motion.div
  variants={playfulBounceVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Button color="primary" variant="filled">
    Bounce Button
  </Button>
</motion.div>`}
              >
                <motion.div
                  variants={playfulBounceVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <Button color="primary" variant="filled">
                    Bounce Button
                  </Button>
                </motion.div>
              </AnimationShowcase>

              <AnimationShowcase
                title="Elastic Scale"
                description="Spring-based elastic scaling"
                category="Playful"
                code={`import { motion } from "framer-motion";
import { playfulElasticVariants } from "@/utils/animations";

<motion.div
  variants={playfulElasticVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={playfulElasticVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{ width: "300px" }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={true}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Elastic Scale
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>

              <AnimationShowcase
                title="Jelly"
                description="Elastic jelly-like wobble effect"
                category="Playful"
                code={`import { motion } from "framer-motion";
import { playfulJellyVariants } from "@/utils/animations";

<motion.div
  variants={playfulJellyVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={playfulJellyVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{ width: "300px" }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={true}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Jelly
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>

              <AnimationShowcase
                title="Pop"
                description="Quick spring-based pop effect"
                category="Playful"
                code={`import { motion } from "framer-motion";
import { playfulPopVariants } from "@/utils/animations";

<motion.div
  variants={playfulPopVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={playfulPopVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{ width: "300px" }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={true}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Pop
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>
            </div>
        </section>

        {/* Minimal Animations */}
        <section id="minimal" className="ds-content__section">
            <h6 className="ds-content__section-title">Minimal Animations</h6>
            <p className="ds-content__text">
              Very subtle micro-interactions that provide feedback without
              drawing attention.
            </p>

            <div className="ds-animations-grid">
              <AnimationShowcase
                title="Fade Effect"
                description="Subtle opacity change"
                category="Minimal"
                code={`import { motion } from "framer-motion";
import { minimalFadeVariants } from "@/utils/animations";

<motion.div
  variants={minimalFadeVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={minimalFadeVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{ width: "300px" }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={true}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Fade Effect
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>

              <AnimationShowcase
                title="Subtle Shift"
                description="Minimal horizontal movement"
                category="Minimal"
                code={`import { motion } from "framer-motion";
import { minimalShiftVariants } from "@/utils/animations";

<motion.div
  variants={minimalShiftVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={minimalShiftVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{ width: "300px" }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={true}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Subtle Shift
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>

              <AnimationShowcase
                title="Soft Glow"
                description="Subtle glow effect on hover"
                category="Minimal"
                code={`import { motion } from "framer-motion";
import { minimalSoftGlowVariants } from "@/utils/animations";

<motion.div
  variants={minimalSoftGlowVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
>
  <Card padding={400} cornerRadius={4}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={minimalSoftGlowVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{ width: "300px" }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={true}
                    shadow={undefined}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Soft Glow
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>

              <AnimationShowcase
                title="Border Fade"
                description="Border opacity transition"
                category="Minimal"
                code={`import { motion } from "framer-motion";
import { minimalBorderFadeVariants } from "@/utils/animations";

<motion.div
  variants={minimalBorderFadeVariants}
  initial="rest"
  whileHover="hover"
  animate="rest"
  style={{
    borderWidth: "var(--border-width-25)",
    borderStyle: "solid",
    borderRadius: "var(--corner-radius-400)",
  }}
>
  <Card padding={400} cornerRadius={4} showBorder={false}>
    {/* Your content */}
  </Card>
</motion.div>`}
              >
                <motion.div
                  variants={minimalBorderFadeVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{
                    width: "300px",
                    borderWidth: "var(--border-width-25)",
                    borderStyle: "solid",
                    borderRadius: "var(--corner-radius-400)",
                  }}
                >
                  <Card
                    padding={400}
                    cornerRadius={4}
                    showBorder={false}
                    style={{ height: "200px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "var(--fonts-title-regular-text-size)",
                          color: "var(--fg-neutral)",
                          margin: 0,
                        }}
                      >
                        Border Fade
                      </h6>
                    </div>
                  </Card>
                </motion.div>
              </AnimationShowcase>
            </div>
        </section>

        {/* 3D-Focused Animations */}
        <section id="3d-focused" className="ds-content__section">
            <h6 className="ds-content__section-title">3D-Focused Animations</h6>
            <p className="ds-content__text">
              Advanced 3D transforms and perspective effects that create depth
              and dimension.
            </p>

            <div className="ds-animations-grid">
              <AnimationShowcase
                title="3D Tilt Card"
                description="Card that tilts based on mouse position"
                category="3D-Focused"
                code={`import { Card3D } from "@/components/animations/Card3D";

<Card3D intensity={15} perspective={1000} scale={1.05}>
  {/* Your content */}
</Card3D>`}
              >
                <Card3D intensity={15} perspective={1000} scale={1.05} />
              </AnimationShowcase>

              <AnimationShowcase
                title="Tilt Container"
                description="Alternative tilt effect with different algorithm"
                category="3D-Focused"
                code={`import { TiltContainer } from "@/components/animations/TiltContainer";

<TiltContainer maxTilt={10} perspective={1000} scale={1.02}>
  {/* Your content */}
</TiltContainer>`}
              >
                <TiltContainer maxTilt={10} perspective={1000} scale={1.02} />
              </AnimationShowcase>

              <AnimationShowcase
                title="Parallax Hover"
                description="Parallax effect with depth on hover"
                category="3D-Focused"
                code={`import { ParallaxHover } from "@/components/animations/ParallaxHover";

<ParallaxHover>
  {/* Your content */}
</ParallaxHover>`}
              >
                <ParallaxHover />
              </AnimationShowcase>

              <AnimationShowcase
                title="Depth Glow"
                description="3D depth with glowing shadow effect"
                category="3D-Focused"
                code={`import { DepthGlow } from "@/components/animations/DepthGlow";

<DepthGlow>
  {/* Your content */}
</DepthGlow>`}
              >
                <DepthGlow />
              </AnimationShowcase>
            </div>
        </section>
      </article>
    </PageLayout>
  );
}

