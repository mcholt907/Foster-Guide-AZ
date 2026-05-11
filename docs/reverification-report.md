# Content Re-verification Report

> **Generated:** 2026-05-11  
> **Mode:** Applied  
> **Total entries checked:** 48

---

## Summary

| Metric | Count |
|:---|:---|
| ✅ Verified / Auto-corrected | 17 |
| ❌ Needs manual review | 31 |
| 📞 Phone numbers auto-updated | 2 |
| 🔄 URLs auto-updated (redirects) | 3 |

---

## Auto-corrections Applied

| Entry | Field | Old Value | New Value | Reason |
|:---|:---|:---|:---|:---|
| Arizona Friends of Foster Children Foundation (AFFCF) | `phone` | (602) 438-7230 | (602) 252-9445 | Phone number updated from organization's website |
| DNA People's Legal Services | `phone` | 1-833-362-1102 | (928) 871-4151 | Phone number updated from organization's website |
| Job Corps | `website` | https://jobcorps.gov | https://www.jobcorps.gov | URL redirected to new location |
| Arizona Friends of Foster Children Foundation (AFFCF) | `website` | https://affcf.org | https://www.affcf.org/ | URL redirected to new location |
| Arizona Foster Youth Scholarship Fund | `website` | https://affcf.org/scholarships | https://www.affcf.org/ways-we-help/post-secondary/scholarships/ | URL redirected to new location |

---

## Failures Requiring Manual Review

### 🌐 DNS Failures (domain no longer exists) (3)

#### ALWAYS (AZ Legal Aid for Youth)

| Field | Value |
|:---|:---|
| **URL** | https://alwayslegal.org |
| **Phone (on file)** | 1-855-ALWAYS-1 |
| **Reason** | Network error: getaddrinfo ENOTFOUND alwayslegal.org |
| **File** | `server/src/data/resources.ts` |

#### Fostering Advocates Arizona

| Field | Value |
|:---|:---|
| **URL** | https://fosteringadvocatesaz.org |
| **Phone (on file)** | 602-252-9445 |
| **Reason** | Network error: getaddrinfo ENOTFOUND fosteringadvocatesaz.org |
| **File** | `server/src/data/resources.ts` |

#### Tumbleweed Center for Youth Development

| Field | Value |
|:---|:---|
| **URL** | https://www.tumbleweed.org |
| **Phone (on file)** | (602) 271-9904 |
| **Reason** | Network error: getaddrinfo EAI_AGAIN www.tumbleweed.org |
| **File** | `server/src/data/resources.ts` |

### 🚫 HTTP Errors (page moved or access denied) (7)

#### AZ DCS Child Abuse Hotline

| Field | Value |
|:---|:---|
| **URL** | https://dcs.az.gov/about/contact |
| **Reason** | HTTP 403 — page returned an error |
| **File** | `web/src/data/constants.ts` |

#### ARIZONA@WORK — Local Job Center Locator

| Field | Value |
|:---|:---|
| **URL** | https://arizonaatwork.com/locations |
| **Phone (on file)** | (877) 600-2722 |
| **Reason** | HTTP 403 — page returned an error |
| **File** | `web/src/data/resources.ts` |

#### Arizona DCS Child Abuse Hotline

| Field | Value |
|:---|:---|
| **URL** | https://dcs.az.gov/report-child-abuse |
| **Phone (on file)** | 1-888-767-2445 |
| **Reason** | HTTP 403 — page returned an error |
| **File** | `server/src/data/resources.ts` |

#### Mercy Care — DCS CHP (Comprehensive Health Plan)

| Field | Value |
|:---|:---|
| **URL** | https://www.mercycareaz.org/dcschp/index.html |
| **Phone (on file)** | 602-212-4983 |
| **Reason** | HTTP 403 — page returned an error |
| **File** | `server/src/data/resources.ts` |

#### Arizona@Work

| Field | Value |
|:---|:---|
| **URL** | https://arizonaatwork.com |
| **Phone (on file)** | 1-833-762-8196 |
| **Reason** | HTTP 403 — page returned an error |
| **File** | `server/src/data/resources.ts` |

#### Arizona SNAP (Food Stamps)

| Field | Value |
|:---|:---|
| **URL** | https://des.az.gov/services/basic-needs/food/nutrition-assistance |
| **Phone (on file)** | 1-855-432-7587 |
| **Reason** | HTTP 403 — page returned an error |
| **File** | `server/src/data/resources.ts` |

#### Arizona DES — Cash Assistance (TANF)

