"use client";

import { Header } from "@/components";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="ds-layout">
      <Header />
      <main className="ds-layout__main ds-layout__main--centered">
        <div className="ds-not-found">
          <div className="ds-not-found__image">
            <img
              src="/images/vector/404img.svg"
              alt="Lost planet spaceship illustration"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="ds-not-found__content">
            <h3 className="ds-content__title">404</h3>
            <p className="ds-content__subtitle">
              Page Not Found
            </p>
            <p className="ds-content__text">
              The page you're looking for seems to have drifted off into space. 
              It might have been moved, deleted, or never existed.
            </p>
            <div className="ds-not-found__actions">
              <Link href="/" className="ds-not-found__button ds-not-found__button--primary">
                Take Me Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

