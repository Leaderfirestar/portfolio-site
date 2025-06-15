import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

test("Navbar Works", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("link", { name: "Home" }).click();
	await expect(page).toHaveURL("/");
	await page.getByRole("link", { name: "Projects" }).click();
	await expect(page).toHaveURL("/projects");
	await page.getByRole("link", { name: "Resume" }).click();
	await expect(page).toHaveURL("/resume");
});

test("Footer", async ({ page, request }) => {
	await page.goto("/");

	// get personal info from the API
	const response = await request.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/personal-info`);
	expect(response.ok()).toBeTruthy();
	const personalInfo = await response.json();

	// Check for the mailto link in the footer
	expect(personalInfo.data.email).toBeDefined();
	await expect(page.getByRole("link", { name: personalInfo.data.email })).toHaveAttribute("href", `mailto:${personalInfo.data.email}`);

	// Verify response returned first and last name
	expect(personalInfo.data.firstName).toBeDefined();
	expect(personalInfo.data.lastName).toBeDefined();

	// Check for the GitHub link in the footer
	expect(personalInfo.data.github).toBeDefined();
	await expect(page.getByRole("link", { name: `${personalInfo.data.firstName} ${personalInfo.data.lastName}'s github` })).toHaveAttribute("href", personalInfo.data.github);

	// Check for the LinkedIn link in the footer
	expect(personalInfo.data.linkedin).toBeDefined();
	await expect(page.getByRole("link", { name: `${personalInfo.data.firstName} ${personalInfo.data.lastName}'s linkedin` })).toHaveAttribute("href", personalInfo.data.linkedin);
});