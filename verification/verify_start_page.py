
import asyncio
from playwright.async_api import async_playwright, expect

async def verify_start_page():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the start page
        await page.goto("http://localhost:8080/")

        # Wait for "Links" section
        await expect(page.get_by_text("Links")).to_be_visible()

        # Find the specific "Bearbeiten" button in the Links section
        # The structure is: section -> div -> h2(Links) ... button(Bearbeiten)
        # We can locate it by finding the button that contains "Bearbeiten"

        # Click "Bearbeiten"
        await page.get_by_role("button", name="Bearbeiten").click()

        # Wait for "Fertig" button to appear (it replaces Bearbeiten)
        await expect(page.get_by_role("button", name="Fertig").first).to_be_visible()

        # Take a screenshot
        await page.screenshot(path="verification/start_page_optimized.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_start_page())
