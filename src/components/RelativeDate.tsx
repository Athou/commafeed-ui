import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { useState } from "react"
import { useInterval } from "react-use"

export function RelativeDate(props: { date: Date | number | undefined }) {
    const [now, setNow] = useState(new Date())
    useInterval(() => setNow(new Date()), 60 * 1000)

    if (!props.date) return <Trans>N/A</Trans>
    return <>{dayjs(props.date).from(dayjs(now))}</>
}
