import { Image } from "@mantine/core"
import logo from "assets/logo.svg"

export interface LogoProps {
    size: number
}

export const Logo = (props: LogoProps) => {
    return <Image src={logo} width={props.size} />
}
