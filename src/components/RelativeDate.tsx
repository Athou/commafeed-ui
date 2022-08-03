import dayjs from "dayjs"

export function RelativeDate(props: { date: Date | number }) {
    if (!props.date) return <>"N/A"</>
    return <>{dayjs(props.date).fromNow()}</>
}
