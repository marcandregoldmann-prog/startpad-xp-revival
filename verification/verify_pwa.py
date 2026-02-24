from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    url = "http://localhost:4173/startpad-xp-revival/"

    # 1. Capture console logs to check SW registration
    console_messages = []
    page.on("console", lambda msg: console_messages.append(msg.text))

    print(f"Navigating to {url}...")
    try:
        page.goto(url)
    except Exception as e:
        print(f"Failed to load page: {e}")
        browser.close()
        return

    # 2. Check title
    try:
        page.wait_for_load_state("networkidle")
        print(f"Page title: {page.title()}")
        if "ClearMind" not in page.title():
             print("Warning: Title does not contain ClearMind")
    except Exception as e:
        print(f"Error checking title: {e}")

    # 3. Check for specific content
    try:
        page.wait_for_selector("text=Start", timeout=5000)
        print("Found 'Start' text.")
    except Exception as e:
        print(f"Error finding content: {e}")

    # 4. Check manifest link
    manifest_element = page.query_selector('link[rel="manifest"]')
    if manifest_element:
        href = manifest_element.get_attribute("href")
        print(f"Manifest href: {href}")
    else:
        print("Manifest link not found!")

    # 5. Check Service Worker Registration
    # Wait a bit for SW to register
    page.wait_for_timeout(2000)

    sw_registered = False
    for msg in console_messages:
        if "Service Worker registriert" in msg:
            sw_registered = True
            break

    if sw_registered:
        print("Service Worker registration confirmed via console.")
    else:
        print("Service Worker registration message NOT found in console.")
        print("Console logs:", console_messages)

    # 6. Screenshot
    page.screenshot(path="verification/pwa_screenshot.png")
    print("Screenshot saved to verification/pwa_screenshot.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
