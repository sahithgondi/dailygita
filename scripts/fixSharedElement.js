// scripts/fixSharedElement.js
const fs = require("fs");
const path = "node_modules/react-native-shared-element/ios/RNSharedElementTransition.m";

try {
  let fileContent = fs.readFileSync(path, "utf8");

  const patternStart = /@"style":\s*@{[^}]+}/;
  const replacement = '@"style": @{}';

  if (patternStart.test(fileContent)) {
    fileContent = fileContent.replace(patternStart, replacement);
    fs.writeFileSync(path, fileContent, "utf8");
    console.log("✅ Patched RNSharedElementTransition.m successfully.");
  } else {
    console.log("⚠️ Patch pattern not found. Maybe already patched or file structure changed.");
  }
} catch (err) {
  console.error("❌ Failed to patch RNSharedElementTransition.m:", err);
}
