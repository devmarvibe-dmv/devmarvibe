import type { LucideIcon } from "lucide-react";
import {
  Smartphone,
  Server,
  PenTool,
  FileText,
  Share2,
  Target,
  Search,
  Calculator,
} from "lucide-react";

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean;
};

export const services: Service[] = [
  {
    title: "Web & Mobile Development",
    description:
      "Responsive web and mobile apps tailored to your business goals and your users.",
    icon: Smartphone,
    featured: true,
  },
  {
    title: "Backend Development",
    description:
      "Secure, scalable backend systems that power your apps and core operations.",
    icon: Server,
    featured: true,
  },
  {
    title: "Branding & Design",
    description:
      "Distinctive brand systems and digital experiences that make your business memorable.",
    icon: PenTool,
  },
  {
    title: "Content Writing",
    description:
      "Clear, SEO-friendly content that earns attention and builds your online presence.",
    icon: FileText,
  },
  {
    title: "Social Media Marketing",
    description:
      "Targeted content and audience engagement strategies that grow your brand.",
    icon: Share2,
  },
  {
    title: "Paid Campaigns",
    description:
      "Data-led PPC and ad campaigns designed to maximize reach, conversion, and ROI.",
    icon: Target,
  },
  {
    title: "SEO",
    description:
      "Expert search strategies that improve visibility and bring qualified traffic to you.",
    icon: Search,
  },
  {
    title: "Accounting & Tax Solutions",
    description:
      "Complete financial support for compliance, clarity, and smarter business decisions.",
    icon: Calculator,
  },
];
