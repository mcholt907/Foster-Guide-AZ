import { describe, expect, it } from "vitest";
import { activeFromPathname } from "../../src/lib/teenNav";
import { getTribalStatus, tribalPatch } from "../../src/lib/prefs";
import { CONTACT_EMAIL, EMAIL_PRIVACY_NOTE, contactHref } from "../../src/lib/contact";

describe("activeFromPathname", () => {
  it.each([
    ["/en", "dashboard"],
    ["/en/", "dashboard"],
    ["/es", "dashboard"],
    ["/en/ask", "answers"],
    ["/es/ask", "answers"],
    ["/en/case", "case"],
    ["/en/team", "team"],
    ["/en/wellness", "wellness"],
    ["/en/rights", "rights"],
    ["/en/resources", "resources"],
    ["/en/future", "future"],
    ["/es/future/", "future"],
    ["/en/rights/anything", "rights"],
    ["/en/privacy", "dashboard"],
    ["/en/about", "dashboard"],
    ["/en/not-a-page", "dashboard"],
  ])("%s -> %s", (pathname, expected) => {
    expect(activeFromPathname(pathname, pathname.slice(1, 3))).toBe(expected);
  });
});

describe("tribal status helpers", () => {
  it("round-trips each answer", () => {
    for (const status of ["yes", "no", "unsure"] as const) {
      expect(getTribalStatus(tribalPatch(status))).toBe(status);
    }
  });

  it("stores tribal=true only for a clear yes", () => {
    expect(tribalPatch("yes").tribal).toBe(true);
    expect(tribalPatch("no").tribal).toBe(false);
    expect(tribalPatch("unsure").tribal).toBe(false);
    expect(tribalPatch("unsure").tribalUnsure).toBe(true);
  });

  it("reads old saved prefs that only have a boolean", () => {
    // Old "Yes" button.
    expect(getTribalStatus({ tribal: true })).toBe("yes");
    // Old "No / Not sure" button was one choice, so we can't tell which.
    expect(getTribalStatus({ tribal: false })).toBe("unknown");
  });

  it("a yes wins over a stale unsure flag", () => {
    expect(getTribalStatus({ tribal: true, tribalUnsure: true })).toBe("yes");
  });
});

describe("contact emails", () => {
  const decode = (href: string) => {
    const url = new URL(href);
    return {
      to: url.pathname,
      subject: decodeURIComponent(url.searchParams.get("subject") ?? ""),
      body: decodeURIComponent(url.searchParams.get("body") ?? ""),
      raw: href,
    };
  };

  it("uses the one published address", () => {
    expect(CONTACT_EMAIL).toBe("info@fosterhubaz.com");
  });

  it.each(["mistake", "resource", "general"] as const)("%s: addressed, subjected, and warns against personal details", (kind) => {
    for (const lang of ["en", "es"] as const) {
      const mail = decode(contactHref(kind, lang));
      expect(mail.to).toBe(CONTACT_EMAIL);
      expect(mail.subject).toContain("FosterHub AZ");
      expect(mail.body).toContain(EMAIL_PRIVACY_NOTE[lang]);
      // Spaces must be %20: mail apps show "+" literally.
      expect(mail.raw).not.toContain("+");
      expect(mail.raw).not.toMatch(/\s/);
    }
  });

  it("points people in an emergency to 911 and 988, not the inbox", () => {
    for (const lang of ["en", "es"] as const) {
      expect(EMAIL_PRIVACY_NOTE[lang]).toContain("911");
      expect(EMAIL_PRIVACY_NOTE[lang]).toContain("988");
    }
  });
});
