export const WORKFLOW = `name: Spring Boot 4 readiness
on: [pull_request]

permissions:
  contents: read
  pull-requests: write

jobs:
  bootlift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: GabrielRossi01/bootlift@v1
        with:
          fail-on: error
`;

/** Defaults from bootlift@v1.0.1 action.yml / README. null = empty. */
export const INPUTS = [
  { name: "path", default: "." },
  { name: "mode", default: null },
  { name: "fail-on", default: "error" },
  { name: "comment-on-pr", default: "true" },
  { name: "suggestions", default: "true" },
  { name: "github-token", default: "${{ github.token }}" },
] as const;

export const OUTPUTS = ["score", "blocking", "errors"] as const;
