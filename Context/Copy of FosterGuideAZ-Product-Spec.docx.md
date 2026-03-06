  
PRODUCT SPECIFICATION

**FosterGuide AZ**

*An AI-Powered Resource App for Arizona Foster Youth*

Version 1.0  •  March 2026

Status: Draft for Review

CONFIDENTIAL

**Table of Contents**

# **1\. Executive Summary**

FosterGuide AZ is an AI-powered mobile application designed to serve as a comprehensive, personalized resource for children and young adults ages 10–21 in Arizona’s foster care system. The app leverages a Retrieval-Augmented Generation (RAG) architecture to deliver accurate, age-appropriate information about foster youth rights, the dependency court process, transition planning, and available resources — all tailored to each user’s age, county, and situation within the Arizona child welfare system.

| The Problem Arizona has approximately 10,000 children in foster care, ranking 6th nationally. Over half are never informed of their legal rights. Only 40% graduate high school in four years — the lowest of any demographic in the state. Approximately 900 youth age out annually, with 40% experiencing homelessness within 18 months. No digital tool exists that provides Arizona foster youth with personalized, age-appropriate guidance about their rights, their cases, or the resources available to them. |
| :---- |

| The Solution A constrained AI information assistant — not a companion chatbot — that combines Arizona’s foster care legal framework (A.R.S. Title 8, DCS policy, administrative code) with a living directory of 100+ state organizations and programs. The AI communicates at four distinct age tiers (10–12, 13–15, 16–17, 18–21), always cites its sources in Arizona law, and is built with trauma-informed design principles throughout. |
| :---- |

## **1.1 Product Vision**

Every child in Arizona’s foster care system should be able to understand their rights, know what’s happening in their case, and access the resources they need — in language they can understand, on whatever device they have, in the moment they need it.

## **1.2 Target Users**

| Segment | Age | Primary Needs | Access Pattern |
| :---- | :---- | :---- | :---- |
| Younger Youth | 10–12 | Understanding why they’re in care, who the adults in their case are, core rights, emotional validation | Guided pathways, short sessions, caregiver may be present |
| Middle Youth | 13–15 | All rights (including new 14+ rights), court process, education rights, how to ask for help | Independent use, conversational, moderate sessions |
| Older Youth | 16–17 | Transition planning, ILP/Extended Foster Care decisions, ETV/tuition waiver, housing, employment, document prep | Full AI interaction, action-oriented, checklists and deadlines |
| Young Adults | 18–21 | Extended Foster Care navigation, TILP/STA, college support, housing programs, YATI health insurance | Full-featured, complex workflows, self-directed |

## **1.3 Key Differentiators**

* **Arizona-specific:** Every response is grounded in current Arizona law (A.R.S. Title 8, Arizona Administrative Code Title 21\) and verified Arizona resources — not generic national information.

* **Age-adaptive AI:** The same question yields fundamentally different responses for a 10-year-old vs. a 17-year-old — different vocabulary, detail level, tone, and action items.

* **Not a companion chatbot:** Architecturally constrained to information delivery. No emotional bonding, no persistent relationship, no conversation history retention. Compliant with emerging companion chatbot regulation.

* **Trauma-informed from the ground up:** Quick-exit button, calm visual design, content warnings, user control over every interaction, no triggering imagery.

* **Bilingual:** English and Spanish from launch. 33.7% of Arizona foster youth are Hispanic.

# **2\. User Personas**

## **2.1 Maria, Age 11**

**Background:** Maria was placed in kinship foster care with her aunt six months ago after a neglect finding. She has a younger brother in a different placement. She speaks English at school and Spanish at home. She doesn’t understand why she can’t live with her mom or see her brother more often.

**Primary needs:** Understanding why she’s in care in age-appropriate terms. Learning she has the right to visit her brother (A.R.S. §8-529(A)(4)). Knowing who her caseworker is and that she can talk to them privately (A.R.S. §8-529(A)(16)). Emotional validation that this isn’t her fault.

