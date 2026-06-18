#!/usr/bin/env python3
"""Take screenshot of HTML page using Playwright"""
import sys
from playwright.sync_api import sync_playwright

url = sys.argv[1]
output = sys.argv[2]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 2000})
    page.goto(url, wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.screenshot(path=output, full_page=True)
    browser.close()
    print(f"Screenshot saved: {output}")
