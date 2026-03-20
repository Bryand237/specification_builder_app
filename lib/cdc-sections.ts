import type { CdcSection } from "@/lib/cdc-template"

export type CdcAssetRef = {
  assetId: string
  fileName: string
  mimeType: string
  url: string
}

export function updateSection(
  sections: CdcSection[],
  key: string,
  patch: { title?: string; content?: string }
): { sections: CdcSection[]; updated: boolean } {
  let updated = false

  const next = sections.map((s) => {
    if (s.key === key) {
      updated = true
      return {
        ...s,
        title: patch.title ?? s.title,
        content: patch.content ?? s.content,
      }
    }

    if (s.children?.length) {
      const res = updateSection(s.children, key, patch)
      if (res.updated) {
        updated = true
        return { ...s, children: res.sections }
      }
    }

    return s
  })

  return { sections: next, updated }
}

export function addAssetToSection(
  sections: CdcSection[],
  key: string,
  asset: CdcAssetRef
): { sections: CdcSection[]; updated: boolean } {
  let updated = false

  const next = sections.map((s) => {
    if (s.key === key) {
      updated = true
      const assets = s.assets ? [...s.assets] : []
      assets.push(asset)
      return { ...s, assets }
    }

    if (s.children?.length) {
      const res = addAssetToSection(s.children, key, asset)
      if (res.updated) {
        updated = true
        return { ...s, children: res.sections }
      }
    }

    return s
  })

  return { sections: next, updated }
}
