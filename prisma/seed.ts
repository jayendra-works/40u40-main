import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  hero: JSON.stringify({
    headline: "India's 40 Under 40",
    accentText: "Leaders 2026",
    subheadline:
      "Recognizing the next generation of entrepreneurs, innovators, and changemakers shaping the future of India.",
  }),
  stats: JSON.stringify({
    useNominationCount: false,
    items: [
      { value: 5000, suffix: "+", label: "Leaders recognized" },
      { value: 50, suffix: "+", label: "Countries represented" },
      { value: 100, suffix: "+", label: "Industry speakers" },
      { value: 2016, suffix: "", label: "Since" },
    ],
  }),
  about: JSON.stringify({
    title: "About the Awards",
    paragraph1:
      "40 Under 40 by Asia Inc. 500 is a national recognition platform celebrating exceptional leaders under the age of 40 who are transforming industries through innovation, leadership, and measurable impact.",
    paragraph2:
      "The initiative identifies rising entrepreneurs, executives, creators, and professionals shaping the future of India's economy. The program culminates in the India 40 Under 40 Leadership Summit & Awards Gala.",
    highlightedText: "India 40 Under 40 Leadership Summit & Awards Gala",
  }),
  why_recognition: JSON.stringify({
    title: "Why This Recognition Matters",
    subtitle:
      "Join a prestigious community of leaders driving change across industries.",
    cards: [
      {
        id: "industry",
        title: "Industry Recognition",
        description:
          "Join an elite cohort of leaders recognized by Asia Inc. 500 and industry peers for outstanding achievement.",
        visible: true,
      },
      {
        id: "media",
        title: "Media Visibility",
        description:
          "Featured in Asia Inc. 500 Magazine and across our media channels, amplifying your story and impact.",
        visible: true,
      },
      {
        id: "network",
        title: "Leadership Network",
        description:
          "Connect with fellow honorees, investors, and decision-makers at the Leadership Summit and beyond.",
        visible: true,
      },
      {
        id: "global_credibility",
        title: "Global Credibility",
        description:
          "Backed by global institutions, this platform positions leaders from India as credible global voices.",
        visible: true,
      },
      {
        id: "curated_honor",
        title: "Curated, Not Crowdsourced",
        description:
          "Selections are jury-led and merit-based, making the list a trusted benchmark of real excellence.",
        visible: true,
      },
      {
        id: "cross_industry",
        title: "Cross-Industry Influence",
        description:
          "The list spans business, technology, media, sports, and culture, reflecting modern leadership.",
        visible: true,
      },
      {
        id: "ecosystem_access",
        title: "Access to a Powerful Ecosystem",
        description:
          "Honorees gain access to founders, investors, creators, and strategic collaboration opportunities.",
        visible: true,
      },
      {
        id: "impact_not_success",
        title: "Impact, Not Just Success",
        description:
          "Recognition focuses on measurable innovation and contribution, not visibility alone.",
        visible: true,
      },
      {
        id: "future_of_india",
        title: "Representing India's Future",
        description:
          "These are the leaders expected to shape India’s global economic and cultural trajectory.",
        visible: true,
      },
    ],
  }),
  social_links: JSON.stringify({
    links: [
      { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
      { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
      { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    ],
  }),
  summit_date: JSON.stringify("2026-06-15"),
  footer_about: JSON.stringify(
    "Asia Inc. 500 is a premier business magazine and recognition platform dedicated to spotlighting excellence across Asia through influential publications, rankings, and leadership events."
  ),
  nomination_cta: JSON.stringify({
    headline: "Know someone redefining their industry before 40?",
    subheadline:
      "Nominate a leader or apply for yourself. Join the 2026 cohort.",
  }),
  magazine_feature: JSON.stringify({
    title: "Magazine Feature",
    body:
      "Selected leaders will be featured in a special edition of Asia Inc. 500 Magazine, highlighting their achievements and leadership journeys.",
    ctaText: "Learn about past editions →",
  }),
  visibility: JSON.stringify({
    showFooter: true,
    showProgramBrandSections: true,
  }),
};

const DEFAULT_TOP_CONTENDERS = [
  {
    id: "cmnk7x7ug00032yfw58yl596a", name: "Vicky Kaushal", title: "Bollywood’s New-Age Hitmaker", organization: "Actor | Entertainer | Box Office Performer | Youth Icon | Storytelling Star", category: "Entertainer", age: 37,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1775319097/40u40/admin/speakers/img_1775319097630.jpg",
    bio: "Vicky Kaushal is an Indian actor who works in Hindi films. Known for his work across a range of genres, he has received several accolades, including a National Film Award and three Filmfare Awards. He is regarded as one of the prominent actors of his generation in contemporary Hindi cinema.",
    instagramUrl: "https://www.instagram.com/vickykaushal09", isTopContender: true, sortOrder: 1,
  },
  {
    id: "cmnk7cat300002yfwhuvau2t3", name: "Ananya Shree Birla", title: "Multi-Dimensional Trailblazer", organization: "Founder | Financial Inclusion Pioneer | Entrepreneur | Culture Shaper | Global Recording Artist", category: "Finance", age: 31,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1775316443/40u40/admin/speakers/img_1775316443310.jpg",
    bio: "Ananya Shree Birla stands at the intersection of business, innovation, and artistic expression. As the founder of ventures like Svatantra Microfin, she has expanded access to financial services for underserved communities across India while building a career as a globally recognised music artist.",
    linkedinUrl: "https://www.linkedin.com/in/ananyabirla", instagramUrl: "https://www.instagram.com/ananyabirla", isTopContender: true, sortOrder: 2,
  },
  {
    id: "cmnk7ol0m00022yfw2fjsr74z", name: "KL Rahul", title: "Versatile Game Changer", organization: "International Batsman | Match Finisher | Tactical Leader | Elite Competitor | Precision Athlete", category: "Sports", age: 33,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1776076172/40u40/admin/speakers/img_1776076172058.jpg",
    bio: "KL Rahul is one of India’s most versatile and accomplished cricketers, known for his technical finesse, adaptability, and leadership under pressure. Representing India across formats, he combines elegance with impact and embodies the discipline of a high-performance athlete.",
    linkedinUrl: "https://www.linkedin.com/in/klrahul", instagramUrl: "https://www.instagram.com/klrahul", isTopContender: true, sortOrder: 3,
  },
  {
    id: "cmnk5jynt0002yxf7bcxe7m4d", name: "Karan Adani", title: "Maritime Power Architect", organization: "Entrepreneur | Founder | Microfinance Leader | Music Artist | Social Impact Advocate", category: "Entrepreneur", age: 38,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1775316415/40u40/admin/speakers/img_1775316415474.jpg",
    bio: "Karan Adani, Managing Director of Adani Ports & SEZ, has helped transform India’s maritime infrastructure into a globally competitive force. His focus on operational efficiency, sustainability, and global expansion continues to position India as a critical node in international trade corridors.",
    linkedinUrl: "https://www.linkedin.com/in/karan-adani", isTopContender: true, sortOrder: 4,
  },
  {
    id: "cmnk8m1xg00001edxi9cpfepn", name: "Akash Ambani", title: "Digital Pioneer", organization: "Chairman | Telecom Leader | Digital Strategist | Tech Innovator | Ecosystem Builder", category: "Technology", age: 34,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1775316548/40u40/admin/speakers/img_1775316548218.jpg",
    bio: "Akash Ambani, Chairman of Reliance Jio Infocomm, is at the forefront of India’s digital transformation. He has helped scale Jio into one of the world’s largest telecom and digital-services platforms, expanding affordable connectivity and next-generation services for millions.",
    instagramUrl: "https://www.instagram.com/aambani1", isTopContender: true, sortOrder: 5,
  },
];

const DEFAULT_FINALISTS = [
  {
    id: "finalist-rajesh-kshetry", name: "Rajesh Kshetry", title: "Cross-Border Legal Institution Builder", organization: "Founder & Managing Partner | Legal Strategist | Arbitration | Corporate Governance | Mentor", category: "Legal", age: 40,
    photo: "/finalists/rajesh-kshetry.jpg",
    bio: "Rajesh Kshetry is the Founder and Managing Partner of Kshetry and Associates, a legal practice he established in 2009 and has grown across India and international jurisdictions. His work spans litigation, corporate and commercial advisory, arbitration, regulatory strategy and cross-border matters, with a leadership approach centred on ethics, mentorship and long-term client trust.",
    linkedinUrl: "https://www.linkedin.com/in/rajesh-kshetry/", websiteUrl: "https://www.kshetryandassociates.com", isTopContender: false, sortOrder: 40,
  },
  {
    id: "finalist-nikhil-kamath", name: "Nikhil Kamath", title: "The Outlier Who Rewrote Indian Wealth", organization: "Co-Founder | Investor | Asset Manager | Philanthropist | Ecosystem Builder", category: "Finance", age: 39,
    photo: "https://inc42.com/wp-content/uploads/2023/09/cropped-Ather-Nikhil-Kamath-feature.png",
    bio: "Nikhil Kamath dropped out of school at 15 and went on to build Zerodha into India's largest retail stockbroker, opening the stock market to millions who were once priced out. Alongside his brother Nithin, he built a bootstrapped brokerage into one of the country's most valuable financial companies, later founding True Beacon and Gruhas to support wealth management and the next wave of startups.",
    isTopContender: false, sortOrder: 6,
  },
  {
    id: "finalist-ritesh-agarwal", name: "Ritesh Agarwal", title: "The Small-Town Boy Who Redesigned Global Hospitality", organization: "Founder | CEO | Thiel Fellow | Global Operator | Industry Disruptor", category: "Business", age: 32,
    photo: "https://akm-img-a-in.tosshub.com/aajtak/images/story/202212/oyo_founder_ritesh_agarwal-sixteen_nine.jpg?size=948%3A533",
    bio: "Ritesh Agarwal is the founder and CEO of OYO, one of the world's most recognised hospitality brands. Born in a small town in Odisha, he began his first venture at 17 and became the first Asian to win the Thiel Fellowship in 2013, growing a bold idea into a technology-led hospitality network serving travellers across the world.",
    isTopContender: false, sortOrder: 7,
  },
  {
    id: "finalist-shashank-kumar", name: "Shashank Kumar", title: "The Engineer Powering India's Digital Economy", organization: "Co-Founder | Managing Director | Product Builder | Fintech Leader | Ecosystem Architect", category: "Technology", age: 35,
    photo: "https://www.smbindia.com/2021/images/speakers/shashank.jpg",
    bio: "Shashank Kumar is the co-founder and Managing Director of Razorpay, one of India's most valuable fintech companies. After leaving a software role at Microsoft in the US, he and Harshil Mathur launched Razorpay in 2014 and grew it from a checkout tool into a full-stack financial platform powering lakhs of businesses across payments, banking, and payroll.",
    isTopContender: false, sortOrder: 8,
  },
  {
    id: "finalist-aadit-palicha", name: "Aadit Palicha", title: "The Founder Who Put India on the Clock", organization: "Co-Founder | CEO | Youth Icon | Consumer Tech Leader | Category Creator", category: "Commerce", age: 24,
    photo: "https://images.indianexpress.com/2022/05/zepto-founder-ceo-aadit-palicha-linkedin.jpeg",
    bio: "Aadit Palicha is the co-founder and CEO of Zepto, the platform that turned 10-minute grocery delivery into a daily habit for urban India. He left Stanford with childhood friend Kaivalya Vohra to build Zepto during the pandemic, scaling it into one of India's fastest-growing unicorns and a defining name in quick commerce.",
    isTopContender: false, sortOrder: 9,
  },
  {
    id: "finalist-jim-sarbh", name: "Jim Sarbh", title: "The Actor Who Makes Every Frame Count", organization: "Actor | Theatre Director | International Emmy Nominee | Screen Performer | Storytelling Star", category: "Entertainer", age: 39,
    photo: "https://staticimg.amarujala.com/assets/images/2018/02/06/jim-sarbh_1517891789.jpeg?dpr=2.6&q=80&w=480",
    bio: "Jim Sarbh is one of Indian cinema's most distinctive voices, known for acclaimed roles in Neerja, Padmaavat, Sanju, Gangubai Kathiawadi, and Rocket Boys. His portrayal of Dr. Homi Bhabha earned an International Emmy Best Actor nomination and a Filmfare OTT Award, reflecting the theatre-trained precision he brings to every performance.",
    isTopContender: false, sortOrder: 10,
  },
  {
    id: "finalist-alakh-pandey", name: "Alakh Pandey", title: "The Teacher Who Built a Unicorn from a Chalkboard", organization: "Founder | CEO | Educator | Edtech Innovator | Youth Mentor", category: "Education", age: 34,
    photo: "https://img.jagranjosh.com/images/2022/December/20122022/Alakh-pandey-physics-wallah.jpg",
    bio: "Alakh Pandey is the founder and CEO of Physics Wallah, the company that made India rethink what quality education should cost. He began sharing physics lessons on YouTube in 2016 and, with co-founder Prateek Maheshwari, built that community into India's first profitable edtech unicorn serving millions of competitive-exam aspirants.",
    isTopContender: false, sortOrder: 11,
  },
  {
    id: "finalist-smriti-mandhana", name: "Smriti Mandhana", title: "The Left-Hander Who Raised the Bar", organization: "Cricketer | Opening Batter | Vice-Captain | ICC Cricketer of the Year | Global Sports Icon", category: "Sports", age: 30,
    photo: "https://www.wisden.com/static-assets/images/players/63992.png?v=23.53",
    bio: "Smriti Mandhana is one of world cricket's finest opening batters and the vice-captain of the Indian women's team. A multiple-time ICC Women's Cricketer of the Year, she combines classical elegance with modern power and continues to expand what a generation of young Indian girls believe is possible in sport.",
    isTopContender: false, sortOrder: 12,
  },
  {
    id: "finalist-ghazal-alagh", name: "Ghazal Alagh", title: "The Mother Who Built a FMCG Empire", organization: "Co-Founder | Chief Innovation Officer | D2C Pioneer | Shark Tank India Judge | Brand Builder", category: "Business", age: 37,
    photo: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202405/ghazal-alagh-254302616-3x4.jpg?VersionId=KQ5DDJM0G3M8zV6H701hlwfYKk.OEaL_",
    bio: "Ghazal Alagh is the co-founder of Honasa Consumer, the parent company behind Mamaearth, The Derma Co., Aqualogica, BBlunt, and other personal-care brands. She and Varun Alagh launched Mamaearth in 2016 after searching for safe, toxin-free products for their child, turning that personal need into a publicly listed digital-first FMCG company.",
    isTopContender: false, sortOrder: 13,
  },
];

const DEFAULT_JURY = [
  {
    id: "cmn6bpsgi00023peeyvh5ggr5", name: "Camila Pinzon", title: "Crowned Miss World Colombia", organization: "#Influencer", sortOrder: 1,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1774460069/40u40/admin/jury/img_1774460068519.jpg",
    bio: "Camila Pinzon is a global ambassador and history-maker who blends academic excellence with profound social impact. The first representative from Boyacá to be crowned Miss World Colombia in 2022, she has become a leading voice for humanitarian causes across four continents. She holds double master’s degrees in marketing and management from Sorbonne University and has served as a guest lecturer at the University of Cambridge. As a Universal Peace Federation Ambassador for Peace, she has spearheaded relief missions in over ten countries.",
    instagramUrl: "https://www.instagram.com/camilapinzonk",
  },
  {
    id: "cmn6c7f5t00033pee9mo9h5wi", name: "Ghanshyam Dass", title: "Veteran International Banker", organization: "Capital Markets Advisor", sortOrder: 2,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1775110285/40u40/admin/jury/img_1775110284707.png",
    bio: "Ghanshyam Dass has had an outstanding career in domestic and international banking and capital markets for over 45 years, with a deep understanding of global markets and the regulatory environment across the USA, European Union, South East Asia, Middle East, and India. His senior advisory and executive roles include KPMG, Intel Capital, STJ Advisors, NASDAQ OMX, Majan International Bank, and The British Bank of the Middle East.",
    linkedinUrl: "https://www.linkedin.com/in/ghanshyam-dass-87871b14",
  },
  {
    id: "cmn6bngbt00013pee1ojsa3zm", name: "Dr. Ravi Singh", title: "Campaign Guru", organization: "SocialFi", sortOrder: 3,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1774459958/40u40/admin/jury/img_1774459957902.png",
    bio: "Dr. Ravneet (Ravi) Singh is an American Sikh scholar, political technologist, and systems architect whose work has shaped the convergence of cloud computing, artificial intelligence, social media platforms, and digital trust. Widely regarded as a founding figure of Social Finance, he has designed, analysed, and advised on large-scale digital engagement, coordination, and governance systems across more than 20 countries.",
    linkedinUrl: "https://www.linkedin.com/in/campaignguru", instagramUrl: "https://www.instagram.com/campaignguru",
  },
  {
    id: "cmn6bljuf00003peehucy8bfm", name: "Kaali Sudheer", title: "Visionary", organization: "Entrepreneur", sortOrder: 4,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1774459869/40u40/admin/jury/img_1774459869634.jpg",
    bio: "Kaali Sudheer is a visionary entrepreneur and strategic thinker creating large-scale ideas connecting technology, infrastructure, human development, and cinema. Founder and curator of Muse Art Gallery, he has built a diverse career across art, entertainment, and corporate leadership, and currently serves as Chief Strategy Officer at Harley’s Fine Baking.",
    linkedinUrl: "https://www.linkedin.com/in/sudheermopperthy", instagramUrl: "https://www.instagram.com/kaalisudheer",
  },
  {
    id: "cmnhlbrkt00012rdw1hk2hwp5", name: "Minal Srinivasan", title: "Visionary", organization: "Sustainability Thought Leader", sortOrder: 5,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1775141578/40u40/admin/jury/img_1775141578233.png",
    bio: "Minal Srinivasan is a visionary leader driving meaningful change in sustainable infrastructure while actively challenging gender norms within the industry. She is Managing Director of Kesari Infrabuild Pvt. Ltd., ranks among the top 2% of global leadership experts on LinkedIn, and is a sought-after speaker at ISB and global industry forums.",
    linkedinUrl: "https://www.linkedin.com/in/minal-srinivasan/", instagramUrl: "https://www.instagram.com/kesari_infrabuild/",
  },
  {
    id: "cmnhmse2r00062rdwrb9b7tcc", name: "Shourya K. Chakravarty", title: "Human Capital Visionary", organization: "People & Culture Strategist", sortOrder: 6,
    photo: "https://res.cloudinary.com/dajdidtlb/image/upload/v1775144108/40u40/admin/jury/img_1775144107981.jpg",
    bio: "Shourya K. Chakravarty is a distinguished HR leader with nearly three decades of experience in architecting high-impact people strategies and driving organisational excellence. As Chief Human Resources Officer at Aptech Limited, he cultivates agile, inclusive, future-ready workplace ecosystems, informed by leadership experience with Aditya Birla Group, GE, HSBC, and General Mills.",
    linkedinUrl: "https://linkedin.com/in/shouryakchakravarty", instagramUrl: "https://www.instagram.com/shouryakchakravarty",
  },
];

async function main() {
  // DB-backed admin credentials.
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (adminEmail && adminPassword) {
    const passwordHash = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        name: "Admin",
        role: "admin",
        passwordHash,
      },
      update: {
        role: "admin",
        passwordHash,
      },
    });
    console.log("Seeded admin user credentials");
  } else {
    console.warn("Skipped admin user seed: set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }

  await prisma.speaker.createMany({ data: DEFAULT_TOP_CONTENDERS, skipDuplicates: true });
  await prisma.speaker.createMany({ data: DEFAULT_FINALISTS, skipDuplicates: true });
  await prisma.speaker.updateMany({
    where: { id: { in: DEFAULT_TOP_CONTENDERS.map((contender) => contender.id) } },
    data: { isTopContender: true },
  });

  await prisma.juryMember.createMany({ data: DEFAULT_JURY, skipDuplicates: true });

  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: [
        { question: "Who can apply?", answer: "Entrepreneurs, startup founders, technology leaders, finance professionals, media creators, athletes, healthcare innovators, and social impact leaders under 40 who are driving measurable impact in their fields.", sortOrder: 1 },
        { question: "What is the age requirement?", answer: "Nominees must be under 40 years of age as of December 31, 2026. Both self-applications and third-party nominations are welcome.", sortOrder: 2 },
        { question: "How are winners selected?", answer: "After open nominations close, our team conducts research and screening. Shortlisted candidates are evaluated by an independent jury. The final 40 are selected based on innovation, leadership, impact, and potential.", sortOrder: 3 },
        { question: "Is there a nomination fee?", answer: "There is no fee to submit a nomination or application. The program is designed to recognize merit and impact regardless of financial capacity.", sortOrder: 4 },
        { question: "What do winners receive?", answer: "Winners are featured in a special edition of Asia Inc. 500 Magazine, receive the 40 Under 40 award at the Leadership Summit & Awards Gala, and gain access to an exclusive network of peers, investors, and industry leaders.", sortOrder: 5 },
      ],
    });
    console.log("Seeded FAQs");
  }

  for (const [key, value] of Object.entries(DEFAULT_SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: {},
    });
  }
  console.log("Seeded site settings (defaults only if missing)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
