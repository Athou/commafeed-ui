import dayjs from "dayjs"
import { useState } from "react"
import { useInterval } from "react-use"

export function RelativeDate(props: { date: Date | number }) {
    const [now, setNow] = useState(new Date())
    useInterval(() => setNow(new Date()), 60 * 1000)

    if (!props.date) return <>"N/A"</>
    return <>{dayjs(props.date).from(dayjs(now))}</>
}