**App interaction:** Maria taps “I just want to understand what’s happening” on the home screen. The app walks her through a visual, illustrated explanation of foster care. When she asks “Can I see my brother?” the AI responds: “Yes\! Arizona law says you have the right to visit and have contact with your brother. Your caseworker is supposed to help make that happen. Would you like help figuring out what to say to your caseworker about this?”

## **2.2 Jaylen, Age 14**

**Background:** Jaylen has been in care for two years, is on his third placement (group home in Maricopa County), and has a permanency hearing coming up. He doesn’t have a CASA volunteer. He’s been told his case plan is changing from reunification to “something else” but nobody has explained what that means.

**Primary needs:** Understanding what a permanency hearing is and what happens there. Learning what “severance and adoption” vs. “permanent guardianship” means. Knowing he has the right to participate in his case planning (A.R.S. §8-529(A)(18)). Understanding he can request a CASA (A.R.S. §8-522).

**App interaction:** Jaylen asks the AI “What’s a permanency hearing?” The AI explains in 8th-grade language what it is, what the possible outcomes are, and that Jaylen has the right to be there and share what he wants. It then asks if he wants help preparing questions for his attorney or caseworker.

## **2.3 Destiny, Age 17**

**Background:** Destiny is a member of the Navajo Nation and is in a licensed foster home in Coconino County. She turns 18 in four months and is terrified about aging out. She wants to go to NAU but doesn’t know how to pay for it. Her caseworker mentioned “ILP” and “ETV” but didn’t explain them.

**Primary needs:** Understanding Extended Foster Care vs. aging out — and the brand new SB 1303 Success Coach program. Step-by-step ETV application guidance (deadline July 31). Arizona Tuition Waiver eligibility check. ICWA-specific rights and tribal resources. Help obtaining her birth certificate and state ID.

**App interaction:** Destiny selects “I’m getting ready to leave foster care” and indicates she is 17 and a tribal member. The app surfaces a personalized transition checklist including ICWA-specific information. When she asks about paying for college, the AI walks her through the ETV application step by step, explains the tuition waiver, and connects her to Fostering Success at NAU.

## **2.4 Andre, Age 19**

**Background:** Andre aged out at 18, left Extended Foster Care, and is now experiencing housing instability in Pima County. He wants to re-enter care but doesn’t know if he can. He’s also lost his birth certificate.

**Primary needs:** Learning that he CAN re-enter foster care through TILP (Arizona’s Children Association, 480-247-1413). Finding transitional housing in Tucson (New Culture, Hope House, Thrive AZ). Step-by-step instructions for obtaining a replacement birth certificate from Arizona Vital Records. YATI health insurance enrollment.

**App interaction:** Andre asks “Can I go back into foster care?” The AI immediately responds yes, explains the TILP pathway, provides the AzCA phone number and email, and asks if Andre also needs help with housing or health insurance. It then surfaces Pima County–specific transitional housing options.

# **3\. Feature Specifications**

## **3.1 Onboarding Flow**

The onboarding flow collects the minimum information needed for personalization without creating COPPA exposure. No account is created. No personal information is collected or stored server-side.

**Step 1: Language Selection**

* Two options: English / Español

* Selection stored in local device memory only

**Step 2: Age Selection**

* Four age bands presented as large, tappable cards: “10–12” / “13–15” / “16–17” / “18–21”

* Each card has a brief, friendly description of what the app can help with at that age

* Stored in local device memory only

**Step 3: County Selection**

* Dropdown or map-based selector for all 15 Arizona counties

* Used to filter resources by geographic availability

* Stored in local device memory only

**Step 4: “What brings you here today?”**

* “I just entered foster care and want to understand what’s happening”

* “I want to know my rights”

* “I have a court hearing coming up”

* “I’m getting ready to leave foster care”

* “I need help finding resources”

* “I’m feeling stressed or upset and need support”

* “I just want to explore”

