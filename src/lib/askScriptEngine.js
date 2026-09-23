import { PROFILE, EXPERIENCE, WORKS, STACK, DEV_QUOTES, SOCIALS } from './portfolioData.js'

// Clean and normalize user question for pattern matching
function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getScriptedResponse(question) {
  const q = normalize(question)
  const firstName = PROFILE.name.split(' ')[0]
  const email = PROFILE.email
  const phone = PROFILE.phone
  const github = SOCIALS.find((s) => s.key === 'github')?.href || 'https://github.com/markineb'
  const linkedin = SOCIALS.find((s) => s.key === 'linkedin')?.href || '#'

  // 1. SPECIFIC PROJECTS / CAMPUSPARK / PORTFOLIO WORKS
  if (
    /\b(campuspark|campus park|parking|project|projects|work|works|portfolio|built|made|system|systems|app|application|monitoring|gawa|proyekto)\b/.test(
      q
    )
  ) {
    const campusPark = WORKS.find((w) => w.id === 'campus-parking') || WORKS[0]
    const projDesc = campusPark
      ? `One of his primary projects is **${campusPark.title}** (${campusPark.fullTitle || campusPark.title}) — a ${campusPark.category} built to streamline campus parking through real-time monitoring, clean dashboards, and responsive slot tracking using **${campusPark.tags.join(', ')}**.`
      : `${firstName} has created multiple responsive web applications.`

    return {
      text: `📂 **Featured Projects by ${firstName}**:\n\n${projDesc}\n\nHe also continuously builds front-end experiments, responsive landing pages, and web application dashboards.`,
      suggestions: [
        'What tech stack was used for CampusPark?',
        'Is he available for OJT?',
        'Download his Resume / CV',
      ],
      actions: [
        { label: 'GitHub Repository', href: campusPark?.repo || github, type: 'external' },
      ],
    }
  }

  // 2. TECH STACK & SKILLS
  if (
    /\b(stack|tech|technology|technologies|skills|tools|languages|language|framework|frameworks|frontend|backend|html|css|javascript|react|tailwind|php|mysql|database|gamit|alam)\b/.test(
      q
    )
  ) {
    const frontend = (STACK.Frontend || []).map((s) => s.name).join(', ')
    const backend = (STACK.Backend || []).map((s) => s.name).join(', ')
    const aiTools = (STACK['AI & Agents'] || []).map((s) => s.name).join(', ')
    const devTools = (STACK['Dev Tools'] || []).map((s) => s.name).join(', ')

    return {
      text: `Here is **${firstName}'s** current **Tech Stack & Skills**:\n\n` +
        `• **Frontend**: ${frontend}\n` +
        `• **Backend & DB**: ${backend}\n` +
        `• **Dev Tools**: ${devTools}\n` +
        `• **AI & Productivity**: ${aiTools}\n\n` +
        `He focuses on modular code, clean component architecture, and mobile-first responsiveness.`,
      suggestions: [
        'What projects has he built with this stack?',
        'Is he available for OJT?',
        'How can I get in touch with him?',
      ],
      actions: [
        { label: 'GitHub Repositories', href: github, type: 'external' },
      ],
    }
  }

  // 3. RESUME / CV
  if (/\b(resume|cv|curriculum vitae|biodata|pdf|document|dokumento)\b/.test(q)) {
    return {
      text: `📄 You can view and download **${PROFILE.name}'s** official **Curriculum Vitae (CV)** using the link below.\n\nIt details his educational background, technical proficiencies, and project experience.`,
      suggestions: [
        'Is he available for OJT / Internship?',
        'What is his contact information?',
        'What are his primary skills?',
      ],
      actions: [
        { label: 'Download CV (PDF)', href: PROFILE.resume, type: 'file' },
      ],
    }
  }

  // 4. OJT / INTERNSHIP / HIRING / AVAILABILITY
  if (
    /\b(ojt|intern|internship|hire|hiring|available|availability|open to|job|work with|freelance|part time|full time|trabaho)\b/.test(
      q
    ) ||
    /\b(pwede|pede|puwede)\s+(mag|ma|kunin|ihire)/.test(q)
  ) {
    return {
      text: `✅ **Yes, ${firstName} is actively available for OJT!**\n\n` +
        `He is currently open to **On-the-Job Training (OJT)** and internship opportunities as a **Front-End Developer** or **UI/UX Designer**.\n\n` +
        `He is eager to bring dedication, fast learning, and quality frontend code to your team!`,
      suggestions: [
        'How can I schedule a meeting?',
        'View contact details',
        'Download his Resume / CV',
      ],
      actions: [
        { label: 'Send an Email', href: `mailto:${email}`, type: 'email' },
        { label: 'Download CV (PDF)', href: PROFILE.resume, type: 'file' },
      ],
    }
  }

  // 5. EDUCATION / SCHOOL / COLLEGE
  if (
    /\b(school|college|university|education|course|degree|granby|bsit|student|study|paaralan|aral|aaral|estudyante)\b/.test(
      q
    )
  ) {
    return {
      text: `🎓 **Education**:\n\n` +
        `Benmark is currently a **3rd Year BSIT (Bachelor of Science in Information Technology)** student at **${PROFILE.school}** (2023 — Present).\n\n` +
        `He is dedicated to advancing his expertise in Front-End Engineering, UI/UX implementation, and modern web application systems.`,
      suggestions: [
        'Is he looking for an OJT role?',
        'What projects has he created for school?',
        'How can I contact him?',
      ],
      actions: [
        { label: 'Download CV / Resume', href: PROFILE.resume, type: 'file' },
      ],
    }
  }

  // 6. CONTACT / EMAIL / SOCIALS
  if (
    /\b(contact|email|phone|number|reach|message|social|socials|facebook|linkedin|github|instagram|telegram|call|talk|usap|makipag)\b/.test(
      q
    )
  ) {
    return {
      text: `You can reach **${firstName}** directly via:\n\n` +
        `• **Email**: ${email}\n` +
        `• **Phone**: ${phone}\n` +
        `• **Location**: ${PROFILE.location}\n\n` +
        `You can also schedule a quick discussion via the "Book a Meeting" button in the menu!`,
      suggestions: [
        'Is he available for OJT?',
        'Download his Resume / CV',
        'What projects has he built?',
      ],
      actions: [
        { label: 'Send an Email', href: `mailto:${email}`, type: 'email' },
        { label: 'LinkedIn', href: linkedin, type: 'external' },
        { label: 'GitHub', href: github, type: 'external' },
      ],
    }
  }

  // 7. SERVICES / CAPABILITIES
  if (
    /\b(service|services|offer|what can he do|can he do|website|web app|landing page|ui|ux|design|capabilities|kaya)\b/.test(
      q
    )
  ) {
    return {
      text: `💡 **What ${firstName} Can Do**:\n\n` +
        `1. **Front-End Web Development** — Building fast, responsive, and interactive interfaces with React, Tailwind CSS, and JavaScript.\n` +
        `2. **UI/UX Implementation** — Turning Figma designs and mockups into pixel-perfect code.\n` +
        `3. **School & Management Portals** — Creating CRUD systems and monitoring dashboards (e.g. PHP & MySQL).\n` +
        `4. **Performance & Optimization** — Fast loading speeds, clean animations, and mobile-friendly usability.`,
      suggestions: [
        'What is his tech stack?',
        'Explore his projects',
        'Is he available for OJT?',
      ],
      actions: [
        { label: 'Get in Touch', href: `mailto:${email}`, type: 'email' },
      ],
    }
  }

  // 8. QUOTES / MINDSET
  if (/\b(quote|quotes|motto|mindset|joke|saying|philosophy|linus|kasabihan)\b/.test(q)) {
    const randomQuote = DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)]
    return {
      text: `Favorite developer quote from ${firstName}'s portfolio:\n\n> *"${randomQuote.quote}"*\n> — **${randomQuote.author}** (${randomQuote.role})`,
      suggestions: [
        `What is ${firstName}'s tech stack?`,
        'Is he available for OJT?',
        'How can I reach him?',
      ],
      actions: [],
    }
  }

  // 9. WHO IS BENMARK / ABOUT / PROFILE
  if (
    /\b(who is|who are you|about|tell me about|background|biography|bio|profile|pakilala|sino)\b/.test(
      q
    )
  ) {
    return {
      text: `**${PROFILE.name}** (${PROFILE.handle}) is a **${PROFILE.study}** at **${PROFILE.school}** and an enthusiastic **Front-End Developer**.\n\nHe specializes in building clean, fast, accessible, and visually refined digital experiences with modern web technologies such as **React**, **Tailwind CSS**, and **JavaScript**.`,
      suggestions: [
        `What technologies does ${firstName} use?`,
        'What projects has he built?',
        'Is he available for an OJT role?',
      ],
      actions: [
        { label: 'View GitHub', href: github, type: 'external' },
        { label: 'LinkedIn Profile', href: linkedin, type: 'external' },
      ],
    }
  }

  // 10. GREETINGS
  if (
    /^(hi|hello|hey|kamusta|musta|yo|sup|good day|good morning|good afternoon|good evening|greetings)\b/.test(
      q
    )
  ) {
    return {
      text: `Hello! 👋 I'm **${PROFILE.name}'s** portfolio assistant.\n\nI can answer questions about his **tech stack**, **projects**, **education**, or **availability for OJT**. What would you like to explore?`,
      suggestions: [
        `What is ${firstName}'s tech stack?`,
        'What projects has he built?',
        'Is he available for OJT?',
      ],
      actions: [],
    }
  }

  // 11. THANKS / COURTESY
  if (/\b(thanks|thank you|salamat|ty|arigato|cheers|awesome|cool|great|nice)\b/.test(q)) {
    return {
      text: `You're very welcome! 😊 Glad I could help. Feel free to ask anything else or reach out directly to **${firstName}** for projects and collaborations!`,
      suggestions: [
        'How can I contact him?',
        'Is he available for OJT?',
        'Download his Resume / CV',
      ],
      actions: [
        { label: 'Email Benmark', href: `mailto:${email}`, type: 'email' },
      ],
    }
  }

  // 12. HELP / GUIDE
  if (/\b(help|guide|menu|options|commands|topics|what can i ask)\b/.test(q)) {
    return {
      text: `Here are some popular topics you can ask me about:\n\n` +
        `1. **Tech Stack & Skills** (programming languages, libraries, and tools)\n` +
        `2. **Projects** (CampusPark and other web projects)\n` +
        `3. **Education** (Granby Colleges degree and courses)\n` +
        `4. **OJT Availability** (internship and hiring status)\n` +
        `5. **Contact & Socials** (email, phone, LinkedIn, GitHub)\n` +
        `6. **Resume / CV** (view and download CV)`,
      suggestions: [
        `What is ${firstName}'s tech stack?`,
        'Is he available for OJT?',
        'Show me his projects',
      ],
      actions: [],
    }
  }

  // 13. SMART FALLBACK
  return {
    text: `Thanks for your question! While I don't have an exact answer for that specific inquiry, you can ask about ${firstName}'s **tech stack**, **featured projects**, **education at Granby**, or **OJT availability**.\n\nYou can also email ${firstName} directly at **${email}** for any inquiries or opportunities!`,
    suggestions: [
      `What is ${firstName}'s tech stack?`,
      'What projects has he built?',
      'Is he available for OJT?',
      'How can I get in touch?',
    ],
    actions: [
      { label: 'Send an Email', href: `mailto:${email}`, type: 'email' },
    ],
  }
}
