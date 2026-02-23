from playwright.sync_api import sync_playwright
import time

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to Start Page
            print("Navigating to http://localhost:8081/")
            page.goto("http://localhost:8081/", timeout=60000)
            time.sleep(5) # Wait for animations
            page.screenshot(path="verify_start_page.png")
            print("Screenshot saved: verify_start_page.png")

            # Navigate to Tasks Page
            print("Navigating to http://localhost:8081/tasks")
            page.goto("http://localhost:8081/tasks", timeout=60000)
            time.sleep(2)
            page.screenshot(path="verify_tasks_page.png")
            print("Screenshot saved: verify_tasks_page.png")

            # Navigate to Wissen Page
            print("Navigating to http://localhost:8081/wissen")
            page.goto("http://localhost:8081/wissen", timeout=60000)
            time.sleep(2)
            page.screenshot(path="verify_wissen_page.png")
            print("Screenshot saved: verify_wissen_page.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_ui()
