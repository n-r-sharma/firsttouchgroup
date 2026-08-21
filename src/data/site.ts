import { isPlaceholderValue } from "../lib/placeholders";
import type { ImageMetadata } from "astro";

import heroOffice from "../assets/images/hero-office.png";
import heroHotel from "../assets/images/hero-hotel.png";
import heroProperty from "../assets/images/hero-property.png";
import heroWindowCleaners from "../assets/images/hero-window-cleaners.jpg";
import heroFloorCleaner from "../assets/images/hero-floor-cleaner.jpg";
import heroCleanCorridor from "../assets/images/hero-clean-corridor.jpg";
import heroRopeAccess from "../assets/images/hero-rope-access.jpg";
import heroWindowDetail from "../assets/images/hero-window-detail.jpg";
import heroClinicalCleaner from "../assets/images/hero-clinical-cleaner.jpg";
import serviceContract from "../assets/images/service-contract.png";
import serviceDeep from "../assets/images/service-deep.png";
import serviceFloor from "../assets/images/service-floor.png";
import serviceWindow from "../assets/images/service-window.png";
import serviceWashroom from "../assets/images/service-washroom.png";

export interface Service {
  id: string;
  name: string;
  summary: string;
  image: ImageMetadata;
  imageAlt: string;
}

export interface Sector {
  id: string;
  name: string;
  summary: string;
  quoteLabel: string;
  image: ImageMetadata;
  imageAlt: string;
}

export interface Standard {
  id: string;
  title: string;
  body: string;
  image: ImageMetadata;
  imageAlt: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  body: string;
}

export interface TrustItem {
  id: string;
  title: string;
  body: string;
}

export interface ContactConfig {
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  serviceArea: string;
  websiteUrl: string;
  detailsConfirmed: boolean;
}

export interface AnalyticsConfig {
  measurementId: string;
}

export const site = {
  name: "First Touch Group",
  legalName: "First Touch Group",
  tagline: "The standard behind every first impression.",
  url: "https://www.firsttouchgroup.co.uk",
  locale: "en-GB",
  description:
    "Premium commercial cleaning and workplace services for offices, boutique hotels, managed properties, retail, and showrooms across London and surrounding areas.",
  privacyLegallyReviewed: false,
};

export const contact: ContactConfig = {
  email: "hello@firsttouchgroup.co.uk",
  phoneDisplay: "07900 123 456",
  phoneHref: "tel:+447900123456",
  serviceArea: "London and surrounding areas",
  websiteUrl: "https://www.firsttouchgroup.co.uk",
  detailsConfirmed: false,
};

export const analytics: AnalyticsConfig = {
  measurementId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? "",
};

export const formspreeFormId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID ?? "";
export const cookiebotId =
  import.meta.env.PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID ?? "";

export const navigation = [
  { href: "/#standards", label: "Standards" },
  { href: "/#services", label: "Services" },
  { href: "/#sectors", label: "Sectors" },
  { href: "/#process", label: "Process" },
] as const;

export const heroSlides = [
  {
    id: "window-cleaners",
    image: heroWindowCleaners,
    alt: "Two cleaners washing the glass entrance of a modern commercial building.",
    position: "62% 48%",
    mobilePosition: "63% 48%",
  },
  {
    id: "floor-cleaner",
    image: heroFloorCleaner,
    alt: "A cleaner mopping a polished commercial entrance in warm evening light.",
    position: "58% 50%",
    mobilePosition: "58% 50%",
  },
  {
    id: "clean-corridor",
    image: heroCleanCorridor,
    alt: "A cleaner mopping the reflective floor of a bright modern corridor.",
    position: "58% 55%",
    mobilePosition: "57% 54%",
  },
  {
    id: "rope-access",
    image: heroRopeAccess,
    alt: "Three rope-access window cleaners working across a glass office facade.",
    position: "50% 50%",
    mobilePosition: "42% 50%",
  },
  {
    id: "window-detail",
    image: heroWindowDetail,
    alt: "A window cleaner detailing the glass of a stone commercial building from a ladder.",
    position: "60% 50%",
    mobilePosition: "61% 50%",
  },
  {
    id: "clinical-cleaner",
    image: heroClinicalCleaner,
    alt: "A cleaner in protective clothing mopping a bright clinical workspace.",
    position: "62% 50%",
    mobilePosition: "67% 50%",
  },
] as const;