| Field | Value |
|:---|:---|
| **URL** | https://des.az.gov/ca |
| **Phone (on file)** | 1-855-432-7587 |
| **Reason** | HTTP 403 — page returned an error |
| **File** | `server/src/data/resources.ts` |

### 🅿️ Parked / Suspended Domains (2)

#### Copa Health

| Field | Value |
|:---|:---|
| **URL** | https://copahealth.org |
| **Phone (on file)** | 480-969-3800 |
| **Reason** | Page appears to be a parked/suspended domain |
| **File** | `server/src/data/resources.ts` |
| **Page title** | Arizona Behavioral &amp; Mental Health Services - Copa Health |

#### United Food Bank

| Field | Value |
|:---|:---|
| **URL** | https://unitedfoodbank.org |
| **Phone (on file)** | 480-926-4897 |
| **Reason** | Page appears to be a parked/suspended domain |
| **File** | `server/src/data/resources.ts` |
| **Page title** | Home - United Food Bank |

### ⏱️ Timeouts (server unresponsive) (6)

#### ALWAYS (legal help)

| Field | Value |
|:---|:---|
| **URL** | https://alwaysaz.org/ |
| **Reason** | Network error: Timeout after 15000ms |
| **File** | `web/src/data/constants.ts` |

#### Arizona's Children Association (AzCA) — Transition supports

| Field | Value |
|:---|:---|
| **URL** | https://www.arizonaschildren.org/ |
| **Phone (on file)** | (480) 247-1413 |
| **Reason** | Network error: Timeout after 15000ms |
| **File** | `web/src/data/resources.ts` |

#### Community Legal Services

| Field | Value |
|:---|:---|
| **URL** | https://clsaz.org |
| **Phone (on file)** | (800) 852-9075 |
| **Reason** | Network error: Timeout after 15000ms |
| **File** | `server/src/data/resources.ts` |

#### Southern Arizona Legal Aid

| Field | Value |
|:---|:---|
| **URL** | https://www.sazlegalaid.org |
| **Phone (on file)** | (520) 623-9461 |
| **Reason** | Network error: Timeout after 15000ms |
| **File** | `server/src/data/resources.ts` |

#### Arizona Foster Care Tuition Waiver

| Field | Value |
|:---|:---|
| **URL** | https://azregents.edu/foster-youth |
| **Reason** | Network error: Timeout after 15000ms |
| **File** | `server/src/data/resources.ts` |

#### Education and Training Voucher (ETV) — AzCA

| Field | Value |
|:---|:---|
| **URL** | https://www.arizonaschildren.org/services/young-adult-services/ |
| **Phone (on file)** | 480-651-3348 |
| **Reason** | Network error: Timeout after 15000ms |
| **File** | `server/src/data/resources.ts` |

### 📵 Phone Number Not Found (no candidates) (13)

#### New Culture

| Field | Value |
|:---|:---|
| **URL** | https://www.newcultureaz.org/ |
| **Phone (on file)** | (602) 461-6488 |
| **Reason** | Phone "(602) 461-6488" not found; no phone numbers detected on page |
| **File** | `web/src/data/resources.ts` |

#### Thrive AZ — Transitional Housing

| Field | Value |
|:---|:---|
| **URL** | https://www.thriveaz.org/transitional-housing |
| **Phone (on file)** | (520) 299-4614 |
| **Reason** | Phone "(520) 299-4614" not found; no phone numbers detected on page |
| **File** | `web/src/data/resources.ts` |

#### Fostering Advocates Arizona

| Field | Value |
|:---|:---|
| **URL** | https://www.fosteringadvocatesarizona.org |
| **Phone (on file)** | (602) 266-0707 |
| **Reason** | Phone "(602) 266-0707" not found; no phone numbers detected on page |
| **File** | `web/src/data/resources.ts` |
| **Page title** | Fostering Advocates Arizona - Youth. Speak. Change. |

#### UMOM New Day Centers

| Field | Value |
|:---|:---|
| **URL** | https://www.umom.org |
| **Phone (on file)** | (602) 889-3597 |
| **Reason** | Phone "(602) 889-3597" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | UMOM New Day Centers |

#### Native Connections — Youth Crisis Housing

| Field | Value |
|:---|:---|
| **URL** | https://www.nativeconnections.org |
| **Phone (on file)** | 602-254-3247 |
| **Reason** | Phone "602-254-3247" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | Home - Native American Connections |

#### EMPACT-SPC

| Field | Value |
|:---|:---|
| **URL** | https://lafronteraaz-empact.org |
| **Phone (on file)** | 480-784-1500 |
| **Reason** | Phone "480-784-1500" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | La Frontera Empact | |

#### La Frontera Arizona

