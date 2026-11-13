// Gerado por scripts/sync-engine.mjs a partir de bootlift@v1.0.1. Não edite.
// Fonte: __fixtures__/projects do repositório do Bootlift (MIT).

export type Example = {
  id: string;
  name: string;
  path: string;
  content: string;
  expected: { ruleId: string; line: number }[];
  traps: { line: number; match: string }[];
};

export const EXAMPLES: Example[] = [
  {
    id: "pom",
    name: "pom.xml",
    path: "pom.xml",
    content:
      '<?xml version="1.0" encoding="UTF-8"?>\n<project xmlns="http://maven.apache.org/POM/4.0.0"\n         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">\n    <modelVersion>4.0.0</modelVersion>\n\n    <parent>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter-parent</artifactId>\n        <version>3.3.5</version>\n        <relativePath/>\n    </parent>\n\n    <groupId>dev.rossi.fixtures</groupId>\n    <artifactId>orders-api</artifactId>\n    <version>0.0.1-SNAPSHOT</version>\n    <name>orders-api</name>\n    <description>Fixture Bootlift: Spring Boot 3 com Maven</description>\n\n    <properties>\n        <java.version>17</java.version>\n    </properties>\n\n    <dependencies>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-web</artifactId>\n            <exclusions>\n                <exclusion>\n                    <groupId>org.springframework.boot</groupId>\n                    <artifactId>spring-boot-starter-tomcat</artifactId>\n                </exclusion>\n            </exclusions>\n        </dependency>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-undertow</artifactId>\n        </dependency>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-data-jpa</artifactId>\n        </dependency>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-validation</artifactId>\n        </dependency>\n        <dependency>\n            <groupId>com.h2database</groupId>\n            <artifactId>h2</artifactId>\n            <scope>runtime</scope>\n        </dependency>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-test</artifactId>\n            <scope>test</scope>\n        </dependency>\n    </dependencies>\n\n    <build>\n        <plugins>\n            <plugin>\n                <groupId>org.springframework.boot</groupId>\n                <artifactId>spring-boot-maven-plugin</artifactId>\n                <configuration>\n                    <executable>true</executable>\n                </configuration>\n            </plugin>\n        </plugins>\n    </build>\n</project>\n',
    expected: [
      {
        ruleId: "BOOT_VERSION",
        line: 10,
      },
      {
        ruleId: "STARTER_RENAMED",
        line: 27,
      },
      {
        ruleId: "UNDERTOW_REMOVED",
        line: 37,
      },
      {
        ruleId: "LAUNCH_SCRIPT",
        line: 65,
      },
    ],
    traps: [
      {
        line: 31,
        match: "<artifactId>spring-boot-starter-tomcat</artifactId>",
      },
      {
        line: 21,
        match: "<java.version>17</java.version>",
      },
    ],
  },
  {
    id: "gradle",
    name: "build.gradle.kts",
    path: "build.gradle.kts",
    content:
      'plugins {\n    java\n    groovy\n    id("org.springframework.boot") version "3.4.1"\n    id("io.spring.dependency-management") version "1.1.7"\n}\n\ngroup = "dev.rossi.fixtures"\nversion = "0.0.1-SNAPSHOT"\n\njava {\n    toolchain {\n        languageVersion = JavaLanguageVersion.of(21)\n    }\n}\n\nrepositories {\n    mavenCentral()\n}\n\ndependencies {\n    implementation("org.springframework.boot:spring-boot-starter-web")\n    implementation("org.springframework.boot:spring-boot-starter-aop")\n    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")\n    implementation("org.springframework.session:spring-session-data-mongodb")\n    testImplementation("org.springframework.boot:spring-boot-starter-test")\n    testImplementation(libs.spock.spring)\n}\n\ntasks.withType<Test> {\n    useJUnitPlatform()\n}\n',
    expected: [
      {
        ruleId: "BOOT_VERSION",
        line: 4,
      },
      {
        ruleId: "STARTER_RENAMED",
        line: 22,
      },
      {
        ruleId: "STARTER_RENAMED",
        line: 23,
      },
      {
        ruleId: "SESSION_REMOVED",
        line: 25,
      },
    ],
    traps: [
      {
        line: 24,
        match: '"org.springframework.boot:spring-boot-starter-data-mongodb"',
      },
      {
        line: 13,
        match: "JavaLanguageVersion.of(21)",
      },
    ],
  },
  {
    id: "yaml",
    name: "application.yml",
    path: "src/main/resources/application.yml",
    content:
      "spring:\n  application:\n    name: catalog-service\n  data:\n    mongodb:\n      uri: mongodb://localhost:27017/catalog\n      auto-index-creation: true\n  session:\n    timeout: 30m\n",
    expected: [
      {
        ruleId: "PROPERTY_RENAMED",
        line: 6,
      },
    ],
    traps: [
      {
        line: 7,
        match: "auto-index-creation: true",
      },
      {
        line: 9,
        match: "timeout: 30m",
      },
    ],
  },
  {
    id: "mockbean",
    name: "OrderControllerTest.java",
    path: "src/test/java/dev/rossi/orders/order/OrderControllerTest.java",
    content:
      'package dev.rossi.orders.order;\n\nimport static org.mockito.BDDMockito.given;\nimport static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;\nimport static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;\n\nimport java.util.List;\nimport org.junit.jupiter.api.Test;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;\nimport org.springframework.boot.test.mock.mockito.MockBean;\nimport org.springframework.test.web.servlet.MockMvc;\n\n@WebMvcTest(OrderController.class)\nclass OrderControllerTest {\n\n    @Autowired\n    private MockMvc mockMvc;\n\n    @MockBean\n    private OrderRepository repository;\n\n    @MockBean\n    private OrderEventPublisher publisher;\n\n    @Test\n    void listsOrders() throws Exception {\n        given(repository.findAll()).willReturn(List.of());\n\n        mockMvc.perform(get("/orders")).andExpect(status().isOk());\n    }\n}\n',
    expected: [
      {
        ruleId: "MOCKBEAN_REMOVED",
        line: 11,
      },
      {
        ruleId: "MOCKBEAN_REMOVED",
        line: 20,
      },
      {
        ruleId: "MOCKBEAN_REMOVED",
        line: 23,
      },
    ],
    traps: [],
  },
];
