import React, { useState } from 'react'

const useOrdinalNumber = () => {
    // const [ordinalNumber, setOrdinalNumber] = useState('')

    const format = (i) => {

        let j = i % 10,
            k = i % 100;
        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    }

    return {format}
}

export default useOrdinalNumber