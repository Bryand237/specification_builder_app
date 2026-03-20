import { z } from "zod"

const cdcAssetSchema = z.object({
  assetId: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  url: z.string().min(1),
})

export const cdcSectionSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    key: z.string().min(1),
    title: z.string().min(1),
    content: z.string().default(""),
    children: z.array(cdcSectionSchema).optional(),
    assets: z.array(cdcAssetSchema).optional(),
  })
)

export type CdcSection = z.infer<typeof cdcSectionSchema>
export type CdcAsset = z.infer<typeof cdcAssetSchema>

export const createCdcSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  sections: z.array(cdcSectionSchema).optional(),
})

export const updateCdcSectionSchema = z.object({
  key: z.string().min(1),
  content: z.string().optional(),
  title: z.string().optional(),
})
