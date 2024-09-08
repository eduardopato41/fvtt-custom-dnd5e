import { CONSTANTS, MODULE } from '../constants.js'
import { deleteProperty, getFlag, setFlag, unsetFlag } from '../utils.js'
import { CountersForm } from './counters-form.js'

const form = 'counters-form-individual'

export class CountersFormIndividual extends CountersForm {
    constructor (entity) {
        super(entity)
        this.entity = entity
    }

    static DEFAULT_OPTIONS = {
        form: {
            handler: CountersFormIndividual.submit
        },
        id: `${MODULE.ID}-${form}`,
        window: {
            title: 'CUSTOM_DND5E.form.counters.title'
        }
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE.ID}/templates/${form}.hbs`
        }
    }

    #getSelects () {
        return {
            type: {
                choices: {
                    checkbox: 'CUSTOM_DND5E.checkbox',
                    fraction: 'CUSTOM_DND5E.fraction',
                    number: 'CUSTOM_DND5E.number',
                    successFailure: 'CUSTOM_DND5E.successFailure'
                }
            }
        }
    }

    async _prepareContext () {
        this.counters = getFlag(this.entity, 'counters') || {}
        return {
            counters: this.counters,
            selects: this.#getSelects()
        }
    }

    static async submit (event, form, formData) {
        const ignore = ['actorType', 'delete', 'key']

        // Get list of properties to delete
        const deleteKeys = Object.entries(formData.object)
            .filter(([key, value]) => key.split('.').pop() === 'delete' && value === 'true')
            .map(([key, _]) => key.split('.').slice(0, -1).join('.'))

        // Delete properties from this.setting
        deleteKeys.forEach(key => {
            const setting = this.counters
            deleteProperty(setting, key)
        })

        // Delete properties from formData
        Object.keys(formData.object).forEach(key => {
            if (deleteKeys.includes(key.split('.').slice(0, -1)[0])) {
                delete formData.object[key]
            }
        })

        // Set properties in this.setting
        Object.entries(formData.object).forEach(([key, value]) => {
            if (ignore.includes(key.split('.').pop())) { return }
            foundry.utils.setProperty(this.counters, key, value)
        })

        await unsetFlag(this.entity, 'counters')
        await setFlag(this.entity, 'counters', this.counters)
    }
}
