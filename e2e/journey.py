"""
End-to-end acceptance test for the SafeSeniors SG demo (Playwright, Python).

Runs the main user journeys on emulated PHONES (touch, mobile UA) and a laptop,
against the built site served from a GitHub-Pages-style sub-path.

Usage:
  npm run build
  mkdir -p /tmp/site && rm -rf /tmp/site/safe-seniors && cp -r dist /tmp/site/safe-seniors
  (cd /tmp/site && python3 -m http.server 4173 &)
  python3 e2e/journey.py http://localhost:4173/safe-seniors/ [screenshot_dir]

Requires: pip install playwright && playwright install chromium   (or a local Chrome)
"""
import os
import re
import sys

from playwright.sync_api import Page, expect, sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/safe-seniors/"
SHOTS = sys.argv[2] if len(sys.argv) > 2 else "e2e/screenshots"
os.makedirs(SHOTS, exist_ok=True)

PHONES = {
    "iphone-13": dict(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, has_touch=True,
                      user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"),
    "android-small": dict(viewport={"width": 360, "height": 740}, device_scale_factor=3, is_mobile=True, has_touch=True,
                          user_agent="Mozilla/5.0 (Linux; Android 13; SM-A135F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"),
}
LAPTOP = dict(viewport={"width": 1366, "height": 768})

errors: list[str] = []
results: list[tuple[str, bool, str]] = []


def check(name: str, cond: bool, detail: str = ""):
    results.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + (f" — {detail}" if detail else ""))


def points(page: Page) -> int:
    txt = page.get_by_test_id("points-pill").inner_text()
    return int(re.sub(r"[^0-9]", "", txt))


def no_h_overflow(page: Page, label: str):
    sw, iw = page.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
    check(f"no horizontal scroll: {label}", sw <= iw, f"scrollWidth={sw} innerWidth={iw}")


def small_targets(page: Page) -> list[str]:
    return page.evaluate(
        """() => [...document.querySelectorAll('button, a, [role=tab], [role=radio], select, input, textarea')]
          .filter(el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
             return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !el.closest('.sr-only') && (r.height < 40 || r.width < 40); })
          .map(el => (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30) + ` ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`)"""
    )


def close_celebrations(page: Page, max_n=6) -> list[str]:
    names = []
    for _ in range(max_n):
        cel = page.get_by_test_id("celebration")
        if cel.count() == 0:
            try:
                cel.wait_for(timeout=900)
            except Exception:
                break
        names.append(page.locator("#celebrate-title").inner_text())
        page.get_by_role("button", name=re.compile("^(Continue|继续)$")).click()
        page.wait_for_timeout(250)
    return names


def go(page: Page, route: str):
    page.goto(BASE + "#" + route)
    page.wait_for_load_state("networkidle")


def complete_lesson(page: Page, lesson_id: str, answers: list[str]):
    go(page, f"/learn/{lesson_id}")
    if page.evaluate("'speechSynthesis' in window"):
        check("read-aloud Listen button on lesson cards", page.get_by_test_id("listen").first.is_visible())
    for _ in range(4):
        page.get_by_test_id("lesson-next").click()
    for a in answers:
        page.get_by_test_id(f"quiz-option-{a}").click()
        page.get_by_test_id("quiz-check").click()
        page.get_by_test_id("quiz-next").click()
    expect(page.get_by_test_id("lesson-complete")).to_be_visible()


def answer_scenario(page: Page, verdict: str, choice: str):
    page.get_by_test_id(f"verdict-{verdict}").click()
    page.get_by_test_id(f"choice-{choice}").click()
    expect(page.get_by_test_id("scenario-feedback")).to_be_visible()


