---
"@hzblj/zyplot": patch
"@hzblj/zyplot-core": patch
---

Add `repository` metadata and a bundled LICENSE file to both published
packages. npm verifies a provenance-signed publish against `repository.url`,
so the missing field left `@hzblj/zyplot-core` unpublishable.
