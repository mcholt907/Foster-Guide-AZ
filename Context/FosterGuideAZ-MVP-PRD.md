# FosterGuide AZ — Lightweight MVP
## Product Requirements Document

**Version:** 0.1 Draft
**Status:** For Review
**Date:** March 2026
**Prepared by:** FosterGuide AZ Product Team

---

## 1. Executive Summary

FosterGuide AZ is an AI-powered information tool for Arizona foster youth ages 10–21. It delivers personalized, age-appropriate guidance about foster youth rights, the dependency court process, and available resources — grounded in current Arizona law and verified local organizations.

This document defines the requirements for the **Lightweight MVP**: a scoped first launch covering three core features, a RAG-powered AI chat, and a crisis safety layer. The MVP is designed to prove the product concept with real users, generate qualitative feedback, and establish the content and infrastructure foundation for subsequent phases.

---

## 2. The Problem

Arizona has approximately 9,000 children in foster care. Over half are never informed of their legal rights. Only 40% graduate high school on time — the lowest of any demographic in the state. Approximately 900 youth age out annually, with 40% experiencing homelessness within 18 months.

No digital tool exists that provides Arizona foster youth with personalized, age-appropriate guidance about their rights, their cases, or the resources available to them. Youth navigate a complex legal and social system largely alone, in language they often cannot understand, with no trusted on-demand resource.

---

## 3. Product Vision

Every child in Arizona's foster care system should be able to understand their rights, know what's happening in their case, and access the resources they need — in language they understand, on whatever device they have, in the moment they need it.

---

## 4. MVP Scope

### 4.1 What's In

| Feature | Description |
|---------|-------------|
| **Know Your Rights** | Full A.R.S. §8-529 content, age-adapted at four tiers, with an escalation guide for rights violations |
| **My Case Explained** | Arizona dependency court timeline (8 stages), role explainers, hearing prep tools |
| **Find Resources** | Searchable, county- and age-filtered directory of Arizona foster youth organizations |
| **AI Chat** | RAG-powered, scope-restricted, citation-required, age-adaptive chat — available from any screen |
| **Crisis Safety Layer** | Always-visible crisis resources (988, Crisis Text Line, DCS hotline, ALWAYS legal); immediate routing on crisis keywords |
| **Onboarding Flow** | Language → Age band → County → Pathway → Tribal indicator; one-tap demo personas |
| **Trauma-informed UX** | Quick exit, content warnings, no forced flows, calm transitions, session boundary reminder |

### 4.2 What's Out (MVP)

The following are explicitly deferred to Phase 2. They are not descoped permanently — they are excluded to keep the MVP focused and shippable.

| Deferred Feature | Rationale |
|-----------------|-----------|
| My Future Plan (full module) | High content complexity; EFC/ETV/housing workflows require deeper legal review and partnership with AzCA and AFFCF |
| Wellness Check-In (full module) | Clinical content requires advisory board review; crisis routing is included in the safety layer |
| Spanish translation | Launch requirement per product spec — included in Phase 1b (within 60 days of English launch); not deferred to Phase 2 |
| ICWA module | Requires tribal co-design; must not be launched without tribal partner review |
| Document preparation workflows | Requires step-by-step verification with Arizona Vital Records and ADOT; high error risk without legal review |
| Account creation / persistent profiles | Deferred pending COPPA compliance review for under-13 users |
| Push notifications / deadline reminders | Phase 2; requires account layer |
| iOS/Android app store submission | Phase 2; MVP launches as a PWA accessible from any mobile browser |
| Caregiver / foster parent mode | Phase 2 |

---

## 5. Users

### 5.1 Age Tiers

The app adapts content at four tiers. The same underlying information is restructured — not just simplified — at each level.

| Tier | Ages | Tone | Key Needs |
|------|------|------|-----------|
| Simple | 10–12 | 2–3 short sentences, friendly | Understanding why they're in care; core rights; who to talk to |
| Plain | 13–15 | Clear paragraphs, plain language | Full rights including 14+ rights; court process; how to ask for help |
| Action | 16–17 | Detailed with action items | Transition awareness; self-advocacy; hearing prep |
| Full | 18–21 | Professional, complete | Extended care navigation; re-entry; document replacement |

---

## 6. Feature Requirements

### 6.1 Onboarding

