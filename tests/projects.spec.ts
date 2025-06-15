import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import { Project } from "@/lib/defintions";
import qs from "qs";

loadEnvConfig(process.cwd());

test("Projects Rendered", async ({ page, request }) => {
	await page.goto("/projects");

	// Check for the title
	await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();

	// Get projects from the API
	const query = qs.stringify({
		populate: {
			image: true,
		},
		sort: ['sortIndex:asc'],
	}, { encodeValuesOnly: true });
	const response = await request.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?${query}`);
	expect(response.ok()).toBeTruthy();
	const projects = await response.json() as { data: Project[]; };
	expect(projects.data.length).toBeGreaterThan(0);

	// Check if each project is rendered
	for (const project of projects.data) {
		await expect(page.getByRole("heading", { name: project.title })).toBeVisible();
		await expect(page.locator(`a[href="/projects/${project.slug}"]`)).toBeVisible();
		await expect(page.getByRole("img", { name: project.image?.alternativeText || project.title })).toBeVisible();
	}
});