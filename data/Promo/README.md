# Promo Input Storage

Runtime-generated promo builder input markdown files are stored in Vercel Blob using this logical path:

```text
data/Promo/promo input -{uniqueId}-{YYMMDDHHMM}.md
```

`uniqueId` is a 5-character alphanumeric `promptGroupId`. The same value is used by the matching design prompt under `data/Design`, so both files can be grouped later.

The local folder exists to document the storage convention. Production runtime files are not written to the repository filesystem.
