from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 812}) # Mobile viewport as it's a mobile-first app
        page = context.new_page()

        # Start Page
        print("Navigating to Start Page...")
        page.goto("http://localhost:8082/")
        page.wait_for_timeout(2000) # Wait for animations
        page.screenshot(path="verify_start_page.png")
        print("Captured Start Page.")

        # Tasks Page
        print("Navigating to Tasks Page...")
        page.goto("http://localhost:8082/tasks")
        page.wait_for_timeout(2000)
        page.screenshot(path="verify_tasks_page.png")
        print("Captured Tasks Page.")

        # Wissen Page
        print("Navigating to Wissen Page...")
        page.goto("http://localhost:8082/wissen")
        page.wait_for_timeout(2000)
        page.screenshot(path="verify_wissen_page.png")
        print("Captured Wissen Page.")

        browser.close()

if __name__ == "__main__":
    run()