def new_user_journey(browser, device_name: str, ctx_opts: dict):
    ctx = browser.new_context(**ctx_opts, accept_downloads=True)
    page = ctx.new_page()
    page.on("console", lambda m: m.type == "error" and errors.append(f"[{device_name}] {m.text}"))
    page.on("pageerror", lambda e: errors.append(f"[{device_name}] pageerror {e}"))
    tag = device_name

    go(page, "/")
    expect(page.get_by_test_id("start-learning")).to_be_visible()
    page.screenshot(path=f"{SHOTS}/{tag}-01-welcome.png", full_page=True)
    no_h_overflow(page, f"{tag} welcome")

    # Onboarding with validation
    page.get_by_test_id("start-learning").click()
    page.get_by_test_id("onboard-go").click()
    check(f"{tag} onboarding validates nickname", page.get_by_text("Please enter at least 2 characters.").is_visible())
    page.fill("#nickname", "Uncle Tan")
    page.get_by_role("radio", name="Uncle with cap").check(force=True)
    page.screenshot(path=f"{SHOTS}/{tag}-02-onboarding.png", full_page=True)
    page.get_by_test_id("onboard-go").click()
    # First visit shows the simple "How to use this app" guide
    expect(page.get_by_test_id("help-close")).to_be_visible()
    page.screenshot(path=f"{SHOTS}/{tag}-02b-help.png", full_page=False)
    page.get_by_test_id("help-close").click()
    expect(page.get_by_test_id("greeting")).to_contain_text("Uncle Tan")
    # One-tap text size button cycles sizes
    page.get_by_test_id("textsize-button").click()
    fs = page.evaluate("getComputedStyle(document.documentElement).fontSize")
    check(f"{tag} Aa button enlarges text", fs.startswith("20"), fs)
    page.get_by_test_id("textsize-button").click()
    page.get_by_test_id("textsize-button").click()
    check(f"{tag} new user starts at 0 points", points(page) == 0)
    page.screenshot(path=f"{SHOTS}/{tag}-03-home.png", full_page=True)
    no_h_overflow(page, f"{tag} home")

    # Lesson -> points
    complete_lesson(page, "what-is-deepfake", ["b", "b", "c"])
    page.screenshot(path=f"{SHOTS}/{tag}-04-lesson-complete.png", full_page=False)
    cel = close_celebrations(page)
    check(f"{tag} lesson awards 50 points (20 + 3x10)", points(page) == 50, f"points={points(page)}")
    check(f"{tag} Deepfake Detective celebration shown", "Deepfake Detective" in cel, str(cel))

    # Identify -> feedback + daily challenge + Good Morning Monday
    go(page, "/identify")
    no_h_overflow(page, f"{tag} identify")
    page.screenshot(path=f"{SHOTS}/{tag}-05-identify.png", full_page=True)
    answer_scenario(page, "suspicious", "b")
    page.wait_for_timeout(600)
    page.screenshot(path=f"{SHOTS}/{tag}-06-identify-celebration.png", full_page=False)
    cel = close_celebrations(page)
    page.screenshot(path=f"{SHOTS}/{tag}-07-identify-feedback.png", full_page=False)
    check(f"{tag} Good Morning Monday unlocked via daily challenge", "Good Morning Monday" in cel, str(cel))
    check(f"{tag} points after scenario + daily = 90", points(page) == 90, f"points={points(page)}")
    # replay gives no points
    page.get_by_role("button", name=re.compile("Practise Again")).click()
    answer_scenario(page, "suspicious", "b")
    check(f"{tag} replay awards no extra points", points(page) == 90)

    # Rewards: open + download sticker PNG
    go(page, "/rewards")
    no_h_overflow(page, f"{tag} rewards")
    page.screenshot(path=f"{SHOTS}/{tag}-08-rewards.png", full_page=True)
    page.get_by_test_id("sticker-good-morning-monday").click()
    page.wait_for_timeout(500)
    page.screenshot(path=f"{SHOTS}/{tag}-09-sticker-modal.png", full_page=False)
    with page.expect_download() as dl:
        page.get_by_role("button", name=re.compile("Download PNG")).click()
    d = dl.value
    path = d.path()
    with open(path, "rb") as f:
        head = f.read(8)
    size = os.path.getsize(path)
    check(f"{tag} sticker downloads as real PNG", head.startswith(b"\x89PNG") and size > 20000, f"{d.suggested_filename} {size} bytes")
    expect(page.get_by_text("How to send it in WhatsApp or Telegram")).to_be_visible()
    page.keyboard.press("Escape")

    # Locked sticker shows criteria
    page.get_by_test_id("sticker-quiz-master").click()
    check(f"{tag} locked sticker explains unlock criteria", page.get_by_text("Answer 8 lesson quiz questions").first.is_visible())
    page.keyboard.press("Escape")

    # Community: join, contributions update
    go(page, "/community")
    page.get_by_test_id("join-tampines").click()
    total_before = int(re.sub(r"[^0-9]", "", page.get_by_test_id("group-total").inner_text()))
    check(f"{tag} joining shows group total (only post-join points count)", total_before == 1780, f"total={total_before}")
    go(page, "/identify")
    # answer next untried scenario safely
    page.get_by_test_id("verdict-suspicious").click()
    page.get_by_test_id("choice-c").click()  # celebrity: c = safe
    close_celebrations(page)
    go(page, "/community")
    total_after = int(re.sub(r"[^0-9]", "", page.get_by_test_id("group-total").inner_text()))
    check(f"{tag} group total updates after activity", total_after == 1790, f"total={total_after}")
    page.get_by_test_id("simulate-invite").click()
    close_celebrations(page)
    page.screenshot(path=f"{SHOTS}/{tag}-10-community.png", full_page=True)
    no_h_overflow(page, f"{tag} community")

    # Report
    go(page, "/report")
    pts_before_report = points(page)
    page.get_by_test_id("submit-report").click()
    check(f"{tag} report validates empty form", page.get_by_text("Please paste the suspicious message").is_visible())
    page.fill("#r-content", "Call me at 9123 4567 about your prize")
    check(f"{tag} report warns about personal info", page.get_by_text("may contain a phone number").is_visible())
    page.get_by_test_id("load-example").click()
    page.get_by_test_id("submit-report").click()
    expect(page.get_by_test_id("report-received")).to_contain_text("Demo report received — awaiting review.")
    check(f"{tag} report history shows Submitted", page.get_by_test_id("report-history").get_by_text("Submitted").is_visible())
    check(f"{tag} reports award no points", points(page) == pts_before_report)
    page.screenshot(path=f"{SHOTS}/{tag}-11-report.png", full_page=True)
    no_h_overflow(page, f"{tag} report")

    # Progress page and persistence after refresh
    go(page, "/progress")
    page.screenshot(path=f"{SHOTS}/{tag}-12-progress.png", full_page=True)
    no_h_overflow(page, f"{tag} progress")
    p1 = points(page)
    page.reload()
    page.wait_for_load_state("networkidle")
    check(f"{tag} progress persists after refresh", points(page) == p1 and "#/progress" in page.url, f"{p1} -> {points(page)}")

    # Accessibility settings: text size + Chinese
    go(page, "/profile")
    page.get_by_test_id("textsize-xl").click()
    fs = page.evaluate("getComputedStyle(document.documentElement).fontSize")
    check(f"{tag} text size XL applied", fs.startswith("20"), fs)
    page.get_by_role("radio", name="简体中文").click()
    go(page, "/home")
    page.screenshot(path=f"{SHOTS}/{tag}-13-home-zh-xl.png", full_page=True)
    no_h_overflow(page, f"{tag} home zh + XL text")
    check(f"{tag} Chinese UI applied", page.get_by_text("今日挑战").first.is_visible())
    tiny = small_targets(page)
    check(f"{tag} tap targets >= 40px on home (XL)", len(tiny) == 0, "; ".join(tiny[:8]))

    # Reset
    go(page, "/profile")
    page.get_by_test_id("reset-demo").click()
    page.get_by_role("dialog").get_by_role("button", name=re.compile("Reset|重置")).click()
    expect(page.get_by_test_id("start-learning")).to_be_visible()
    stored = page.evaluate("localStorage.getItem('safeseniors-sg-demo-v1')")
    check(f"{tag} reset returns to welcome with clean state", stored is None or '"profile":null' in stored)
    ctx.close()


