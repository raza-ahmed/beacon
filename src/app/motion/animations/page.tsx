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

function SmallCard({ title, description }: { title: string; description?: string }) {
  return (
    <Card
      padding={300}
      cornerRadius={3}
      showBorder={true}
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-200)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "120px",
            borderRadius: "var(--corner-radius-200)",
            overflow: "hidden",
            backgroundColor: "var(--bg-page-secondary)",
          }}
        >
          <img
            src="/images/preview/3x2_1024x683_preview.png"
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-100)",
          }}
        >
          <h6
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--fonts-body-regular-text-size)",
              fontWeight: "var(--font-weight-secondary-semibold)",
              color: "var(--fg-neutral)",
              margin: 0,
            }}
          >
            {title}
          </h6>
          {description && (
            <p
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--fonts-body-small-text-size)",
                color: "var(--fg-neutral-secondary)",
                margin: 0,
                lineHeight: "var(--fonts-body-small-line-height)",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

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
    <motion.div
      variants={borderGlowVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{
        borderWidth: "var(--border-width-25)",
        borderStyle: "solid",
        borderRadius: "var(--corner-radius-300)",
      }}
    >
      <SmallCard title="Border Glow" description="Hover to see the effect" />
    </motion.div>
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
                <HoverLift showShadow={false}>
                  <SmallCard title="Lift Effect" description="Hover to lift" />
                </HoverLift>
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
                <HoverLift showShadow={true}>
                  <SmallCard title="Shadow Depth" description="Dynamic shadow effect" />
                </HoverLift>
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
                >
                  <SmallCard title="Smooth Scale" description="Subtle scaling effect" />
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
                >
                  <SmallCard title="Elastic Scale" description="Spring-based animation" />
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
                >
                  <SmallCard title="Jelly" description="Elastic wobble effect" />
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
                >
                  <SmallCard title="Pop" description="Quick spring effect" />
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
                >
                  <SmallCard title="Fade Effect" description="Subtle opacity change" />
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
                >
                  <SmallCard title="Subtle Shift" description="Minimal movement" />
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
                  style={{
                    borderRadius: "var(--corner-radius-300)",
                  }}
                >
                  <Card
                    padding={300}
                    cornerRadius={3}
                    showBorder={true}
                    shadow={undefined}
                    style={{
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "120px",
                          borderRadius: "var(--corner-radius-200)",
                          overflow: "hidden",
                          backgroundColor: "var(--bg-page-secondary)",
                        }}
                      >
                        <img
                          src="/images/preview/3x2_1024x683_preview.png"
                          alt="Soft Glow"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-100)",
                        }}
                      >
                        <h6
                          style={{
                            fontFamily: "var(--font-secondary)",
                            fontSize: "var(--fonts-body-regular-text-size)",
                            fontWeight: "var(--font-weight-secondary-semibold)",
                            color: "var(--fg-neutral)",
                            margin: 0,
                          }}
                        >
                          Soft Glow
                        </h6>
                        <p
                          style={{
                            fontFamily: "var(--font-secondary)",
                            fontSize: "var(--fonts-body-small-text-size)",
                            color: "var(--fg-neutral-secondary)",
                            margin: 0,
                            lineHeight: "var(--fonts-body-small-line-height)",
                          }}
                        >
                          Gentle glow effect
                        </p>
                      </div>
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
                    borderWidth: "var(--border-width-25)",
                    borderStyle: "solid",
                    borderRadius: "var(--corner-radius-300)",
                  }}
                >
                  <Card
                    padding={300}
                    cornerRadius={3}
                    showBorder={false}
                    style={{
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-200)",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "120px",
                          borderRadius: "var(--corner-radius-200)",
                          overflow: "hidden",
                          backgroundColor: "var(--bg-page-secondary)",
                        }}
                      >
                        <img
                          src="/images/preview/3x2_1024x683_preview.png"
                          alt="Border Fade"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-100)",
                        }}
                      >
                        <h6
                          style={{
                            fontFamily: "var(--font-secondary)",
                            fontSize: "var(--fonts-body-regular-text-size)",
                            fontWeight: "var(--font-weight-secondary-semibold)",
                            color: "var(--fg-neutral)",
                            margin: 0,
                          }}
                        >
                          Border Fade
                        </h6>
                        <p
                          style={{
                            fontFamily: "var(--font-secondary)",
                            fontSize: "var(--fonts-body-small-text-size)",
                            color: "var(--fg-neutral-secondary)",
                            margin: 0,
                            lineHeight: "var(--fonts-body-small-line-height)",
                          }}
                        >
                          Border opacity transition
                        </p>
                      </div>
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
                <Card3D intensity={15} perspective={1000} scale={1.05}>
                  <SmallCard title="3D Tilt Card" description="Mouse-based tilt" />
                </Card3D>
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
                <TiltContainer maxTilt={10} perspective={1000} scale={1.02}>
                  <SmallCard title="Tilt Container" description="Alternative tilt" />
                </TiltContainer>
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
                <ParallaxHover>
                  <SmallCard title="Parallax Hover" description="Depth effect" />
                </ParallaxHover>
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
                <DepthGlow>
                  <SmallCard title="Depth Glow" description="Glowing shadow" />
                </DepthGlow>
              </AnimationShowcase>
            </div>
        </section>
      </article>
    </PageLayout>
  );
}