- **R-ON-1:** Language selection (English / Español). Spanish UI strings translated at launch; AI responses generated in selected language.
- **R-ON-2:** Age band selection (10–12 / 13–15 / 16–17 / 18–21). Each option shows a brief plain-language description of what the app helps with at that age.
- **R-ON-3:** County selection (all 15 Arizona counties). Used to filter the resource directory.
- **R-ON-4:** Pathway selection ("What brings you here today?") — 7 options matching the PATHWAYS data model. Routes user to relevant first feature.
- **R-ON-5:** Tribal membership indicator (Yes / No / Not sure). Enables ICWA-aware content flags where applicable in the MVP; full ICWA module is Phase 2.
- **R-ON-6:** All selections stored in device-local storage only. No account creation. No server-side storage.
- **R-ON-7:** One-tap demo personas (Maria, Jaylen, Destiny, Andre) available on the onboarding screen for demo/presentation contexts.
- **R-ON-8:** User can reset all preferences and return to onboarding at any time.

### 6.2 Know Your Rights

- **R-KYR-1:** Display the full content of A.R.S. §8-529 (Foster Youth Bill of Rights) plus Arizona Administrative Code R21-6-321, organized by category: safety, family contact, education, case participation, privacy, transition.
- **R-KYR-2:** Every right is presented as an expandable card showing: (a) the right in plain language for the user's age tier, (b) a concrete example of what it means in practice, and (c) the exact statute citation.
- **R-KYR-3:** Rights that apply only at age 14+ are labeled with a "New at 14" badge and hidden from the 10–12 tier view.
- **R-KYR-4:** A "What if my rights are being violated?" section presents a 4-step escalation ladder: caseworker → supervisor → DCS Ombudsman → attorney/court. Each step includes a plain-language action prompt and cites A.R.S. §8-529(D).
- **R-KYR-5:** The AI chat is available from the Rights screen with suggested prompts appropriate to rights topics.

### 6.3 My Case Explained

- **R-MCE-1:** Visual timeline of the Arizona dependency process covering all 8 stages: hotline report → investigation → TDM → preliminary protective hearing → adjudication → disposition → review hearing → permanency hearing.
- **R-MCE-2:** Each stage is expandable and shows: what happens, who is involved, what the youth can do, what comes next, and typical duration.
- **R-MCE-3:** "Who's who in my case" section explains: DCS Specialist, GAL, CASA, AAG, FCRB, and judge — each with a plain-language role description and how the youth can communicate with them.
- **R-MCE-4:** Case plan goal explainer covers: reunification, severance and adoption, permanent guardianship, and extended foster care — in plain language at the user's age tier.
- **R-MCE-5:** Hearing prep tool provides a customizable list of questions for youth to bring to their next hearing, adapted to their age tier.
- **R-MCE-6:** When tribal membership is indicated, an ICWA awareness notice is displayed with a note that tribe-specific guidance requires the ICWA module (Phase 2). Content does not misrepresent what ICWA protections apply without tribal co-design review.
- **R-MCE-7:** The 10–12 tier renders the court timeline as a simplified story-style narrative rather than a detailed stage-by-stage view.

### 6.4 Find Resources

- **R-FR-1:** Searchable, filterable directory of Arizona organizations relevant to foster youth. MVP target: 50+ verified entries (100+ is the full-product goal).
- **R-FR-2:** Each resource listing includes: organization name, what they provide, who is eligible (age range), phone number (click-to-call on mobile), website (external link), county availability, and whether Spanish-speaking staff are available.
- **R-FR-3:** Filter by need category: housing, education, legal, health, employment, emergency, transition, food, money.
- **R-FR-4:** Filter by county: shows resources available in the user's selected county plus statewide resources. Clearly indicates when a resource is not available in the user's county.
- **R-FR-5:** Filter by age: shows only resources the user qualifies for based on their stated age band.
- **R-FR-6:** Crisis resources (988, Crisis Text Line, DCS hotline, ALWAYS) are pinned at the top of the Resources screen regardless of filters applied.
- **R-FR-7:** Each resource entry includes a "Last verified" date. Resources with verification dates older than 90 days are flagged for content team review. Resources older than 180 days are hidden from public display until re-verified.
- **R-FR-8:** Empty state (no results for current filters) always offers a 211 Arizona fallback with a plain-language explanation.

### 6.5 AI Chat