def guided_demo(browser, device_name: str, ctx_opts: dict):
    ctx = browser.new_context(**ctx_opts, accept_downloads=True)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(f"[{device_name}-demo] pageerror {e}"))
    tag = f"{device_name}-demo"
    go(page, "/")
    page.get_by_test_id("welcome-presentation-demo").click()
    expect(page.get_by_test_id("guided-demo")).to_be_visible()
    check(f"{tag} demo profile = Auntie Mary, 70 pts", "Auntie Mary" in page.get_by_test_id("greeting").inner_text() and points(page) == 70)
    page.wait_for_timeout(1000)
    page.screenshot(path=f"{SHOTS}/{tag}-01-start.png", full_page=False)
    # Step 2: lesson via the highlighted UI
    page.get_by_role("button", name=re.compile("Go there")).click()
    page.get_by_test_id("start-spotting-suspicious").click()
    for _ in range(4):
        page.get_by_test_id("lesson-next").click()
    for a in ["b", "b", "b"]:
        page.get_by_test_id(f"quiz-option-{a}").click()
        page.get_by_test_id("quiz-check").click()
        page.get_by_test_id("quiz-next").click()
    page.wait_for_timeout(500)
    page.screenshot(path=f"{SHOTS}/{tag}-02-rising-star.png", full_page=False)
    cel = close_celebrations(page)
    check(f"{tag} Rising Star at 120 points", "Rising Star" in cel and points(page) == 120, f"{cel} {points(page)}")
    # Step 3-5
    page.get_by_role("button", name=re.compile("Go there")).click()
    answer_scenario(page, "suspicious", "b")
    cel = close_celebrations(page)
    check(f"{tag} Good Morning Monday unlocked live", "Good Morning Monday" in cel and points(page) == 160, f"{cel} {points(page)}")
    # Step 6: share/download
    page.get_by_role("button", name=re.compile("Go there")).click()
    page.get_by_test_id("sticker-good-morning-monday").click()
    page.wait_for_timeout(400)
    with page.expect_download():
        page.get_by_role("button", name=re.compile("Download PNG")).click()
    page.keyboard.press("Escape")
    # Step 7
    page.get_by_role("button", name=re.compile("Go there")).click()
    page.wait_for_timeout(1200)
    expect(page.get_by_text("Demo complete 🎉").first).to_be_visible()
    total = int(re.sub(r"[^0-9]", "", page.get_by_test_id("group-total").inner_text()))
    check(f"{tag} all 7 guided steps complete; group at 1,940", total == 1940, f"total={total}")
    page.screenshot(path=f"{SHOTS}/{tag}-03-complete.png", full_page=False)
    ctx.close()


