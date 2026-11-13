export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bootlift-site.vercel.app",
  version: "v1.0.1",
  uses: "GabrielRossi01/bootlift@v1",
  repo: "https://github.com/GabrielRossi01/bootlift",
  repoApi: "https://api.github.com/repos/GabrielRossi01/bootlift",
  marketplace:
    "https://github.com/marketplace/actions/bootlift-spring-boot-4-readiness-check",
  license: "https://github.com/GabrielRossi01/bootlift/blob/main/LICENSE",
  contributing:
    "https://github.com/GabrielRossi01/bootlift/blob/main/CONTRIBUTING.md",
  demoPulls: "https://github.com/GabrielRossi01/bootlift-demo/pulls?q=is%3Apr",
  author: {
    name: "Gabriel Oliveira Rossi",
    portfolio: "https://rossidev.vercel.app",
    linkedin: "https://www.linkedin.com/in/gabriel-oliveira-rossi/",
  },
} as const;
