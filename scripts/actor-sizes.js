import { CONSTANTS } from './constants.js'
import { checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from './utils.js'
import { ActorSizesForm } from './forms/config-form.js'

const property = 'actorSizes'

/**
 * Register
 */
export function register () {
    registerSettings()

    loadTemplates([
        CONSTANTS.ACTOR_SIZES.TEMPLATE.FORM,
        CONSTANTS.ACTOR_SIZES.TEMPLATE.LIST
    ])
}

/**
 * Register settings
 */
function registerSettings () {
    registerMenu(
        CONSTANTS.ACTOR_SIZES.MENU.KEY,
        {
            hint: game.i18n.localize(CONSTANTS.ACTOR_SIZES.MENU.HINT),
            label: game.i18n.localize(CONSTANTS.ACTOR_SIZES.MENU.LABEL),
            name: game.i18n.localize(CONSTANTS.ACTOR_SIZES.MENU.NAME),
            icon: CONSTANTS.ACTOR_SIZES.MENU.ICON,
            type: ActorSizesForm,
            restricted: true,
            scope: 'world'
        }
    )

    registerSetting(
        CONSTANTS.ACTOR_SIZES.SETTING.KEY,
        {
            scope: 'world',
            config: false,
            type: Object,
            default: foundry.utils.deepClone(CONFIG.CUSTOM_DND5E[property])
        }
    )
}

/**
 * Set CONFIG.DND5E.actorSizes
 * @param {object} data
 */
export function setConfig (data) {
    const buildConfig = (data) => Object.fromEntries(
        Object.entries(data)
            .filter(([_, value]) => value.visible || value.visible === undefined)
            .map(([key, value]) => [
                key,
                {
                    abbreviation: game.i18n.localize(value.abbreviation),
                    ...(value.capacityMultiplier !== undefined && { capacityMultiplier: value.capacityMultiplier }),
                    ...(value.dynamicTokenScale !== undefined && { dynamicTokenScale: value.dynamicTokenScale }),
                    label: game.i18n.localize(value.label),
                    ...(value.token !== undefined && { token: value.token })
                }
            ])
    )

    if (checkEmpty(data)) {
        if (checkEmpty(CONFIG.DND5E[property])) {
            resetDnd5eConfig(property)
        }
        return
    }

    const config = buildConfig(data)
    config && (CONFIG.DND5E[property] = config)
}
