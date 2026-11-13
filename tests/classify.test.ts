import { describe, expect, it } from "vitest";
import { classify } from "@/lib/classify";

describe("classify", () => {
  it.each([
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "gradle.properties",
    "gradle-wrapper.properties",
    "libs.versions.toml",
    "gradle/libs.versions.toml",
    "gradle/wrapper/gradle-wrapper.properties",
  ])("%s is a build file", (name) => {
    expect(classify(name)).toBe("build");
  });

  it.each([
    "application.properties",
    "application.yml",
    "application.yaml",
    "application-prod.yml",
    "application-local.properties",
    "bootstrap.yml",
    "bootstrap-dev.yaml",
    "src/main/resources/application.yml",
  ])("%s is a config file", (name) => {
    expect(classify(name)).toBe("config");
  });

  it.each([
    "OrderController.java",
    "Catalog.kt",
    "src/test/java/dev/rossi/orders/order/OrderControllerTest.java",
    "src\\main\\java\\App.java",
  ])("%s is code", (name) => {
    expect(classify(name)).toBe("java");
  });

  it.each([
    "README.md",
    "settings.gradle.kts",
    "messages.properties",
    "logback.xml",
    "my-application.yml",
    "application.json",
    "Build.gradle",
    "",
  ])("%s is ignored", (name) => {
    expect(classify(name)).toBeUndefined();
  });

  it("trims whitespace around the name", () => {
    expect(classify("  pom.xml  ")).toBe("build");
  });
});
