import { db } from '@/lib/db'

export const settingsService = {
  async get(key: string) {
    const setting = await db.storeSetting.findUnique({ where: { key } })
    return setting?.value || null
  },

  async getByGroup(group: string) {
    const settings = await db.storeSetting.findMany({ where: { group } })
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>)
  },

  async set(key: string, value: string, group: string) {
    await db.storeSetting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group }
    })
  },

  async setMany(settings: Array<{ key: string; value: string; group: string }>) {
    await db.$transaction(
      settings.map(s => db.storeSetting.upsert({
        where: { key: s.key },
        update: { value: s.value, group: s.group },
        create: { key: s.key, value: s.value, group: s.group }
      }))
    )
  },

  async getStoreSettings() { return this.getByGroup('store') },
  async getShippingSettings() { return this.getByGroup('shipping') },
  async getHomepageSettings() { return this.getByGroup('homepage') },
  async getSocialSettings() { return this.getByGroup('social') },
  async getPolicySettings() { return this.getByGroup('policy') },

  async updateStoreSettings(data: any) {
    const settings = Object.entries(data).map(([key, value]) => ({ key, value: String(value), group: 'store' }))
    await this.setMany(settings)
  },
  async updateShippingSettings(data: any) {
    const settings = Object.entries(data).map(([key, value]) => ({ key, value: String(value), group: 'shipping' }))
    await this.setMany(settings)
  },
  async updateHomepageSettings(data: any) {
    const settings = Object.entries(data).map(([key, value]) => ({ key, value: String(value), group: 'homepage' }))
    await this.setMany(settings)
  },
  async updateSocialSettings(data: any) {
    const settings = Object.entries(data).map(([key, value]) => ({ key, value: String(value), group: 'social' }))
    await this.setMany(settings)
  },
  async updatePolicySettings(data: any) {
    const settings = Object.entries(data).map(([key, value]) => ({ key, value: String(value), group: 'policy' }))
    await this.setMany(settings)
  }
}