export const trustItems: TrustItem[] = [
  {
    id: "people",
    title: "Carefully selected",
    body: "Carefully recruited, DBS checked, and trained before they arrive on site.",
  },
  {
    id: "compliance",
    title: "Fully compliant",
    body: "PAYE employed teams, insured, with health and safety and GDPR handled as standard.",
  },
  {
    id: "quality",
    title: "Quality focused",
    body: "Audited cleans and quality checks so the standard does not drift from visit to visit.",
  },
  {
    id: "cover",
    title: "Flexible cover",
    body: "Our trained cover team steps in for sickness, holidays, and urgent changes, so the work still happens.",
  },
];

export const services: Service[] = [
  {
    id: "contract-cleaning",
    name: "Contract cleaning",
    summary:
      "Scheduled daily and weekly cleaning that keeps workplaces consistently presentable, without disrupting the people who use them.",
    image: serviceContract,
    imageAlt:
      "A cleaner in a plain navy polo wiping a glass meeting table in an empty office after hours.",
  },
  {
    id: "deep-cleans",
    name: "Deep cleans",
    summary:
      "Periodic, thorough work beyond the daily routine — edges, fixtures, and the places that quietly collect wear.",
    image: serviceDeep,
    imageAlt:
      "Gloved hands carefully cleaning a stone kitchenette counter during a detailed deep clean.",
  },
  {
    id: "washroom-services",
    name: "Washroom services",
    summary:
      "Hygiene, restocking, and a finish that guests and colleagues notice the moment they walk in.",
    image: serviceWashroom,
    imageAlt:
      "A premium stone washroom vanity with folded towels and unlabelled amber bottles.",
  },
  {
    id: "floor-care",
    name: "Floor care",
    summary:
      "Hard floors, stone, and carpets kept to a premium standard, protecting both appearance and the material itself.",
    image: serviceFloor,
    imageAlt: "A marble lobby floor being machine-polished to a quiet sheen.",
  },
  {
    id: "window-cleaning",
    name: "Window cleaning",
    summary:
      "Clear glass, inside and out, that lifts the whole space and the first view of it.",
    image: serviceWindow,
    imageAlt:
      "Floor-to-ceiling office windows being cleaned, with a soft city skyline beyond.",
  },
  {
    id: "consumables-supply",
    name: "Consumables supply",
    summary:
      "Quality washroom and workplace supplies, replenished reliably so presentation never depends on a last-minute run.",
    image: serviceWashroom,
    imageAlt:
      "Neatly arranged washroom consumables on a stone vanity in a premium commercial restroom.",
  },
  {
    id: "out-of-hours-cleaning",
    name: "Out-of-hours cleaning",
    summary:
      "Discreet service around your people, guests, and operations — early, late, or overnight as the building requires.",
    image: serviceContract,
    imageAlt:
      "An after-hours office being cleaned while city lights show through the windows.",
  },
];