- **R-AI-1:** Available as a floating action button from any screen and from the top navigation bar.
- **R-AI-2:** RAG architecture: responses are grounded in the Arizona legal knowledge base (A.R.S. Title 8, Arizona Administrative Code Title 21, DCS Policy Manual) and the verified resource directory.
- **R-AI-3:** Every response that makes a legal or factual claim must include a source citation (statute section, admin code reference, DCS policy section, or organization name). Uncited factual claims are not permitted.
- **R-AI-4:** Responses are dynamically adapted to the user's age tier (vocabulary, length, tone, action specificity).
- **R-AI-5:** Scope restriction: the AI responds only to questions about Arizona foster care, youth rights, the dependency court process, resources, and related welfare topics. Out-of-scope questions receive a standard redirect response.
- **R-AI-6:** Suggested prompts are displayed when the chat is empty, adapted to the user's current screen context and age tier.
- **R-AI-7:** Session-based: no conversation history is retained between sessions. Each session starts fresh.
- **R-AI-8:** Persistent disclosure banner on the chat screen: "I'm FosterGuide, an information tool. I'm not a person, a counselor, or a friend. I use Arizona law and verified resources to answer your questions."
- **R-AI-9:** Footer on every AI response: "This is information, not legal or medical advice. Talk to your attorney, caseworker, or doctor for advice about your specific situation."
- **R-AI-10:** If RAG confidence score falls below 0.70, the AI states uncertainty explicitly and directs the user to a specific human resource (their caseworker, GAL, attorney, or 211 Arizona).

### 6.6 Crisis Safety Layer

- **R-CS-1:** 988 Suicide & Crisis Lifeline, Crisis Text Line (HOME to 741741), AZ DCS Child Abuse Hotline (1-888-SOS-CHILD), and ALWAYS legal services are accessible from every screen without navigation.
- **R-CS-2:** When the AI detects crisis keywords (self-harm, suicidal ideation, abuse indicators) in user input, it immediately displays crisis resources and the message: "I'm a tool that provides information. I'm not able to provide the kind of support you need right now. Here are people who can help."
- **R-CS-3:** Crisis detection uses both keyword matching and semantic detection. The keyword list is reviewed and updated quarterly by the advisory board.
- **R-CS-4:** Crisis routing response rate of 100% on known crisis-trigger scenarios is a launch gate requirement (verified by quarterly audit).

---

## 7. AI Safety Requirements

| Rule | Requirement | Trigger |
|------|-------------|---------|
| No companion behavior | System prompt explicitly prohibits expressions of affection, friendship simulation, or emotional bonding language | Every session |
| Crisis escalation | Immediate display of crisis resources when self-harm or active abuse indicators are detected | Keyword + semantic detection |
| No conversation storage | Conversations are not logged, saved, or retrievable. Server processes query, returns response, discards context | Architectural constraint |
| Source citation required | Every legal or factual claim must include a statute, admin code, or organization source | Response pipeline |
| Identity disclosure | Persistent UI banner + periodic inline reminders that FosterGuide is an information tool, not a person | UI + system prompt |
| No clinical advice | Footer on every response disclaiming legal and medical advice | Response template |
| Confidence threshold | Below 0.70 confidence: AI states uncertainty and routes to a human resource | RAG pipeline |

Pre-launch: 200+ test queries validated against correct answers by a child welfare attorney.
Post-launch: Monthly automated accuracy benchmark. Quarterly human review.

---

## 8. Design Requirements

### 8.1 Design System

