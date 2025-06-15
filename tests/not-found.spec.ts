import { expect, test } from "@playwright/test";

test("404 Page Not Found", async ({ page }) => {
	await page.goto("/non-existent-page");

	// Check if the 404 message is displayed
	await expect(page.getByRole("heading", { name: "404 - Page Not Found" })).toBeVisible();
	await expect(page.getByText("The page you are looking for does not exist.")).toBeVisible();
	await expect(page.getByRole("link", { name: "home page" })).toHaveAttribute("href", "/");
	await page.getByRole("link", { name: "home page" }).click();
	await expect(page).toHaveURL("/");
});