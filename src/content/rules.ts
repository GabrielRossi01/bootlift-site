export type Severity = "error" | "warning" | "info";
export type Scope = "java" | "build" | "config";

export type RuleDoc = {
  id: string;
  /** BOOT_VERSION reports warning below 3.5 and info on 3.5.x. */
  severities: Severity[];
  scope: Scope;
  /** Ships a one-click "Commit suggestion" in guardrail mode (README). */
  oneClick: boolean;
  before: string;
  /** null when the fix is a decision, described by rules.afterNotes. */
  after: string | null;
};

/** Facts from bootlift@v1.0.1: src/rules/catalog.ts, versions.ts and README. */
export const RULES: RuleDoc[] = [
  {
    id: "BOOT_VERSION",
    severities: ["warning", "info"],
    scope: "build",
    oneClick: false,
    before: "<version>3.3.5</version>",
    after: "<version>3.5.x</version>",
  },
  {
    id: "JAVA_BASELINE",
    severities: ["error"],
    scope: "build",
    oneClick: false,
    before: "<java.version>11</java.version>",
    after: "<java.version>17</java.version>",
  },
  {
    id: "GRADLE_VERSION",
    severities: ["error"],
    scope: "build",
    oneClick: false,
    before: "distributionUrl=…/gradle-8.5-bin.zip",
    after: "distributionUrl=…/gradle-8.14.3-bin.zip",
  },
  {
    id: "JAKARTA_NAMESPACE",
    severities: ["error"],
    scope: "java",
    oneClick: true,
    before: "import javax.persistence.Entity;",
    after: "import jakarta.persistence.Entity;",
  },
  {
    id: "JACKSON3_NAMESPACE",
    severities: ["error"],
    scope: "java",
    oneClick: false,
    before: "import com.fasterxml.jackson.databind.ObjectMapper;",
    after: "import tools.jackson.databind.ObjectMapper;",
  },
  {
    id: "MOCKBEAN_REMOVED",
    severities: ["error"],
    scope: "java",
    oneClick: true,
    before: "@MockBean",
    after: "@MockitoBean",
  },
  {
    id: "UNDERTOW_REMOVED",
    severities: ["error"],
    scope: "build",
    oneClick: false,
    before: "spring-boot-starter-undertow",
    after: "spring-boot-starter-jetty",
  },
  {
    id: "SPOCK_REMOVED",
    severities: ["warning"],
    scope: "build",
    oneClick: false,
    before: "spock-spring",
    after: null,
  },
  {
    id: "SESSION_REMOVED",
    severities: ["error"],
    scope: "build",
    oneClick: false,
    before: "spring-session-data-mongodb",
    after: null,
  },
  {
    id: "STARTER_RENAMED",
    severities: ["warning"],
    scope: "build",
    oneClick: true,
    before: "spring-boot-starter-web",
    after: "spring-boot-starter-webmvc",
  },
  {
    id: "LAUNCH_SCRIPT",
    severities: ["warning"],
    scope: "build",
    oneClick: false,
    before: "<executable>true</executable>",
    after: "java -jar app.jar",
  },
  {
    id: "PROPERTY_RENAMED",
    severities: ["warning"],
    scope: "config",
    oneClick: true,
    before: "spring.data.mongodb.uri=…",
    after: "spring.mongodb.uri=…",
  },
];
