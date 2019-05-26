import { createMuiTheme } from "@material-ui/core/styles"

export const Themes = {
    default: createMuiTheme({}),
    dark: createMuiTheme({
        palette: {
            type: "dark"
        }
    })
}