Selection routes the user to the relevant guided pathway. Users can switch pathways at any time.

## **3.2 Feature: Know Your Rights**

The primary feature of the MVP. Delivers the full content of A.R.S. §8-529 (Foster Youth Bill of Rights) plus Arizona Administrative Code R21-6-321, translated into age-appropriate language with interactive exploration.

**Core Functionality**

1. Full rights inventory displayed as expandable cards, organized by category (safety, education, family contact, case participation, privacy, transition)

2. Each right card shows: the right in plain language, what it means in practice (with an example), and the exact statute citation

3. Age-filtered view: users ages 10–13 see the universal rights; users 14+ see additional rights highlighted with a “New at 14\!” badge

4. AI-powered Q\&A: Users can ask questions like “Can my foster parent read my mail?” and get a sourced answer

5. “What if my rights are being violated?” walkthrough: Step-by-step guide to filing a complaint with DCS, the Ombudsman, or the juvenile court (A.R.S. §8-529(D))

6. Shareable rights summary: User can generate a simple, printable one-page summary of their rights to show a caregiver, caseworker, or CASA volunteer

## **3.3 Feature: My Case Explained**

An interactive guide to the Arizona dependency court process, personalized to where the user is in their case journey.

**Core Functionality**

7. Visual timeline of the Arizona dependency process (hotline report → investigation → TDM → preliminary hearing → adjudication → disposition → review → permanency hearing)

8. Each stage expandable with: what happens, who’s involved, what the child can do, what comes next, and how long it usually takes

9. “Who’s who in my case” explainer: DCS Specialist, GAL, CASA, AAG, FCRB, judge — each role explained with what they do and how the child can talk to them

10. Case plan goal explainer: Reunification, severance and adoption, permanent guardianship, extended foster care — what each means in plain language

11. AI Q\&A for court-related questions: “What happens at a permanency hearing?” “What does my GAL do?” “Can I talk to the judge?”

12. ICWA-aware: When tribal membership is indicated, the timeline adapts to include ICWA-specific steps (active efforts, tribal court jurisdiction, placement preferences)

## **3.4 Feature: My Future Plan**

A personalized transition planning tool for youth 14+ that maps available programs, eligibility, deadlines, and action steps based on the user’s age and goals.

**Core Functionality**

13. Decision tree: “I’m turning 18 — what are my options?” walks through Extended Foster Care vs. ILP vs. TILP vs. leaving care, with eligibility criteria for each

14. SB 1303 explainer: The new Extended Foster Care Comprehensive Service Model and Success Coach program, explained in plain language

15. Education pathways: ETV application walkthrough (deadline-aware), Arizona Tuition Waiver eligibility checker, campus program directory (Bridging Success at ASU, Fostering Success at U of A, etc.)

16. Document preparation checklist: Birth certificate, Social Security card, state ID/driver’s license, immunization records — with Arizona-specific instructions for obtaining each

17. Housing resource finder: Filtered by county and age, including New Culture, Thrive AZ, Hope House, Foster Arizona Housing Project, and county-specific options

18. Employment resources: Arizona@Work locations, Job Corps centers (Phoenix and Tucson), AFFCF Keys to Success, FoolProof Solo financial literacy

19. Deadline tracker: Key dates surfaced proactively (ETV application deadline, FAFSA deadline, tuition waiver age cutoffs, Extended Foster Care agreement timeline)

## **3.5 Feature: Find Resources**

A searchable, filterable directory of Arizona foster youth resources maintained as a living database with monthly verification.

**Core Functionality**

20. Search by need: housing, education, legal help, mental health, employment, clothing, food, emergency assistance, parenting support, financial literacy

21. Filter by county: All 15 Arizona counties with clear indication when a resource is unavailable in the user’s county

22. Filter by age eligibility: Shows only resources the user qualifies for based on their stated age

23. Each resource listing includes: organization name, what they provide, who’s eligible, phone number (click-to-call), website, address, and hours