| Field | Value |
|:---|:---|
| **URL** | https://lafronteraaz.org |
| **Phone (on file)** | (520) 838-5600 |
| **Reason** | Phone "(520) 838-5600" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | LA FRONTERA AZ | La Frontera |

#### ASU Foster Youth Success Initiative

| Field | Value |
|:---|:---|
| **URL** | https://fosteryouth.asu.edu |
| **Phone (on file)** | 480-727-6282 |
| **Reason** | Phone "480-727-6282" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | Home | Foster Youth ASU |

#### Northern Arizona University — Foster Youth Assistance

| Field | Value |
|:---|:---|
| **URL** | https://nau.edu/financial-aid/ |
| **Phone (on file)** | 928-523-4951 |
| **Reason** | Phone "928-523-4951" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | Guide to financial aid | NAU |

#### Goodwill of Central & Northern Arizona

| Field | Value |
|:---|:---|
| **URL** | https://www.goodwillaz.org |
| **Phone (on file)** | 602-535-4000 |
| **Reason** | Phone "602-535-4000" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | Goodwill of Central and Northern Arizona | Shop &amp; Donate |

#### Arizona's Children Association (AzCA)

| Field | Value |
|:---|:---|
| **URL** | https://www.arizonaschildren.org |
| **Phone (on file)** | 1-800-944-7611 |
| **Reason** | Phone "1-800-944-7611" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | Home - Arizona Children&#039;s Association |

#### One•n•Ten

| Field | Value |
|:---|:---|
| **URL** | https://onenten.org |
| **Phone (on file)** | (602) 400-2601 |
| **Reason** | Phone "(602) 400-2601" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | LGBTQ Youth Support | one•n•ten |

#### St. Mary's Food Bank

| Field | Value |
|:---|:---|
| **URL** | https://www.stmarysfoodbank.org |
| **Phone (on file)** | 602-242-3663 |
| **Reason** | Phone "602-242-3663" not found; no phone numbers detected on page |
| **File** | `server/src/data/resources.ts` |
| **Page title** | St. Mary’s Food Bank of Arizona: Help Feed the Hungry |

---

## Verified Entries

| Entry | URL | Phone | Status |
|:---|:---|:---|:---|
| 988 Suicide & Crisis Lifeline | ✅ https://988lifeline.org/ | — | ✅ |
| Crisis Text Line | ✅ https://www.crisistextline.org/ | — | ✅ |
| ALWAYS | ✅ https://alwaysaz.org | ✅ (602) 248-7055 | ✅ |
| 211 Arizona | ✅ https://211arizona.org/ | ✅ 2-1-1 | ✅ |
| AHCCCS — YATI (Young Adults Transitional Insurance) | ✅ https://www.azahcccs.gov/Members/GetCovered/Categories/YATI.html | ✅ (602) 417-4000 | ✅ |
| Arizona Friends of Foster Children Foundation (AFFCF) | ✅ https://www.affcf.org/ | 🔄 (602) 438-7230 → (602) 252-9445 | ✅ |
| 988 Suicide & Crisis Lifeline | ✅ https://988lifeline.org | ✅ 988 | ✅ |
| Crisis Text Line | ✅ https://www.crisistextline.org | ✅ 741741 | ✅ |
| 211 Arizona | ✅ https://211arizona.org | ✅ 211 | ✅ |
| DNA People's Legal Services | ✅ https://dnalegalservices.org | 🔄 1-833-362-1102 → (928) 871-4151 | ✅ |
| Youth On Their Own (YOTO) | ✅ https://yoto.org | ✅ 520-293-1136 | ✅ |
| AHCCCS — Young Adult Transition Initiative (YATI) | ✅ https://www.azahcccs.gov/Members/GetCovered/Categories/YATI.html | ✅ 602-417-4000 | ✅ |
| University of Arizona — Foster Youth Programs | ✅ https://financialaid.arizona.edu | ✅ (520) 621-1858 | ✅ |
| Job Corps | 🔄 → https://www.jobcorps.gov | ✅ 1-800-733-5627 | ✅ |
| Arizona Friends of Foster Children Foundation (AFFCF) | 🔄 → https://www.affcf.org/ | ✅ 602-252-9445 | ✅ |
| Arizona Foster Youth Scholarship Fund | 🔄 → https://www.affcf.org/ways-we-help/post-secondary/scholarships/ | — | ✅ |
| Arizona Independent Living Account (IDA) | ✅ https://www.arizonaschildren.org/services/young-adult-services/ | ✅ 1-800-944-7611 | ✅ |

---

*Generated by `scripts/reverify-content.ts`. To fix a failed entry, update the data file and set `lastVerified` to today's date.*