export const sectors: Sector[] = [
  {
    id: "offices",
    name: "Offices & workplaces",
    summary:
      "Reception to boardroom, kept to a standard that matches the work happening inside.",
    quoteLabel: "Quote for your workplace",
    image: heroOffice,
    imageAlt:
      "A bright, empty office lobby with polished floors and a calm reception desk.",
  },
  {
    id: "hotels",
    name: "Boutique hotels",
    summary:
      "Guest-facing spaces where cleanliness is part of the stay, delivered quietly and on your timetable.",
    quoteLabel: "Quote for your hotel",
    image: heroHotel,
    imageAlt: "A boutique hotel lobby dressed with linen, brass, and fresh flowers.",
  },
  {
    id: "properties",
    name: "Managed properties",
    summary:
      "Common parts and amenity spaces that residents, tenants, and visitors judge in a glance.",
    quoteLabel: "Quote for your property",
    image: heroProperty,
    imageAlt:
      "A quietly luxurious mansion-block hallway with a runner carpet and daylight.",
  },
  {
    id: "retail",
    name: "Retail & showrooms",
    summary:
      "Customer-facing spaces kept polished and ready, from opening checks to discreet after-hours resets.",
    quoteLabel: "Quote for your retail space",
    // Temporary sector image until dedicated retail photography is commissioned.
    image: serviceFloor,
    imageAlt:
      "A cleaner polishing the floor of a premium customer-facing commercial interior.",
  },
];

export const standards: Standard[] = [
  {
    id: "recruitment",
    title: "Recruitment and DBS checks",
    body: "We recruit carefully, take up references, and DBS check the people who represent us on your premises. Training happens before the first shift, not on it.",
    image: serviceContract,
    imageAlt: "A trained cleaner working calmly in a modern office after hours.",
  },
  {
    id: "paye",
    title: "PAYE and compliance",
    body: "Our cleaners are PAYE employed. Insurance, health and safety policy, and GDPR handling sit behind every contract. You are not absorbing informal labour risk.",
    image: heroOffice,
    imageAlt: "A well-ordered office lobby kept to a professional standard.",
  },
  {
    id: "audits",
    title: "Quality audits",
    body: "Cleans follow a checklist. We audit the work, not just complete it, so the standard stays visible and repeatable from visit to visit.",
    image: serviceDeep,
    imageAlt: "Close work during a quality-focused deep clean of a stone surface.",
  },
  {
    id: "cover",
    title: "Cover you can rely on",
    body: "Sickness, holidays, and last-minute change are part of real buildings. A bank of trusted cleaners means the work still happens.",
    image: heroHotel,
    imageAlt: "A boutique hotel lobby ready for guests, kept in quiet order.",
  },
  {
    id: "eco",
    title: "Eco-friendly products",
    body: "We specify products that are effective on premium finishes and kinder to the people and rooms they are used in. No harsh showmanship, no damage to materials.",
    image: serviceWashroom,
    imageAlt: "Unlabelled amber bottles and folded towels in a premium washroom.",
  },
  {
    id: "pay",
    title: "Fair pay",
    body: "We pay our team above the legal minimum — typically £13 to £15 an hour — because stable, motivated people deliver a more reliable service. Great people keep the standard.",
    image: heroProperty,
    imageAlt: "A carefully kept residential hallway in a managed London property.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "consult",
    title: "Consult",
    body: "We walk the space, listen to how it is used, and agree the standard you need people to feel when they arrive.",
  },
  {
    id: "plan",
    title: "Plan",
    body: "A written cleaning plan: frequency, hours, products, access, and the details that stop a contract going vague after week one.",
  },
  {
    id: "deliver",
    title: "Deliver",
    body: "A trained, consistent team carries out the work around your operations, with cover already thought through.",
  },
  {
    id: "review",
    title: "Review",
    body: "We review, refine, and keep raising the standard. The contract should get sharper, not looser, over time.",
  },
];

export const propertyTypes = [
  { id: "offices", label: "Offices & workplaces" },
  { id: "hotels", label: "Boutique hotels" },
  { id: "properties", label: "Managed properties" },
  { id: "retail", label: "Retail & showrooms" },
  { id: "other", label: "Other / mixed" },
] as const;

export function isLaunchConfigReady(): boolean {
  return (
    site.privacyLegallyReviewed &&
    contact.detailsConfirmed &&
    !isPlaceholderValue(formspreeFormId) &&
    !isPlaceholderValue(analytics.measurementId) &&
    !isPlaceholderValue(cookiebotId) &&
    !isPlaceholderValue(contact.email) &&
    !isPlaceholderValue(contact.phoneDisplay)
  );
}