24. AI-assisted navigation: “I need help with \[need\]” returns the top 3 most relevant resources for the user’s county and age, with explanation of why each was recommended

25. Crisis resources pinned: 988 Suicide & Crisis Lifeline, Crisis Text Line (text HOME to 741741), DCS Child Abuse Hotline (1-888-SOS-CHILD), and ALWAYS legal services always accessible from any screen

## **3.6 Feature: Wellness Check-In**

A lightweight emotional wellness feature that provides psychoeducation, coping strategies, and connections to professional support — without providing clinical services or creating a therapeutic relationship.

**Core Functionality**

26. Optional mood check-in: Simple visual scale (“How are you feeling right now?”) with no data stored server-side

27. Feelings normalization: Age-appropriate content explaining that feelings of anger, sadness, confusion, and grief are normal responses to the foster care experience

28. Coping skill library: Breathing exercises, grounding techniques, journaling prompts, and mindfulness activities — all evidence-based and appropriate for youth who have experienced trauma

29. Professional resource connection: “Would you like to talk to someone?” surfaces Mercy Care DCS CHP behavioral health access, crisis lines, and local counseling resources

30. Hard boundary: The AI never provides therapy, clinical assessment, or diagnosis. If a user describes active self-harm, suicidal ideation, or abuse, the app immediately surfaces crisis resources and displays: “I’m a tool that provides information. I’m not able to provide the kind of support you need right now. Here are people who can help.”

## **3.7 Feature: AI Chat**

The central interaction mode, available from any screen. A text-based conversational interface where users can ask questions in natural language and receive sourced, age-appropriate responses grounded in the Arizona legal knowledge base.

**Core Functionality**

31. Natural language input with suggested prompts for users who aren’t sure what to ask

32. Every response includes source citation (statute, admin code, or program source)

33. Responses dynamically adapted to user’s age tier (vocabulary, length, tone, detail level)

34. Scope-restricted: Only responds to questions about Arizona foster care, youth rights, court processes, transition planning, education, resources, and related topics

35. Clear AI disclosure on every screen: “I’m FosterGuide, an information tool. I’m not a person, a friend, or a counselor. I use Arizona law and verified resources to answer your questions.”

36. Session-based: No conversation history is retained between sessions. Each interaction starts fresh.

37. Fallback protocol: When the AI cannot confidently answer a question, it says so and directs the user to their caseworker, GAL, attorney, or a specific organization that can help

# **4\. Information Architecture**

## **4.1 Navigation Structure**

The app uses a bottom tab navigation pattern with five primary tabs, plus a persistent AI chat access point.

| Tab | Icon Concept | Function |
| :---- | :---- | :---- |
| Home | House/compass | Welcome screen, guided pathways entry, quick access to recent features |
| My Rights | Shield/star | Know Your Rights feature, rights explorer, violation reporting guide |
| My Case | Timeline/gavel | Dependency court process, case roles, case plan explanations |
| My Future | Path/arrow forward | Transition planning, education, housing, employment, document prep |
| Resources | Map pin/book | Resource directory, county filter, need-based search |

The AI chat is accessible via a floating action button (bottom-right corner) available on every screen. The Wellness Check-In is accessible from the Home tab and from contextual prompts throughout the app.

## **4.2 Content Hierarchy by Age**

Content is not simply filtered by age — it is fundamentally restructured. The information architecture adapts at each tier.

| Element | Ages 10–12 | Ages 13–15 | Ages 16–17 | Ages 18–21 |
| :---- | :---- | :---- | :---- | :---- |
| Home screen | 3 illustrated cards:Understand, Rights, Feelings | 5 pathway options with brief descriptions | Full 5-tab navigation with deadlines panel | Full navigation with transition dashboard |
| Rights content | 12 core rights as illustrated cards | Full rights with 14+ expansion badge | Full rights \+ self-advocacy tools | Full rights \+ enforcement guides |
| Court process | Simplified visual story | Interactive timeline with role cards | Detailed timeline \+ hearing prep | Extended foster care emphasis |
| Transition tools | Not shown | Introduction: “What happens when you get older” | Full planning suite with checklists | Full suite \+ re-entry guides |
| AI response style | 2–3 sentences, simple words, visual aids | Short paragraphs, plain language | Detailed paragraphs with action items | Full detail, professional tone |

