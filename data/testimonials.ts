export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  { quote: 'DevMarvibe turned a complex idea into a product our customers actually love using. The team brought clarity to every step.', name: 'Aarav Mehta', role: 'Founder', company: 'Northstar Labs' },
  { quote: 'They felt like an extension of our team from day one. We shipped a reliable platform faster than we thought possible.', name: 'Maya Iyer', role: 'COO', company: 'Fieldwise' },
  { quote: 'From strategy to launch, every detail was considered. We now have the digital foundation to grow with confidence.', name: 'Rohan Kapoor', role: 'Director', company: 'Meridian Retail' },
];