def share_sheet_check(browser):
    """Phones with the Web Share API: Share must hand a real PNG file to navigator.share()."""
    ctx = browser.new_context(**PHONES["iphone-13"])
    ctx.add_init_script("""
      window.__shared = null;
      navigator.canShare = (d) => !!(d && d.files && d.files.length);
      navigator.share = async (d) => { const f = d.files[0]; window.__shared = { name: f.name, type: f.type, size: f.size, text: d.text }; };
    """)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(f"[share] pageerror {e}"))
    go(page, "/")
    page.get_by_test_id("demo-user").click()
    go(page, "/rewards")
    page.get_by_test_id("sticker-deepfake-detective").click()
    btn = page.get_by_role("button", name=re.compile("^Share$"))
    expect(btn).to_be_enabled()
    btn.click()
    page.wait_for_function("window.__shared !== null")
    shared = page.evaluate("window.__shared")
    check("phone share sheet receives sticker PNG file", shared["type"] == "image/png" and shared["size"] > 20000, str(shared))
    ctx.close()


with sync_playwright() as p:
    exe = os.environ.get("CHROME_PATH")
    browser = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
    for name, opts in PHONES.items():
        new_user_journey(browser, name, opts)
        guided_demo(browser, name, opts)
    share_sheet_check(browser)
    new_user_journey(browser, "laptop", LAPTOP)
    guided_demo(browser, "laptop", LAPTOP)
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
if errors:
    print("Console/page errors:")
    for e in errors:
        print("  ", e)
sys.exit(1 if failed or errors else 0)
