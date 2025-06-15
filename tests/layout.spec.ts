import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const pages = ["/", "/projects", "/resume"];

test("Navbar and footer exist on all pages", async ({ page, request }) => {
	// get personal info from the API
	const response = await request.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/personal-info`);
	expect(response.ok()).toBeTruthy();
	const personalInfo = await response.json();
	expect(personalInfo.data.email).toBeDefined();
	expect(personalInfo.data.firstName).toBeDefined();
	expect(personalInfo.data.lastName).toBeDefined();
	expect(personalInfo.data.github).toBeDefined();
	expect(personalInfo.data.linkedin).toBeDefined();
	for (const path of pages) {
		await page.goto(path);

		// Navbar
		const nav = page.getByRole("navigation");
		await expect(nav).toBeVisible();
		await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
		await expect(nav.getByRole("link", { name: "Projects" })).toBeVisible();
		await expect(nav.getByRole("link", { name: "Resume" })).toBeVisible();

		// Footer
		const footer = page.getByRole("contentinfo");
		await expect(footer).toBeVisible();
		await expect(footer.getByRole("link", { name: personalInfo.data.email })).toHaveAttribute("href", `mailto:${personalInfo.data.email}`);
		await expect(footer.getByRole("link", { name: `${personalInfo.data.firstName} ${personalInfo.data.lastName}'s github` })).toHaveAttribute("href", personalInfo.data.github);
		await expect(footer.getByRole("link", { name: `${personalInfo.data.firstName} ${personalInfo.data.lastName}'s linkedin` })).toHaveAttribute("href", personalInfo.data.linkedin);
	}
});

test("All nav links work", async ({ page }) => {
	page.goto("/");
	for (const path of pages) {
		const name = path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2);
		await page.getByRole("navigation").getByRole("link", { name }).click();
		await expect(page).toHaveURL(path);
		if (path !== "/") {
			await page.goto(path);
		}
	}
});