- **Primary:** Deep teal (#2A7F8E) — calm, trustworthy, non-institutional
- **Secondary:** Warm navy (#1B3A5C) — headings, authoritative content
- **Accent:** Warm amber (#D97706) — calls to action, deadlines, important badges
- **Background:** Warm off-white (#F5F2EE)
- **Never use:** Red, bright yellow, pure black backgrounds, neon colors
- **Typography:** Serif display/headings (Georgia or equivalent); humanist sans-serif body (Calibri or equivalent)
- **Reading level:** All interface text at maximum 6th-grade level. AI responses adapt per age tier.

### 8.2 Trauma-Informed UX (Non-Negotiable)

- **Quick exit:** Persistent button on every screen. One tap exits to a neutral page. No confirmation dialog.
- **Content warnings:** Sensitive topics (removal, TPR, abuse) display a brief content note before expanding.
- **No forced flows:** User can exit any pathway, skip any step, and return to home at any time without penalty.
- **Calm transitions:** No sudden animations, flashing, or aggressive motion. Respects system reduced-motion preferences.
- **Session boundary:** After 20 minutes of continuous use, a gentle non-blocking reminder to take a break.
- **Positive framing:** Language emphasizes what the youth CAN do. "You have the right to..." not "Because you were removed..."

### 8.3 Accessibility

- WCAG 2.1 AA minimum; AAA where feasible
- Minimum 4.5:1 contrast ratio for all text
- Touch targets minimum 44×44 points
- Full screen reader compatibility (VoiceOver, TalkBack)
- System font size scaling supported

---

## 9. Privacy & Compliance

### 9.1 Data Collection

| Data Point | Collected | Stored Where | Retention |
|-----------|-----------|--------------|-----------|
| Age range | Yes (selected) | Device only | Session |
| County | Yes (selected) | Device only | Session |
| Language | Yes (selected) | Device only | Persistent local |
| Tribal indicator | Yes (selected) | Device only | Session |
| Name, email, phone | No | — | — |
| Conversation text | No | — | — |
| Device ID, GPS | No | — | — |
| Aggregate analytics | Yes | Server (privacy tool) | 90 days |

### 9.2 COPPA

Under-13 users: zero personal information collection eliminates VPC requirement. Privacy policy and data security obligations apply. No third-party SDKs with behavioral profiling, advertising, or cross-site tracking.

Analytics: Plausible or self-hosted Matomo only. No Google Analytics. No Meta Pixel. No advertising SDKs.

---

## 10. Content Requirements

### 10.1 Legal Knowledge Base (Pre-Launch)

The following must be verified by a child welfare attorney before launch:

- A.R.S. §8-529 (full Foster Youth Bill of Rights)
- Arizona Administrative Code R21-6-321
- A.R.S. §8-522 (CASA appointment)
- A.R.S. §8-514.06 (documents)
- A.R.S. §8-521.02 and §8-521.03 (Extended Foster Care, SB 1303)
- Full Arizona dependency court process (8 stages, typical timelines)
- DCS Policy Manual sections covering youth rights and participation

### 10.2 Resource Directory (Pre-Launch)

- Minimum 50 verified entries at launch
- Verification standard: phone number and address confirmed within 90 days of launch
- Priority categories: legal (statewide), housing (all counties), health (YATI, Mercy Care), emergency (211, hotlines), education (ETV, tuition waiver), employment (Arizona@Work, Job Corps)
- Spanish-speaking staff indicator required on all entries

### 10.3 Spanish

English launches first. Spanish UI strings and AI response capability must be live within 60 days of English launch. This is not a Phase 2 feature. 33.7% of Arizona foster youth are Hispanic; Spanish is a Day 1 equity requirement, not an enhancement.

---

## 11. Success Metrics (Year 1)

| Metric | Target | Method |
|--------|--------|--------|
| Monthly active sessions | 500+ (pilot); 2,000+ (post-pilot) | Aggregate session count |
| Rights feature engagement | 60%+ of sessions | Feature usage frequency |
| Resource directory usage | 40%+ of sessions | Feature usage frequency |
| AI interactions per session | 3+ questions | Aggregate count |
| Spanish sessions | 20%+ of total | Language selection distribution |
| County coverage | Sessions from 8+ of 15 counties | County selection distribution |
| AI accuracy score | 95%+ on monthly benchmark | Automated test suite (200+ questions) |
| Crisis routing accuracy | 100% | Quarterly human audit |
| Session duration (median) | 5–10 minutes | Aggregate timing |

---

## 12. Launch Gates

The following must be complete before any public launch:

- [ ] Legal knowledge base verified by a child welfare attorney
- [ ] Resource directory: 50+ entries verified within 90 days
- [ ] AI accuracy benchmark: 95%+ on 200-question test suite
- [ ] Crisis routing: 100% accuracy on all known trigger scenarios
- [ ] COPPA compliance review complete with qualified privacy counsel
- [ ] Third-party SDK audit complete; no behavioral advertising SDKs present
- [ ] WCAG 2.1 AA audit complete
- [ ] Trauma-informed UX review by at least one foster youth alumni advisor
- [ ] Quick exit tested across all screens and target browsers
- [ ] Advisory board sign-off on AI tone, age-appropriateness, and scope

---

## 13. Required Partnerships

The MVP cannot launch safely without the following:

| Partner | Role | Priority |
|---------|------|----------|
| Child welfare attorney (ALWAYS, Community Legal Services, or equivalent) | Legal knowledge base verification; quarterly accuracy review | Critical — pre-launch |
| Foster youth alumni advisors (2–3) | UX review; trauma-informed audit; lived experience validation | Critical — pre-launch |
| Fostering Advocates Arizona | Pilot distribution; content validation | Critical — pilot launch |
| Arizona DCS (Young Adult Program) | Content validation; policy update notifications | High |
| CASA of Arizona | Distribution through CASA volunteers | High |

---

## 14. Out of Scope (Phase 2+)

- My Future Plan (EFC/ETV/housing/employment workflows)
- Wellness Check-In (full module with coping library)
- ICWA module (requires tribal co-design)
- Document preparation step-by-step workflows
- Account creation and persistent profiles
- Push notifications and deadline reminders
- iOS/Android app store submission
- Caregiver / foster parent mode
- Peer connection features
- Multi-state expansion

---

*End of Document*

*This PRD is a living document. It should be reviewed and updated after each advisory board session, pilot cohort, and legal review cycle.*