# **5\. Design Principles**

## **5.1 Visual Design System**

The visual identity communicates safety, warmth, and empowerment while avoiding institutional aesthetics that foster youth associate with the child welfare system.

**Color Palette**

* **Primary: Deep teal (\#2A7F8E)** — Calm, trustworthy, non-institutional. Avoids the blues commonly associated with government/CPS and the reds associated with alerts and danger.

* **Secondary: Warm navy (\#1B3A5C)** — For headings and authoritative content. Conveys reliability without coldness.

* **Accent: Warm amber (\#D97706)** — For calls to action, important badges, and interactive elements. Energizing without being alarming.

* **Background: Warm off-white (\#F5F2EE)** — Softer than pure white. Reduces eye strain and institutional feeling.

* **Never used: Red (alarm/danger), bright yellow (warning/caution), pure black backgrounds (harsh), neon colors (overstimulating).** 

**Typography**

* **Display/Headings: Georgia or similar serif** — Warm, readable, human. Avoids the cold sans-serif aesthetic of government forms.

* **Body: Calibri or similar humanist sans-serif** — Clean and accessible at small sizes. High readability on mobile.

* **Reading level:**  All interface text at a maximum 6th-grade reading level. AI responses adjusted per age tier.

**Imagery and Illustration**

* Custom abstract illustrations using organic shapes, nature motifs, and warm colors

* No photographs of children, courtrooms, police, or institutional settings

* No stock photos of “sad children” or “happy families” — both are triggering in different ways for foster youth

* Icons: Simple, rounded, friendly line icons. Avoid glyph-heavy or technical icon styles.

## **5.2 Accessibility Standards**

* WCAG 2.1 AA compliance minimum, targeting AAA where feasible

* All text meets 4.5:1 contrast ratio against its background

* Touch targets minimum 44x44 points

* Full screen reader compatibility (VoiceOver and TalkBack)

* Supports system-level font size scaling

* No content conveyed by color alone

* Reduced motion mode respects system preferences

## **5.3 Trauma-Informed UX Patterns**

* **Quick Exit:** Persistent “X” or “Exit” button in top-right corner of every screen. One tap navigates to a neutral external page (Google.com). No confirmation dialog — immediate exit.

* **Content Previews:** Sensitive topics (removal, TPR, abuse reporting) show a brief content note before expanding: “This section talks about \[topic\]. Tap to continue or skip.”

* **No Forced Flows:** Users can exit any pathway, skip any step, and return to the home screen at any time. Progress is never lost or penalized.

* **Calm Transitions:** No sudden animations, flashing elements, or aggressive transitions. All motion is gentle, purposeful, and can be disabled.

* **Session Boundaries:** After 20 minutes of continuous use, a gentle reminder appears: “You’ve been here a while. Want to take a break? Your information will be here when you come back.”

* **Positive Framing:** Language emphasizes what the youth CAN do, not what has happened to them. “You have the right to...” not “Because you were removed from your home...”

# **6\. Data Architecture & Privacy**

## **6.1 Data Collection Principle: Collect Nothing**

The core design philosophy is that the safest data is data that was never collected. For the MVP, the app collects zero personally identifiable information and stores zero data server-side for users under 18\.

| Data Point | Collected? | Stored Where | Retention | Purpose |
| :---- | :---- | :---- | :---- | :---- |
| Age range | Yes (selected) | Device only | Session | Content personalization |
| County | Yes (selected) | Device only | Session | Resource filtering |
| Language | Yes (selected) | Device only | Persistent local | UI language |
| Name | No | — | — | — |
| Email | No | — | — | — |
| Phone number | No | — | — | — |
| Case details | No | — | — | — |
| Conversation text | No | — | — | — |
| Device ID | No | — | — | — |
| Location (GPS) | No | — | — | — |
| Analytics | Aggregate only | Server (privacy tool) | 90 days | Feature usage patterns |

Aggregate analytics (e.g., “42% of sessions use the Rights feature”) use privacy-preserving tools (Plausible or self-hosted Matomo) with no individual tracking. No Google Analytics, no Meta Pixel, no advertising SDKs, no cross-site tracking of any kind.

## **6.2 COPPA Compliance Strategy**

* **Under-13 users:** Zero personal information collection eliminates the need for Verifiable Parental Consent. The app is child-directed by design, so COPPA applies, but with no PI collection, the primary compliance obligation is the privacy policy and data security — not consent.

* **Ages 13–17:** Same zero-collection approach for MVP. If persistent features are added (Phase 2+), age-appropriate consent flows will be implemented.

* **Ages 18–21:** COPPA does not apply. Optional account creation may be offered for persistent transition planning tools.

* **Third-party SDKs:** Every SDK will be audited before integration. Only SDKs with verified COPPA-compliant data practices will be used. No behavioral advertising or profiling SDKs will ever be integrated.

# **7\. AI Safety & Guardrail Specifications**

## **7.1 Scope Boundaries**

The AI will ONLY respond to questions within the following domains:

* Arizona foster care law, policy, and procedures

* Foster youth rights (federal and Arizona-specific)

* Arizona dependency court process

* Transition planning and aging out of care

* Education resources and financial aid for foster youth

* Housing, employment, and life skills resources

* Healthcare access through Mercy Care DCS CHP and YATI

* ICWA and tribal-specific rights and resources

* General emotional wellness and coping strategies

* Crisis resource referrals

For ANY question outside these domains, the AI responds: “That’s a great question, but it’s outside what I’m built to help with. I’m focused on helping you understand your rights and resources in Arizona foster care. Is there something about your foster care situation I can help with?”

## **7.2 Hard Safety Rules (Never Violated)**

| Rule | Implementation | Trigger |
| :---- | :---- | :---- |
| No companion behavior | System prompt prohibits expressions of affection, friendship simulation, or emotional bonding. AI never uses “I care about you” or similar language. | Every interaction |
| Crisis escalation | Immediate display of crisis resources (988, Crisis Text Line, DCS hotline) when self-harm, suicidal ideation, or active abuse indicators are detected in user input | Keyword \+ semantic detection |
| No conversation storage | Conversations are not logged, saved, or retrievable. Server processes query, returns response, discards context. | Architectural constraint |
| Source citation required | Every legal/factual claim must include a statute section, admin code reference, or organization name | Response generation pipeline |
| AI identity disclosure | Persistent banner on chat screen: “I’m an information tool, not a person.” Periodic inline reminders. | UI \+ system prompt |
| No medical/legal advice | Footer on every response: “This is information, not legal or medical advice. Talk to your attorney, caseworker, or doctor for advice about your specific situation.” | Response template |
| Content accuracy threshold | If RAG confidence score falls below 0.7, AI states uncertainty and directs to a human resource | RAG pipeline check |

## **7.3 Content Moderation**

Because the app does not include user-generated content, peer interaction, or message boards in the MVP, content moderation focuses on AI output quality rather than user-to-user interaction.

* **Pre-launch:** 200+ test queries validated against verified correct answers by a child welfare attorney

* **Monthly:** Automated accuracy benchmark run against the full test suite, with human review of any responses that have changed

* **Quarterly:** Advisory board review of AI response quality, including age-appropriateness audit

* **Continuous:** Automated monitoring for AI responses that contain unexpected content, length anomalies, or scope violations

# **8\. Localization & Language Support**

## **8.1 Launch Languages**

English and Spanish are supported from launch. 33.7% of Arizona’s foster care population is Hispanic, and many youth live in bilingual households. Spanish support is not a Phase 2 feature — it is a launch requirement.

**Translation Approach**

* **UI strings:** Professional human translation (not machine translation) of all interface text, buttons, labels, and navigation elements

* **Legal content:** Bilingual legal review. Statutes are translated with attention to legal meaning, not just literal translation. Where official Spanish-language versions of DCS documents exist, those are used.

* **AI responses:** The LLM generates responses in the user’s selected language. System prompts include language-specific instructions. Spanish-language responses are spot-checked monthly by a bilingual reviewer.

* **Resource directory:** Indicates which organizations offer services in Spanish. Filters for “Spanish-speaking staff” available.

## **8.2 Future Languages**

Arizona’s tribal nations include speakers of Navajo (Diné Bizaad), O’odham, Apache, and other languages. While full app translation into indigenous languages is not feasible for MVP, future phases should explore partnerships with tribal language preservation programs to add key content (e.g., rights summaries, crisis resources) in priority tribal languages.

# **9\. Success Metrics & Measurement**

## **9.1 Key Performance Indicators**

All metrics are measured using privacy-preserving aggregate analytics. No individual user tracking.

| Metric | Target (Year 1\) | Measurement Method |
| :---- | :---- | :---- |
| Monthly active sessions | 2,000+ | Aggregate session count (privacy analytics) |
| Rights feature engagement | 60% of sessions | Feature usage frequency |
| Resource directory usage | 40% of sessions | Feature usage frequency |
| AI chat interactions per session | 3+ questions | Aggregate interaction count |
| Spanish language sessions | 20%+ of total | Language selection distribution |
| County coverage | Sessions from 10+ of 15 counties | County selection distribution |
| AI accuracy score | 95%+ on monthly benchmark | Automated test suite (200+ questions) |
| Crisis resource surfacing | 100% appropriate response rate | Quarterly human audit of crisis-trigger scenarios |
| Session duration (median) | 5–10 minutes | Aggregate timing |
| Return sessions (7-day) | 30%+ of devices return | Aggregate device-level count (no PII) |

## **9.2 Qualitative Feedback**

* Quarterly focus groups with Arizona foster youth (compensated, voluntary, facilitated by Fostering Advocates AZ or similar partner)

* In-app “Was this helpful?” on every AI response (binary yes/no, no text collection for under-18)

* Annual survey distributed through DCS Youth Empowerment Council and partner organizations

* Advisory board review of usage patterns and feature requests

# **10\. Release Plan & Roadmap**

## **10.1 Phase 0: Foundation (Months 1–3)**

* Assemble advisory board: foster youth alumni (3+), child welfare attorney, DCS liaison, tribal representative, CASA coordinator, UX researcher with trauma-informed experience

* Build and verify Arizona legal knowledge base (A.R.S. Title 8, Admin Code Title 21, DCS Policy Manual)

* Compile and verify resource directory (all 15 counties, 100+ organizations)

* Develop and user-test age-adaptive system prompts with foster youth focus groups

* Complete COPPA compliance review with qualified privacy counsel

* Develop trauma-informed design system (colors, typography, illustration, interaction patterns)

* Establish content update pipeline (automated monitoring \+ human review workflow)

## **10.2 Phase 1: MVP Launch (Months 4–7)**

* Know Your Rights feature (full §8-529 content, age-adapted, interactive)

* My Case Explained feature (dependency court timeline, role explainers)

* My Future Plan feature (transition decision tree, program eligibility, deadlines)

* Find Resources feature (county-filtered, age-filtered directory)

* AI Chat (RAG-powered, scoped, guardrailed, age-adaptive)

* Wellness Check-In (mood check, coping skills, crisis resource links)

* English \+ Spanish

* PWA deployment (no app store submission — accessible via any mobile browser)

* Pilot with 50–100 youth through DCS YEC and partner organizations

## **10.3 Phase 2: Expansion (Months 8–12)**

* Education module (ETV step-by-step, tuition waiver eligibility checker, campus program finder)

* ICWA module (co-designed with tribal partners)

* Document preparation checklists with Arizona-specific step-by-step instructions

* Mental health provider finder (Mercy Care DCS CHP network integration)

* iOS and Android app store submission with full COPPA compliance package

* Expanded resource directory with automated verification pipeline

* Caregiver information mode (“I’m a foster parent looking for information”)

## **10.4 Phase 3: Scale (Year 2\)**

* Peer connection integration (partnership with FosterClub app or similar)

* Outcome research partnership with Arizona university (ASU or U of A)

* Youth co-design council for ongoing iteration (compensated, formal)

* Second state expansion (architecture designed for multi-state from day one)

* Annual impact report for funders and stakeholders

# **11\. Dependencies & Required Partnerships**

The success of FosterGuide AZ depends on partnerships that no technology alone can replace. The following relationships are critical, not optional.

| Partner | Role | Priority | Status |
| :---- | :---- | :---- | :---- |
| Arizona DCS (Young Adult Program) | Content validation, distribution through YEC and caseworkers, policy update notifications | Critical | To initiate |
| Child welfare attorney (ALWAYS, Community Legal Services, or similar) | Quarterly legal review, accuracy validation, COPPA compliance review | Critical | To initiate |
| Fostering Advocates Arizona | Youth focus groups, distribution, content validation, cultural alignment | Critical | To initiate |
| Foster youth alumni advisory board (3–5 members) | Co-design, usability testing, ongoing feedback, lived experience validation | Critical | To recruit |
| Arizona tribal representatives | ICWA module co-design, cultural review, tribal resource verification | Critical (Phase 2\) | To initiate |
| CASA of Arizona | Distribution through CASA volunteers, content feedback | High | To initiate |
| Arizona Friends of Foster Children Foundation | Resource directory partnership, potential funding | High | To initiate |
| Foster Success Education Services | ETV and education content accuracy, referral pathway | High | To initiate |
| Arizona’s Children Association (AzCA) | ILP/TILP content accuracy, referral pathway | High | To initiate |
| ASU or U of A research partner | Impact evaluation, outcome research | Medium (Phase 2\) | To explore |

# **12\. Appendix: Key Legal References**

The following Arizona statutes and regulations form the primary legal knowledge base for the app. All must be monitored for changes after each legislative session.

**Core Statutes**

* **A.R.S. §8-529:** Children in foster care and kinship foster care; rights (the Foster Youth Bill of Rights)

* **A.R.S. §8-521.02:** Extended foster care program; requirements

* **A.R.S. §8-521.03:** Extended Foster Care Comprehensive Service Model (SB 1303, 2025\)

* **A.R.S. §8-514.06:** Out-of-home placement; documents

* **A.R.S. §8-514.08:** Educational decisions; parent contact information

* **A.R.S. §8-522:** Dependency actions; special advocate; appointment; duties

* **A.R.S. §8-515.01 through §8-515.05:** Foster care review boards

* **A.R.S. §8-530:** Foster parents and kinship foster care parents; rights

* **A.R.S. §8-530.07:** Leaving care; safe and stable housing

* **A.R.S. §8-533:** Grounds for termination of parent-child relationship

* **A.R.S. §8-547:** Restoration of parent-child relationship

**Core Regulations**

* **Ariz. Admin. Code R21-5-205:** Services for foster youth 18–20 in out-of-home care

* **Ariz. Admin. Code R21-6-321:** Rights of a foster child (supplemental to §8-529)

**Federal Law**

* **COPPA (15 U.S.C. §6501–6506):** Children’s Online Privacy Protection Act (2025 amendments)

* **ICWA (25 U.S.C. §§1901–1963):** Indian Child Welfare Act

* **ASFA (P.L. 105-89):** Adoption and Safe Families Act

* **Chafee (42 U.S.C. §677):** John H. Chafee Foster Care Program for Successful Transition to Adulthood

*End of Document*