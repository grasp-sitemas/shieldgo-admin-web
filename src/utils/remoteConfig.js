import { remoteConfig } from '../firebaseInit'
import { getValue } from 'firebase/remote-config'

export const getFeatureFlag = async key => {
    const value = getValue(remoteConfig, key)

    if (value.getSource() === 'static') {
        return value.asString()
    } else if (value.getSource() === 'default') {
        return value.asString()
    } else {
        const stringValue = value.asString()
        if (!isNaN(stringValue)) {
            return value.asNumber()
        } else if (stringValue === 'true' || stringValue === 'false') {
            return value.asBoolean()
        } else {
            return stringValue
        }
    }
}
