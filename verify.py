import time
from playwright.sync_api import sync_playwright

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # 1. Dashboard
        print("Navigating to Dashboard...")
        page.goto("http://localhost:5173")
        time.sleep(3) # wait for animations
        page.screenshot(path="dashboard.png")
        print("Dashboard screenshot taken")

        # 2. Tasks
        print("Navigating to Tasks...")
        page.goto("http://localhost:5173/tasks")
        time.sleep(2)
        page.screenshot(path="tasks.png")
        print("Tasks screenshot taken")

        # 3. Habits
        print("Navigating to Habits...")
        page.goto("http://localhost:5173/habits")
        time.sleep(2)
        page.screenshot(path="habits.png")
        print("Habits screenshot taken")

        # 4. Settings
        print("Navigating to Settings...")
        page.goto("http://localhost:5173/settings")
        time.sleep(2)
        page.screenshot(path="settings.png")
        print("Settings screenshot taken")

        browser.close()

if __name__ == "__main__":
    verify_dashboard()
