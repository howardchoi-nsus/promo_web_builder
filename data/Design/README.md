# Design Prompt Storage

Runtime-generated design prompt markdown files are stored in Vercel Blob using this logical path:

```text
data/Design/design prompt -{uniqueId}-{YYMMDDHHMM}.md
```

`uniqueId` is a 5-character alphanumeric `promptGroupId`. The same value is used by the matching promo input log under `data/Promo`.

The local folder exists to document the storage convention. Production runtime files are not written to the repository filesystem.
