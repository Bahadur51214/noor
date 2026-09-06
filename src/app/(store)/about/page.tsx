import Image from "next/image";

export const metadata = {
  title: "About NOOR | Premium Women's Watches in Pakistan",
  description: "Discover the story behind NOOR — Pakistan's destination for elegant, premium women's watches.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About NOOR | Premium Women's Watches in Pakistan",
    description: "Discover the story behind NOOR — Pakistan's destination for elegant, premium women's watches.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Hero */}
      <section className="bg-[#0D0D0D] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-serif mb-6">Our Story</h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            NOOR was born from a simple belief — that every woman deserves to wear elegance on her wrist
            without compromise. We curate and craft premium timepieces that celebrate femininity,
            sophistication, and the quiet confidence of the modern Pakistani woman.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-[#0D0D0D] mb-6">Why NOOR?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                In a market flooded with mass-produced accessories, we saw a gap — an absence of
                thoughtfully designed, premium-quality women&apos;s watches at accessible prices. NOOR fills
                that gap with intention.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every watch in our collection is selected for its design, durability, and the way it
                makes you feel when you wear it. From boardroom meetings to evening gatherings,
                a NOOR watch is your silent statement of grace.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We ship across all major cities in Pakistan with secure packaging, reliable couriers,
                and a customer-first approach that has earned us the trust of thousands of women nationwide.
              </p>
            </div>
            <div className="bg-[#0D0D0D] rounded-2xl p-8 md:p-12 text-center">
              <p className="text-[#C9A96E] text-5xl md:text-6xl font-serif mb-4">&ldquo;</p>
              <p className="text-white text-lg md:text-xl font-serif italic leading-relaxed">
                Elegance is not about being noticed. It&apos;s about being remembered.
              </p>
              <p className="text-gray-400 mt-6 text-sm">— The NOOR Philosophy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-serif text-[#0D0D0D] mb-12 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality First",
                desc: "Every watch undergoes rigorous quality checks before it reaches your doorstep. We guarantee craftsmanship that lasts.",
              },
              {
                title: "Affordable Luxury",
                desc: "Premium doesn't have to mean expensive. We work directly with manufacturers to bring you the best value.",
              },
              {
                title: "Customer Love",
                desc: "From quick responses on WhatsApp to hassle-free returns, your satisfaction is our North Star.",
              },
            ].map((v) => (
              <div key={v.title} className="border border-[#E0DCD5] rounded-xl p-8 text-center">
                <h3 className="text-lg font-serif text-[#0D0D0D] mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
