import type { Metadata } from "next";
import {
  Expertise,
  Hero,
  Philosophy,
  SelectedWork,
} from "@/components/sections";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  pathname: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Expertise />
      <SelectedWork />
    </>
  );
}
