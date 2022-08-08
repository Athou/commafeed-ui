import { t } from "@lingui/macro"
import { useAppSelector } from "app/store"

interface Step {
    name: string
    done: boolean
}

export const useAppLoading = () => {
    const profile = useAppSelector(state => state.user.profile)
    const settings = useAppSelector(state => state.user.settings)
    const rootCategory = useAppSelector(state => state.tree.rootCategory)

    const steps: Step[] = [
        {
            name: t`Profile`,
            done: !!settings,
        },
        {
            name: t`Settings`,
            done: !!profile,
        },
        {
            name: t`Subscriptions`,
            done: !!rootCategory,
        },
    ]

    const loading = steps.some(s => !s.done)
    const loadingPercentage = Math.round((100.0 * steps.filter(s => s.done).length) / steps.length)
    const loadingStepName = steps.find(s => !s.done)?.name

    return { steps, loading, loadingPercentage, loadingStepName }
}
