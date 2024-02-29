import { useEffect, useState } from 'react'

export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const valueInLocalStorage = localStorage.getItem(key)
        if (valueInLocalStorage) {
            return JSON.parse(valueInLocalStorage)
        }
        else {
            if (typeof initialValue === 'function') {
                return initialValue();
            }
            else {
                return initialValue
            }
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}
